import { inject, injectable } from "inversify";
import { Author } from "../../dto/author";
import { Channel } from "../../dto/channel";
import { Item } from "../../dto/item";
import { AttributeSelectionViewModel } from "../../dto/viewmodel/attribute-selection-view-model";


import { ItemViewModel } from "../../dto/viewmodel/item-view-model";
import { AuthorService } from "../author-service";
import { ChannelService } from "../channel-service";
import { ItemService } from "../item-service";

@injectable()
class ItemWebService {

    @inject("ItemService")
    private itemService: ItemService

    @inject("ChannelService")
    private channelService: ChannelService

    @inject("AuthorService")
    private authorService: AuthorService

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

        return {
            item: item,
            channel: channel,
            author: author,
            authorDisplayName: this.authorService.getDisplayName(author),
            attributeSelections: attributeSelections,
            coverImage: item.coverImageId
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

}

export {
    ItemWebService
}