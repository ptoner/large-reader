import { Item } from "../dto/item"

let CHUNK_SIZE = 10

interface ItemRepository {
    get(_id:string): Promise<Item>
    list(skip:number): Promise<Item[]>
}

export {
    ItemRepository, CHUNK_SIZE
}
