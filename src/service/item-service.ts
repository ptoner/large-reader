import { inject, injectable } from "inversify";
import { Item } from "../dto/item";
import { ItemRepository } from "../repository/item-repository";
import { SlideshowRepository } from "../repository/slideshow-repository";
import { AttributeReportRepository } from "../repository/attribute-report-repository";
import { AttributeReport } from "../dto/viewmodel/attribute-report";
import { Channel } from "../dto/channel";

@injectable()
class ItemService {

    @inject("ItemRepository")
    private itemRepository:ItemRepository
  
    @inject("SlideshowRepository")
    private slideshowRepository:SlideshowRepository

      
    @inject("AttributeReportRepository")
    private attributeReportRepository:AttributeReportRepository

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
    
    async getByTokenId(tokenId:string) : Promise<Item> {
        return this.itemRepository.getByTokenId(tokenId)
    }

    async listByTokenId(startTokenId:number, limit:number=10) {
        return this.itemRepository.listByTokenId(startTokenId, limit)
    }


    async getSlideshow() {
        return this.slideshowRepository.get()
    }
    
    async getAttributeReport() {
        return this.attributeReportRepository.get()
    }

    async buildAttributeReport(channel:Channel, items:Item[]) : Promise<AttributeReport> {
        return this.attributeReportRepository.buildAttributeReport(channel, items)
    }

    async exploreQuery(params:any) : Promise<Item[]> {
        return this.itemRepository.exploreQuery(params)
    }



}

export {
    ItemService
}