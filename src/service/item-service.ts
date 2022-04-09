import { injectable } from "inversify";
import { Item } from "../dto/item";
import { ItemRepository } from "../repository/item-repository";



@injectable()
class ItemService {

    constructor(
        private itemRepository: ItemRepository
    ) { }

    async get(_id: string): Promise<Item> {
        return this.itemRepository.get(_id)
    }
    
    async list(skip: number): Promise<Item[]> {
        return this.itemRepository.list(skip)
    }

    async mint(_id: string) {

    }

}

export {
    ItemService
}