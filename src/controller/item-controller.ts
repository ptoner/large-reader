import { injectable } from "inversify";
import { ModelView } from "../util/model-view";
import { routeMap } from "../util/route-map";
import { RouteTo } from '../service/core/routing-service';

import ItemShowComponent from '../components/reader/item/show.f7.html'
import { ItemWebService } from "../service/web/item-web-service";
import { ItemViewModel } from "../dto/viewmodel/item-view-model";

@injectable()
class ItemController {

    constructor(
        private itemWebService:ItemWebService
    ) {}

    @routeMap("/item/show/:id")
    async index() : Promise<ModelView> {

        return new ModelView(async (routeTo:RouteTo) => {

            let itemViewModel:ItemViewModel = await this.itemWebService.get(routeTo.params.id)

            return {
                itemViewModel: itemViewModel
            }

        }, ItemShowComponent)
    }

}

export {
    ItemController
}