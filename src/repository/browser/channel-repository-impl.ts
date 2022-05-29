import axios from "axios"
import {  inject, injectable } from "inversify"
import { Channel } from "../../dto/channel"
import { DatabaseService } from "../../service/core/database-service"
import { ChannelRepository } from "../channel-repository"

@injectable()
class ChannelRepositoryImpl implements ChannelRepository {
    

    CREATE_INDEXES = async (db) => {

        //Create indexes
        await db.createIndex({ index: { fields: ['dateCreated'] } })
        await db.createIndex({ index: { fields: ['lastUpdated'] } })
        
    }

    db:any

    @inject('DatabaseService')
    private databaseService: DatabaseService

    constructor(
        @inject("baseURI") private baseURI
    ) {}

    async load() {
        this.db = await this.databaseService.getDatabase({
            name: "channels"
        })
    }


    async get(): Promise<Channel> {        
        
        let channels = await this.db.allDocs({
            include_docs: true
        })

        let channel:Channel = channels.rows[0].doc

        const contractResponse = await axios.get(`${this.baseURI}backup/contract.json`)

        if (contractResponse?.data) {
            channel.contractAddress = contractResponse.data.contractAddress
        }

        return channel
    }


}

export {
    ChannelRepositoryImpl
}