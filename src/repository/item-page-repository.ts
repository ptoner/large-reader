import { ItemPage } from "../dto/item-page"

interface ItemPageRepository {
    get(pageNumber:number): Promise<ItemPage>
}

export {
    ItemPageRepository
}
