import { injectable } from "inversify"
import { Item } from "../../dto/item"
import fs from "fs"
import { ItemRepository, CHUNK_SIZE } from "./../item-repository"

@injectable()
class ItemRepositoryImpl implements ItemRepository {

    static CHUNK_SIZE = CHUNK_SIZE

    constructor() {}

    async get(_id: string): Promise<Item> {
        const fileContents = JSON.parse(fs.readFileSync(`backup/items/${_id}.json`, 'utf8'))
        return Object.assign(new Item(), fileContents)
    }

    async list(skip:number): Promise<Item[]> {

        let items:Item[] = []

        if (skip % ItemRepositoryImpl.CHUNK_SIZE != 0) {
            throw Error("Invalid skip value")
        }

        //First chunk is at 0.json
        let chunkIndex = skip / ItemRepositoryImpl.CHUNK_SIZE

        const fileContents = JSON.parse(fs.readFileSync(`backup/itemChunks/${chunkIndex}.json`, 'utf8'))

        items.push(...fileContents.map( doc => Object.assign(new Item(), doc)))

        return items

    }

}

export {
    ItemRepositoryImpl
}


