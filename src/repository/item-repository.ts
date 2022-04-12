import axios from "axios"
import { injectable } from "inversify"
import { Item } from "../dto/item"


@injectable()
class ItemRepository {

    static CHUNK_SIZE = 20

    constructor(
    ) { }

    async get(_id: string): Promise<Item> {
        const response = await axios.get(`/backup/items/${_id}.json`)
        return Object.assign(new Item(), response.data)
    }

    async list(skip: number): Promise<Item[]> {

        let items:Item[] = []

        if (skip % ItemRepository.CHUNK_SIZE != 0) {
            throw Error("Invalid skip value")
        }

        //First chunk is at 0.json
        let chunkIndex = skip / ItemRepository.CHUNK_SIZE

        const response = await axios.get(`/backup/itemChunks/${chunkIndex}.json`)

        items.push(...response.data.map( doc => Object.assign(new Item(), doc)))

        return items

    }

}

export {
    ItemRepository
}