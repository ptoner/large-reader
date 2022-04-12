import { injectable } from "inversify";
import moment from "moment";
import { Author } from "../../dto/author";
import { Channel } from "../../dto/channel";
import { Image } from "../../dto/image";
import { Item } from "../../dto/item";
import { AttributeSelectionViewModel } from "../../dto/viewmodel/attribute-selection-view-model";
import { ChannelViewModel } from "../../dto/viewmodel/channel-view-model";
import { ImageViewModel } from "../../dto/viewmodel/image-view-model";

import { ItemViewModel } from "../../dto/viewmodel/item-view-model";
import { AuthorService } from "../author-service";
import { ChannelService } from "../channel-service";
import { ImageService } from "../image-service";
import { ItemService } from "../item-service";
import { ChannelWebService } from "./channel-web-service";

@injectable()
class ItemWebService {

    constructor(
        private itemService: ItemService,
        private channelService: ChannelService,
        private authorService: AuthorService
    ) { }

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
            dateDisplay: moment(item.dateCreated).format("MMM Do YYYY"),
            channel: channel,
            author: author,
            authorDisplayName: this.authorService.getDisplayName(author),
            attributeSelections: attributeSelections,
        }

    }

    async list(skip: number): Promise<ItemViewModel[]> {

        let result: ItemViewModel[] = []

        //Get channel
        const channel = await this.channelService.get()

        let items: Item[] = await this.itemService.list(skip)

        for (let item of items) {
            result.push(await this.getViewModel(item, channel))
        }

        return result

    }

}

export {
    ItemWebService
}