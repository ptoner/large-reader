import axios from "axios"
import {  inject, injectable } from "inversify"
import { Channel } from "../../dto/channel"
import { Changeset, DatabaseService } from "../../service/core/database-service"
import { ChannelRepository } from "../channel-repository"

@injectable()
class ChannelRepositoryImpl implements ChannelRepository {
    
    changesets:Changeset[] = [{
        id: '0',
        changeset: async (db) => {
            //Create indexes
            await db.createIndex({ index: { fields: ['dateCreated'] } })
            await db.createIndex({ index: { fields: ['lastUpdated'] } })
            
        }
    }]


    db:any
    dbName:string = "channels"

    @inject('DatabaseService')
    private databaseService: DatabaseService

    constructor(
        @inject("baseURI") private baseURI
    ) {}

    async load() {
        this.db = await this.databaseService.getDatabase({
            name: this.dbName,
            changesets: this.changesets
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