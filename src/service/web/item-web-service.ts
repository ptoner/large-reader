import { inject, injectable } from "inversify";
import { Author } from "../../dto/author";
import { Channel } from "../../dto/channel";
import { Image } from "../../dto/image";
import { Item } from "../../dto/item";
import { Animation } from "../../dto/animation";

import { AttributeSelectionViewModel } from "../../dto/viewmodel/attribute-selection-view-model";


import { ItemViewModel } from "../../dto/viewmodel/item-view-model";
import { AnimationService } from "../animation-service";
import { AuthorService } from "../author-service";
import { ChannelService } from "../channel-service";
import { QuillService } from "../core/quill-service";
import { SchemaService } from "../core/schema-service";
import { ImageService } from "../image-service";
import { ItemService } from "../item-service";

import he from "he"
import { ItemPage, RowItemViewModel } from "../../dto/item-page";
import { ItemPageService } from "../item-page-service";
import { Slideshow } from "../../dto/slideshow";
import { AttributeReport, AttributeTotal } from "../../dto/viewmodel/attribute-report";
import { ExploreViewModel } from "../../dto/viewmodel/explore-view-model";

const { DOMParser, XMLSerializer } = require('@xmldom/xmldom')

const parser = new DOMParser()

@injectable()
class ItemWebService {

    @inject("ItemService")
    private itemService: ItemService

    @inject("ChannelService")
    private channelService: ChannelService

    @inject("AuthorService")
    private authorService: AuthorService

    @inject("ImageService")
    private imageService: ImageService

    @inject("SchemaService")
    private schemaService: SchemaService

    @inject("QuillService")
    private quillService: QuillService

    @inject("AnimationService")
    private animationService: AnimationService

    @inject("ItemPageService")
    private itemPageService: ItemPageService


    @inject("baseURI")
    private baseURI: string

    constructor() {}

    async get(_id: string): Promise<ItemViewModel> {

        let item:Item = await this.itemService.get(_id)

        //Get channel
        const channel = await this.channelService.get()

        //Get attribute report
        const attributeReport:AttributeReport = await this.itemService.getAttributeReport()

        return this.getViewModel(item, channel, attributeReport)
    }

    async getViewModel(item: Item, channel:Channel, attributeReport:AttributeReport): Promise<ItemViewModel> {

        let attributeSelections:AttributeSelectionViewModel[] = []

        let author: Author
        let coverImage:Image
        let animation:Animation

        let animationContentHTML

        //Get author
        if (channel.authorId) {
            author = await this.authorService.get(channel.authorId)
        }

        //Only show attributes that are valid at the category level. 
        if (channel.attributeOptions.length > 0) {

            for (let ao of channel.attributeOptions) {

                //find the one selected by this item
                let selections = item?.attributeSelections?.filter( as => ao?.traitType == as?.traitType)

                let selection = selections?.length > 0 ? selections[0].value : undefined


                let attributeTotals:AttributeTotal[] = attributeReport.totals[ao.traitType]

                let matches = attributeTotals?.filter( at => at.value == selection)


                attributeSelections.push({
                    id: ao.id,
                    traitType: ao.traitType,
                    values: ao.values,
                    value: selection,
                    attributeTotal: matches?.length > 0 ? matches[0] : undefined
                })

            }

        }

        //Get image
        if (item.coverImageId) {
            coverImage = await this.imageService.get(item.coverImageId)
        }

        //Get animation
        if (item.animationId) {

            animation = await this.animationService.get(item.animationId)

            let page = parser.parseFromString(animation.content, 'text/html')

            let body = page.getElementsByTagName('body')[0]
            
            animationContentHTML = he.unescape(new XMLSerializer().serializeToString(body))

            //Swap body tag to a div
            animationContentHTML = "<div" + animationContentHTML.slice(5)
            animationContentHTML = animationContentHTML.substring(0, animationContentHTML.length - 7) + "</div>"

                
        }


        //Get image data and re-insert it into the content ops
        if (item.content?.ops?.length > 0) {

            let ops = []

            for (let op of item.content.ops) {

                if (op.insert && op.insert.ipfsimage) {

                    let image:Image = await this.imageService.get(op.insert.ipfsimage.cid)
            
                    op.insert.ipfsimage.src = await this.imageService.getUrl(image)

                    // console.log(op.src)
                }

                ops.push(op)
            }

            item.content.ops = ops

        }



        return {
            item: item,
            animation:animation,
            animationContentHTML: animationContentHTML,
            contentHTML: await this.quillService.translateContent(item.content),
            channel: channel,
            author: author,
            authorDisplayName: this.authorService.getDisplayName(author),
            attributeSelections: attributeSelections,
            coverImage: coverImage
        }

    }

    async getMintViewModel(item: Item, channel:Channel): Promise<ItemViewModel> {

        let attributeSelections:AttributeSelectionViewModel[] = []

        let author: Author
        let coverImage:Image
        let animation:Animation

        //Get image
        if (item.coverImageId) {
            coverImage = await this.imageService.get(item.coverImageId)
        }

        return {
            item: item,
            animation:animation,
            channel: channel,
            author: author,
            attributeSelections: attributeSelections,
            coverImage: coverImage
        }

    }

