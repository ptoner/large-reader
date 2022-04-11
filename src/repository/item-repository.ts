import axios from "axios"
import { injectable } from "inversify"
import { Item } from "../dto/item"
import { DatabaseService } from "../service/core/database-service"


@injectable()
class ItemRepository {

    static CHUNK_SIZE = 20

    CREATE_INDEXES = async (db) => {

        await db.createIndex({
            index: {
                fields: ['channelId']
            }
        })

        await db.createIndex({
            index: {
                fields: ['dateCreated']
            }
        })

        await db.put({
            _id: '_design/item_index',
            views: {
              by_channel_id: {
                map: function (doc) { 
                    //@ts-ignore
                    emit(doc.channelId)
                }.toString(),
                reduce: '_count'
              }
            }
        })

    }

    db: any

    constructor(
        private databaseService: DatabaseService
    ) { }

    async load(channelId:string, initial:Item[]) {

        this.db = await this.databaseService.getDatabase({
            name: `${channelId}-item`, 
            initialRecords: initial,
            buildIndexes: this.CREATE_INDEXES
        })
        
    }

    async get(_id: string): Promise<Item> {

        let item:Item

        //Try to get it from db
        try {
            return this.db.get(_id)
        } catch(ex) {}

        //If we get here there was an exception above so fetch it
        const response = await axios.get(`/backup/items/${_id}.json`)

        console.log(response)

        return Object.assign(new Item(), response.data)
    }

    async listByChannel(channelId:string, skip: number): Promise<Item[]> {

        let items:Item[] = []

        if (skip % ItemRepository.CHUNK_SIZE != 0) {
            throw Error("Invalid skip value")
        }

        //If it's the initial page it'll be in the database so fetch it
        if (skip == 0) {

            let response = await this.db.find({
                selector: {
                    channelId: { $eq: channelId },
                    dateCreated: { $exists: true }
                },
                sort: [{ 'dateCreated': 'asc' }],
                limit: ItemRepository.CHUNK_SIZE,
                skip: skip
            })
    

            items.push(...response.docs.map( doc => Object.assign(new Item(), doc)))

        } else {

            //First chunk is at 0.json
            let chunkIndex = (skip / ItemRepository.CHUNK_SIZE) - 1

            const response = await axios.get(`/backup/itemChunks/${chunkIndex}`)

            console.log(response)

        }


        return items

    }

}

export {
    ItemRepository
}