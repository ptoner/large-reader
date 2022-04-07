import { injectable } from "inversify"
import { Channel } from "../dto/channel"
import { DatabaseService } from "../service/core/database-service"


@injectable()
class ChannelRepository {

    db: any

    constructor(
        private databaseService: DatabaseService
    ) { }


    async load(channelId:string) {
        this.db = await this.databaseService.getDatabase(`${channelId}-item`)
    }

    async get(_id: string): Promise<Channel> {
        return Object.assign(new Channel(), await this.db.get(_id))
    }

    async put(channel: Channel) {
        await this.db.put(channel)
    }

    async list(limit: number, skip: number): Promise<Channel[]> {

        let response = await this.db.find({
            selector: { "dateCreated": { $exists: true } },
            sort: [{ 'dateCreated': 'desc' }],
            limit: limit,
            skip: skip
        })

        return response.docs

    }




    async delete(channel: Channel): Promise<void> {
        await this.db.remove(channel)
    }

}

export {
    ChannelRepository
}