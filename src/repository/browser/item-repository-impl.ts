import { inject, injectable } from "inversify"
import { Item } from "../../dto/item"
import { ItemRepository, CHUNK_SIZE } from "./../item-repository"
import { Changeset, DatabaseService } from "../../service/core/database-service"


@injectable()
class ItemRepositoryImpl implements ItemRepository {

    static CHUNK_SIZE = CHUNK_SIZE

    changesets:Changeset[] = [
        {
            id: '0',
            changeset: async (db) => {

                await db.createIndex({
                    index: {
                        fields: ['channelId']
                    }
                })
        
                await db.createIndex({
                    index: {
                        fields: ['tokenId']
                    }
                })
        
                await db.createIndex({
                    index: {
                        fields: ['dateCreated']
                    }
                })
        
                await db.search({
                    build: true,
                    fields: ['contentHTML', 'title', 'tokenId']
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
                    token_id: {
                        map: function (doc) { 
                            //@ts-ignore
                            emit(doc.channelId, doc.tokenId)
                        }.toString(),
                        reduce: '_count'
                    }
                    }
                })
                
            }
        },
        {
            id: '18',
            changeset: async (db) => {

                await db.createIndex({
                    index: {
                        fields: ['attributeSelections.traitType', 'attributeSelections.value']
                    }
                })


                // await db.put({
                //     _id: '_design/attribute_selection_index',
                //     views: {
                //         by_attribute_selection: {
                //             map: function (doc) { 

                //                 for (let attributeSelection of doc.attributeSelections) {
                //                     //@ts-ignore
                //                     emit([attributeSelection.id, attributeSelection.value], doc.tokenId);
                //                 }
            
                //             }.toString()
                //         }
                //     }
                // })

            }
        }
    ]

    db:any
    dbName:string = "items"
    
    @inject('DatabaseService')
    private databaseService: DatabaseService
    
    constructor() {}

    async load() {
        this.db = await this.databaseService.getDatabase({
            name: this.dbName,
            changesets: this.changesets
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

    async getByTokenId(tokenId:string) : Promise<Item> {

        let response = await this.db.find({
            selector: {
                tokenId: { $eq: tokenId },
                dateCreated: { $exists: true }
            },
            limit: 1
        })

        if (response.docs?.length > 0) {
            return response.docs[0]
        }

        
    }
    
    async listByTokenId(startTokenId:number, limit:number) : Promise<Item[]> {

        let response = await this.db.find({
            selector: {
                tokenId: { $lte: startTokenId },
                dateCreated: { $exists: true }
            },
            sort: [{ 'tokenId': 'desc' }],
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

    async query(query:string) : Promise<Item[]> {

        let response = await this.db.search({
            query: query,
            fields: ['contentHTML', 'title', 'tokenId'],
            include_docs: true,
            highlighting: true, 
            limit: CHUNK_SIZE
        })


        let rows = response.rows.map( row => {

            if (row.highlighting.contentHTML) {
                row.doc.contentHTML = row.highlighting.contentHTML
            } 

            //Remove image tags
            row.doc.contentHTML = row.doc.contentHTML.replace(/<img .*?>/g,""); 


            return row.doc
        })


        return rows

    }


    async exploreQuery(params:any)  : Promise<Item[]> {

        let results:number[] = []
        let response

        for (let key of Object.keys(params).sort()) {
            
            let selector = {

                "selector": {   
                    
                    "attributeSelections": {
                        "$elemMatch": {
                            "traitType": `${key}`,
                            "value": `${params[key]}`
                        }
                    },

                    "dateCreated": {
                      "$exists": true
                    }                   
                }
            }

            if (results?.length > 0) {
                selector.selector["tokenId"] = {
                    "$in": results
                }
            }

            response = await this.db.find(selector)
            results = response.docs?.map(d => d.tokenId).sort(function (a, b) {  return a - b;  })

        }

        return response?.docs ? response.docs : []

    }



    async all(): Promise<Item[]> {
        let response = await this.db.find({
            selector: {
                dateCreated: { $exists: true }
            },
            sort: [{ 'dateCreated': 'asc' }],
            limit: 100000,
            skip: 0
        })

        return response.docs
    }


}

export {
    ItemRepositoryImpl
}


