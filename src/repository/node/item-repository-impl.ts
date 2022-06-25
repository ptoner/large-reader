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



    async list(skip:number): Promise<Item[]> {

        if (skip % ItemRepositoryImpl.CHUNK_SIZE != 0) {
            throw Error("Invalid skip value")
        }

        return this.items.slice(skip, skip + ItemRepositoryImpl.CHUNK_SIZE)

    }

    async listByTokenId(startTokenId:number, limit:number=CHUNK_SIZE) : Promise<Item[]> {
        return []
    }

    async query(query:string) : Promise<Item[]> {
        return []
    }


}

export {
    ItemRepositoryImpl
}


