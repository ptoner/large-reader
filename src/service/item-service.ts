import { inject, injectable } from "inversify";
import { Item } from "../dto/item";
import { ItemRepository } from "../repository/item-repository";
import { SlideshowRepository } from "../repository/slideshow-repository";

@injectable()
class ItemService {

    @inject("ItemRepository")
    private itemRepository:ItemRepository
  
    @inject("SlideshowRepository")
    private slideshowRepository:SlideshowRepository

    constructor(
    ) { }

    async get(_id: string): Promise<Item> {
        return this.itemRepository.get(_id)
    }
    
    async list(skip: number, limit?:number): Promise<Item[]> {
        return this.itemRepository.list(skip, limit)
    }

    async query(query:string) {
        return this.itemRepository.query(query)
    }
    
    async all() {
        return this.itemRepository.all()
    }
    
    async getSlideshow() {
        return this.slideshowRepository.get()
    }


}

export {
    ItemService
}