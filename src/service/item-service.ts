import { inject, injectable } from "inversify";
import { Item } from "../dto/item";
import { ItemRepository } from "../repository/item-repository";

@injectable()
class ItemService {

    @inject("ItemRepository")
    private itemRepository:ItemRepository
  
    constructor(
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