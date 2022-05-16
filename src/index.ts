import "core-js/stable"
import "regenerator-runtime/runtime"
import "reflect-metadata"

import { getMainContainer } from "./inversify.config"

//Import CSS
import './html/css/framework7-bundle.css'
import './html/css/framework7-icons.css'

import './html/css/app.css'
import Framework7 from "framework7"


let init = (init, baseURL:string, version:string) => {

    console.log(baseURL, version)

    let container = getMainContainer(init, baseURL, version)

    let app:Framework7 = container.get("framework7")
    
    app.init()

    return app

} 




export { init }

