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


    @inject("baseURI")
    private baseURI: string

    constructor() {}

    async get(_id: string): Promise<ItemViewModel> {

        let item:Item = await this.itemService.get(_id)

        //Get channel
        const channel = await this.channelService.get()

        return this.getViewModel(item, channel)
    }

    async getViewModel(item: Item, channel:Channel): Promise<ItemViewModel> {

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

                attributeSelections.push({
                    id: ao.id,
                    traitType: ao.traitType,
                    values: ao.values,
                    value: selections?.length > 0 ? selections[0].value : '' 
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



    async list(skip: number, limit?:number): Promise<ItemViewModel[]> {

        let result: ItemViewModel[] = []

        //Get channel
        const channel = await this.channelService.get()
        
        let items: Item[] = await this.itemService.list(skip, limit)

        for (let item of items) {
            result.push(await this.getViewModel(item, channel))
        }

        return result

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


    async query(query:string) : Promise<Item[]> {

        await this.schemaService.load()

        let results = await this.itemService.query(query)


        //Get channel
        const channel = await this.channelService.get()

        let viewModels: ItemViewModel[] = []

        for (let item of results) {
            viewModels.push(await this.getSearchViewModel(item, channel))
        }


        return viewModels
    }


    async slideshow() : Promise<SlideShowElement[]> {

        let items: Item[] = await this.itemService.list(0, 100000)

        return items.map( (item) => {

            return {
                html: `<iframe src="${this.baseURI}backup/animations/${item.animationId}.html"></iframe>`
            }

        })


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