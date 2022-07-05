import { injectable } from "inversify"
import fs from "fs"
import { ItemPage } from "../../dto/item-page"
import { ItemPageRepository } from "../item-page-repository"

@injectable()
class ItemPageRepositoryImpl implements ItemPageRepository {

    constructor() {}

    async get(pageNumber:number): Promise<ItemPage> {                
        return JSON.parse(fs.readFileSync(`public/itemPages/${pageNumber}.json`, 'utf8'))
    }

}

export {
    ItemPageRepositoryImpl
}


