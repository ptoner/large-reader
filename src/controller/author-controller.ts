import { injectable } from "inversify";
import { ModelView } from "../util/model-view";
import { routeMap } from "../util/route-map";
import { RouteTo } from '../service/core/routing-service';

import AuthorShowComponent from '../components/reader/author/show.f7.html'

import { AuthorWebService } from "../service/web/author-web-service";
import { AuthorViewModel } from "../dto/viewmodel/author-view-model";
import { ChannelWebService } from "../service/web/channel-web-service";
import { ChannelViewModel } from "../dto/viewmodel/channel-view-model";
import { Channel } from "../dto/channel";
import { ChannelService } from "../service/channel-service";

@injectable()
class AuthorController {

    constructor(
        private authorWebService:AuthorWebService,
        private channelService:ChannelService

    ) {}

    @routeMap("/author/show/:id")
    async index() : Promise<ModelView> {

        return new ModelView(async (routeTo:RouteTo) => {

            let channel:Channel = await this.channelService.get()

            let authorViewModel:AuthorViewModel = await this.authorWebService.get(routeTo.params.id)

            return {
                authorViewModel: authorViewModel,
                channel: channel
            }

        }, AuthorShowComponent)
    }

}

export {
    AuthorController
}