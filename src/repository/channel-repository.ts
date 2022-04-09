import { injectable } from "inversify"
import { Channel } from "../dto/channel"

import { DatabaseService } from "../service/core/database-service"

import axios from 'axios'

@injectable()
class ChannelRepository {
    
    db: any

    constructor(
        private databaseService: DatabaseService
    ) {}

    async load(channelId:string, initial:Channel[]) {

        this.db = await this.databaseService.getDatabase({
            name: `${channelId}-channel`, 
            initialRecords: initial
        })

    }

    async get(_id:string): Promise<Channel> {        
        return Object.assign(new Channel(), await this.db.get(_id))
    }

}

export {
    ChannelRepository
}