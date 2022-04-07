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
    
    async countByChannel(channelId:string) : Promise<number> {
        return this.itemRepository.countByChannel(channelId)
    }

    async listByChannel(channelId: string, limit: number, skip: number): Promise<Item[]> {
        return this.itemRepository.listByChannel(channelId, limit, skip)
    }

    async mint(_id: string) {

    }

}

export {
    ItemService
}