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
    
    async listByChannel(channelId:string, skip: number): Promise<Item[]> {
        return this.itemRepository.listByChannel(channelId, skip)
    }

    async mint(_id: string) {

    }

}

export {
    ItemService
}