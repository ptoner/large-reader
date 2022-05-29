import { inject, injectable } from "inversify"
import { Item } from "../../dto/item"
import { ItemRepository, CHUNK_SIZE } from "./../item-repository"
import { DatabaseService } from "../../service/core/database-service"

@injectable()
class ItemRepositoryImpl implements ItemRepository {

    static CHUNK_SIZE = CHUNK_SIZE

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

        await db.put({
            _id: '_design/item_token_id',
            views: {
              token_id_stats: {
                map: function (doc) { 
                    //@ts-ignore
                    emit(doc.channelId, doc.tokenId)
                }.toString(),
                reduce: '_count'
              }
            }
        })



    }

    db:any
    
    @inject('DatabaseService')
    private databaseService: DatabaseService
    
    constructor() {}

    async load() {
        this.db = await this.databaseService.getDatabase({
            name: "items",
            buildIndexes: this.CREATE_INDEXES
        })
    }


    async get(_id: string): Promise<Item> {
        return Object.assign(new Item(), await this.db.get(_id))
    }

    async put(item: Item) {
        await this.db.put(item)
    }

    async list(skip: number, limit:number=CHUNK_SIZE): Promise<Item[]> {

        let response = await this.db.find({
            selector: {
                dateCreated: { $exists: true }
            },
            sort: [{ 'dateCreated': 'asc' }],
            limit: limit,
            skip: skip
        })

        return response.docs

    }

    async listByTokenId(startTokenId:number, limit:number=CHUNK_SIZE) : Promise<Item[]> {
        let response = await this.db.find({
            selector: {
                tokenId: { $gt: startTokenId },
                dateCreated: { $exists: true }
            },
            sort: [{ 'tokenId': 'asc' }],
            limit: limit
        })

        return response.docs
    }
    
    async getNext(item:Item) : Promise<Item> {

        let response = await this.db.find({
            selector: {
                dateCreated: { $gt: item.dateCreated }
            },
            sort: [{ 'dateCreated': 'asc' }],
            limit: 1,
            skip: 0
        })

        if (response.docs?.length > 0) {
            return Object.assign(new Item(), response.docs[0])
        }
    }

    async getPrevious(item:Item) : Promise<Item> {

        let response = await this.db.find({
            selector: {
                dateCreated: { $lt: item.dateCreated }
            },
            sort: [{ 'dateCreated': 'desc' }],
            limit: 1,
            skip: 0
        })

        if (response.docs?.length > 0) {
            return Object.assign(new Item(), response.docs[0])
        }
    }

}

export {
    ItemRepositoryImpl
}