    async getSearchViewModel(item: Item, channel:Channel): Promise<ItemViewModel> {

        let attributeSelections:AttributeSelectionViewModel[] = []

        let author: Author
        let coverImage:Image
        let animation:Animation

        //Get image
        // if (item.coverImageId) {
        //     coverImage = await this.imageService.get(item.coverImageId)
        // }

        return {
            item: item,
            animation:animation,
            channel: channel,
            author: author,
            attributeSelections: attributeSelections,
            // coverImage: coverImage
        }

    }

    async getExploreViewModel(PER_PAGE:number) : Promise<ExploreViewModel> {

        await this.schemaService.load(["items", "channels", "authors", "images"])

        //Get channel
        const channel = await this.channelService.get()

        let items:RowItemViewModel[] = await this.exploreList(0, PER_PAGE)

        return {
            items: items,
            attributeOptions: channel.attributeOptions
        }

        

    }


    async list(skip: number, limit?:number): Promise<ItemViewModel[]> {

        let result: ItemViewModel[] = []

        //Get channel
        const channel = await this.channelService.get()

        //Get attribute report
        const attributeReport:AttributeReport = await this.itemService.getAttributeReport()
        
        let items: Item[] = await this.itemService.list(skip, limit)

        for (let item of items) {
            result.push(await this.getViewModel(item, channel, attributeReport))
        }

        return result

    }

    async exploreList(skip: number, limit?:number): Promise<RowItemViewModel[]> {

        await this.schemaService.load(["items", "channels", "authors", "images"])
        
        let items: Item[] = await this.itemService.list(skip, limit)

        return this._createRowItemViewModels(items)

    }

    async exploreQuery(params:any): Promise<RowItemViewModel[]> {

        await this.schemaService.load(["items", "channels", "authors", "images"])
        
        let items: Item[] = await this.itemService.exploreQuery(params)

        let viewModels:RowItemViewModel[] = await this._createRowItemViewModels(items)

        return viewModels

    }





    async mintList(skip: number, limit?:number): Promise<ItemViewModel[]> {

        let result: ItemViewModel[] = []

        //Get channel
        const channel = await this.channelService.get()
        
        let items: Item[] = await this.itemService.list(skip, limit)

        for (let item of items) {
            result.push(await this.getMintViewModel(item, channel))
        }

        return result

    }

    async buildItemPages(skip:number, limit?:number, perPage?:number) : Promise<ItemPage[]> {

        await this.schemaService.load(["items", "channels", "images"])

        let result: ItemPage[] = []

        let items: Item[] = await this.itemService.list(skip, limit)

        let viewModels:RowItemViewModel[] = [] 

        //Create view models
        for (let item of items) {

            let coverImage = await this.imageService.get(item.coverImageId)

            viewModels.push({
                _id: item._id,
                coverImageGenerated: coverImage.generated ? true : false,
                coverImageId: coverImage._id,
                title: `${item.title ? item.title + ' ' : ''} #${item.tokenId}`,
                tokenId: item.tokenId
            })

        }

        //Break into rows
        for (let i = 0; i < viewModels.length; i += perPage) {
            result.push({
                items: viewModels.slice(i, i + perPage)
            })
        }


        return result

    }

    async itemPage(pageNumber:number) : Promise<ItemPage> {
        return this.itemPageService.get(pageNumber)
    }

    async query(query:string) : Promise<Item[]> {

        await this.schemaService.load(["items", "channels"])

        let results = await this.itemService.query(query)


        //Get channel
        const channel = await this.channelService.get()

        let viewModels: ItemViewModel[] = []

        for (let item of results) {
            viewModels.push(await this.getSearchViewModel(item, channel))
        }


        return viewModels
    }

    async buildSlideshow() : Promise<SlideShowElement[]> {

        await this.schemaService.load(["items", "channels", "images"])

        let items: Item[] = await this.itemService.list(0, 100000)

        return items.map( (item) => {

            return {
                html: `<iframe src="${this.baseURI}backup/export/animations/${item.animationId}.html"></iframe>`
            }

        })

    }

    async slideshow() : Promise<Slideshow> {
        return this.itemService.getSlideshow()
    }

    private async _createRowItemViewModels(items:Item[]) : Promise<RowItemViewModel[]> {

        let viewModels:RowItemViewModel[] = [] 

        // //Create view models
        for (let item of items) {

            let coverImage = await this.imageService.get(item.coverImageId)

            viewModels.push({
                _id: item._id,
                coverImageGenerated: coverImage.generated ? true : false,
                coverImageId: coverImage._id,
                title: `${item.title ? item.title + ' ' : ''} #${item.tokenId}`,
                tokenId: item.tokenId
            })

        }

        return viewModels

    }



}


interface SlideShowElement {
    html?:string
    caption?:string 
    url?:string 
}

export {
    ItemWebService
}