import "core-js/stable"
import "regenerator-runtime/runtime"
import "reflect-metadata"

import { getMainContainer } from "./inversify.config"


//Import CSS
import './html/css/framework7-bundle.css'
import './html/css/framework7-icons.css'

import './html/css/app.css'

import { RoutingService } from "./service/core/routing-service"


export default async () => {

    let container = getMainContainer()

    //Initialize routing
    let app: any = container.get("framework7")
    let routingService: RoutingService = container.get(RoutingService)

    app.routes.push(...routingService.buildRoutesForContainer(container))

}
