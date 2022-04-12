import { injectable } from "inversify";
import { ModelView } from "../util/model-view";
import { routeMap } from "../util/route-map";
import { RouteTo } from '../service/core/routing-service';
import { ChannelWebService } from "../service/web/channel-web-service";

import IndexComponent from '../components/reader/index.f7.html'
import { ChannelViewModel } from "../dto/viewmodel/channel-view-model";

@injectable()
class ChannelController {

    constructor(
        private channelWebService:ChannelWebService
    ) {}

    @routeMap("/")
    async index() : Promise<ModelView> {

        return new ModelView(async (routeTo:RouteTo) => {

            let channelViewModel:ChannelViewModel = await this.channelWebService.get()

            return {
                channelViewModel: channelViewModel
            }

        }, IndexComponent)
    }

}

export {
    ChannelController
}