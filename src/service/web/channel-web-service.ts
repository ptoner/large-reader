import { inject, injectable } from "inversify";
import { Author } from "../../dto/author";
import { Channel } from "../../dto/channel";

import { ChannelViewModel } from "../../dto/viewmodel/channel-view-model";
import { CHUNK_SIZE, ItemRepository } from "../../repository/item-repository";
import { AuthorService } from "../author-service";
import { ChannelService } from "../channel-service";
import { PagingService } from "../core/paging-service";
import { WalletService } from "../core/wallet-service";
import { StaticPageService } from "../static-page-service";
import { ItemWebService } from "./item-web-service";

@injectable()
class ChannelWebService {

    @inject("ChannelService")
    private channelService:ChannelService

    @inject("AuthorService")
    private authorService:AuthorService

    @inject("PagingService")
    private pagingService:PagingService

    @inject("ItemWebService")
    private itemWebService:ItemWebService

    @inject("WalletService")
    private walletService:WalletService

    @inject("StaticPageService")
    private staticPageService:StaticPageService

    constructor() {}

    async get(offset:number) : Promise<ChannelViewModel> {
        return this.getViewModel(await this.channelService.get(), offset)
    }

    async getViewModel(channel:Channel, offset:number) : Promise<ChannelViewModel> {
 
        let author:Author

        if (channel.authorId) {            
            author = await this.authorService.get(channel.authorId)
        }

        let itemCount = channel.itemCount

        let pagingViewModel = this.pagingService.buildPagingViewModel(offset, CHUNK_SIZE, itemCount, 5)

        let items = await this.itemWebService.list(offset)

        
        let locations = ["navbar", "links", "index"]

        let staticPagesViewModel = {}

        for (let location of locations) {
            staticPagesViewModel[location] = await this.staticPageService.listByLocation(location, 0)
        }

        return {
            channelContractAbbrev: channel.contractAddress ? this.walletService.truncateEthAddress(channel.contractAddress) : undefined,
            channel: channel,
            staticPagesViewModel: staticPagesViewModel,
            author: author,
            authorDisplayName: this.authorService.getDisplayName(author),
            itemCount: itemCount,
            pagingViewModel: pagingViewModel,
            items: items
        }

    }


}

export {
    ChannelWebService
}