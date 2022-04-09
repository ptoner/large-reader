import axios from "axios";
import { inject, injectable } from "inversify";
import { Channel } from "../../dto/channel";
import { AuthorRepository } from "../../repository/author-repository";
import { ChannelRepository } from "../../repository/channel-repository";
import { ItemRepository } from "../../repository/item-repository";

@injectable()
class SchemaService {

    constructor(
        private authorRepository:AuthorRepository,
        private channelRepository:ChannelRepository,
        private itemRepository:ItemRepository
    ) {}

    async load() {

        //Load initial bundle
        const response = await axios.get(`../backup/initial.json`)

        let initial = response.data

        if (!initial.channels) throw new Error("Could not load!")

        let channel: Channel = initial.channels[0]

        //Set a global variable for this. Not great. Only read this in a Controller for now. 
        globalThis.channelId = channel._id

        await this.authorRepository.load(channel._id, initial.authors)
        await this.channelRepository.load(channel._id, initial.channels)
        await this.itemRepository.load(channel._id, initial.items)


    }

}

export {
    SchemaService
}