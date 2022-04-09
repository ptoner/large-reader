import "core-js/stable"
import "regenerator-runtime/runtime"
import "reflect-metadata"

import axios from "axios"

import { getMainContainer } from "./inversify.config"


//Import CSS
import './html/css/app.css'
import './html/css/framework7-bundle.css'
import './html/css/framework7-icons.css'

import 'material-icons/iconfont/material-icons.css';
import { AuthorRepository } from "./repository/author-repository"
import { ChannelRepository } from "./repository/channel-repository"
import { ImageRepository } from "./repository/image-repository"
import { ItemRepository } from "./repository/item-repository"
import { Channel } from "./dto/channel"
import { RoutingService } from "./service/core/routing-service"


export default async () => {

    let container = getMainContainer()

    //Initialize routing
    let app: any = container.get("framework7")
    let routingService: RoutingService = container.get(RoutingService)

    app.routes.push(...routingService.buildRoutesForContainer(container))



}
