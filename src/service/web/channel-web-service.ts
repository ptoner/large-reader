import { injectable } from "inversify";
import { Author } from "../../dto/author";
import { Channel } from "../../dto/channel";

import { ChannelViewModel } from "../../dto/viewmodel/channel-view-model";
import { ImageViewModel } from "../../dto/viewmodel/image-view-model";
import { AuthorService } from "../author-service";
import { ChannelService } from "../channel-service";

@injectable()
class ChannelWebService {

    constructor(
        private channelService:ChannelService,
        private authorService:AuthorService
    ) {}

    async get() : Promise<ChannelViewModel> {
        return this.getViewModel(await this.channelService.get())
    }

    async getViewModel(channel:Channel) : Promise<ChannelViewModel> {
 
        let author:Author

        if (channel.authorId) {            
            author = await this.authorService.get(channel.authorId)
        }

        let itemCount = 0

        return {
            channel: channel,
            author: author,
            authorDisplayName: this.authorService.getDisplayName(author),
            itemCount: itemCount
        }

    }


}

export {
    ChannelWebService
}