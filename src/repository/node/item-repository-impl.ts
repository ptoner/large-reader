import { injectable } from "inversify"
import { Item } from "../../dto/item"
import fs from "fs"
import { ItemRepository, CHUNK_SIZE } from "../item-repository"

@injectable()
class ItemRepositoryImpl implements ItemRepository {

    static CHUNK_SIZE = CHUNK_SIZE

    items:Item[] = []

    constructor() {}

    async load() {
        this.items = JSON.parse(fs.readFileSync('backup/items.json', 'utf8'))
    }

    async get(_id: string): Promise<Item> {        
        
        let matches = this.items.filter( item => item._id == _id)

        if (matches?.length > 0) {
            return matches[0]
        }

        return matches[0]

    }



    async list(skip:number, limit?:number): Promise<Item[]> {
        return this.items.slice(skip, limit)
    }

    async getByTokenId(tokenId:string) : Promise<Item> {
        return new Item()
    }

    async listByTokenId(startTokenId:number, limit:number) : Promise<Item[]> {
        return []
    }

    async query(query:string) : Promise<Item[]> {
        return []
    }

    async all(): Promise<Item[]> {
        return this.items
    }

    async exploreQuery(params:any) : Promise<Item[]> {
        return  
    }

}

export {
    ItemRepositoryImpl
}


