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

    try {

        //Load initial bundle
        const response = await axios.get(`/backup/initial.json`)

        let initial = response.data

        if (!initial.channels) throw new Error("Could not load!")

        //Load all the repositories
        let authorRepository: AuthorRepository = container.get(AuthorRepository)
        let channelRepository: ChannelRepository = container.get(ChannelRepository)
        let itemRepository: ItemRepository = container.get(ItemRepository)

        let channel: Channel = initial.channels[0]

        //Set a global variable for this. Not great. Only read this in a Controller for now. 
        globalThis.channelId = channel._id

        authorRepository.load(channel._id, initial.authors)
        channelRepository.load(channel._id, initial.channels)
        itemRepository.load(channel._id, initial.items)


        //Initialize routing
        let app: any = container.get("framework7")
        let routingService: RoutingService = container.get(RoutingService)

        app.routes.push(...routingService.buildRoutesForContainer(container))


    } catch (ex) {
        console.log(ex)
    }



}
