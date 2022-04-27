import { injectable } from "inversify";
import { ModelView } from "../util/model-view";
import { routeMap } from "../util/route-map";
import { RouteTo } from '../service/core/routing-service';
import { ChannelWebService } from "../service/web/channel-web-service";

import IndexComponent from '../components/reader/index.f7.html'
import { ChannelViewModel } from "../dto/viewmodel/channel-view-model";
import { ItemWebService } from "../service/web/item-web-service";
import { PagingService } from "../service/core/paging-service";
import { ItemRepository } from "../repository/item-repository";

@injectable()
class ChannelController {

    constructor(
        private channelWebService:ChannelWebService,
        private itemWebService:ItemWebService,
        private pagingService:PagingService
    ) {}

    @routeMap("/:offset?")
    async index() : Promise<ModelView> {

        return new ModelView(async (routeTo:RouteTo) => {

            const offset = routeTo.params.offset ? parseInt(routeTo.params.offset) : 0
            console.log(routeTo)
            console.log(offset)
            let channelViewModel:ChannelViewModel = await this.channelWebService.get()

            let pagingViewModel = this.pagingService.buildPagingViewModel(offset, ItemRepository.CHUNK_SIZE, channelViewModel.itemCount, 5)

            let items = await this.itemWebService.list(offset)

            return {
                channelViewModel: channelViewModel,
                pagingViewModel: pagingViewModel,
                items: items
            }

        }, IndexComponent)
    }

}

export {
    ChannelController
}