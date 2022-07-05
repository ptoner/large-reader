import axios from "axios"
import { inject, injectable } from "inversify"
import { ItemPage } from "../../dto/item-page"
import { ItemPageRepository } from "../item-page-repository"

@injectable()
class ItemPageRepositoryImpl implements ItemPageRepository {

    constructor(
        @inject("baseURI") private baseURI
    ) {}

    async get(pageNumber: number): Promise<ItemPage> {   

        const response = await axios.get(`${this.baseURI}itemPages/${pageNumber}.json`)
            
        return response.data
    }

}

export {
    ItemPageRepositoryImpl
}


