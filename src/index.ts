import "core-js/stable"
import "regenerator-runtime/runtime"
import "reflect-metadata"

import { getMainContainer } from "./inversify.config"

//Import CSS
import './html/css/framework7-bundle.css'
import './html/css/framework7-icons.css'
import 'material-icons/iconfont/material-icons.css'

import './html/css/app.css'
import Framework7 from "framework7"

import {Workbox} from 'workbox-window'
import { StaticPage } from "./dto/static-page"


let init = (baseURL:string, hostname:string, version:string, routablePages:StaticPage[]) => {


    if ('serviceWorker' in navigator) {

        const wb = new Workbox(`${hostname}${baseURL}sw-${version}.js`, {
            scope: `${hostname}${baseURL}`
        })

        if (navigator.serviceWorker.controller) {
            startApp(baseURL, version, hostname, routablePages)
        } else {
            wb.addEventListener('controlling', e => {
                startApp(baseURL, version, hostname, routablePages)
            })
        }

        wb.register()

    }


} 

let startApp = async (baseURI:string, version:string, hostname:string, routablePages:StaticPage[]) => {

    let container = getMainContainer(baseURI, version, routablePages)            
    let app:Framework7 = container.get("framework7")
    
    //Create the main view

    //Get URL
    let internalUrl = window.location.toString().replace(`${hostname}`, '')

    const mainView = app.views.create('.view-main', {
        url: internalUrl
    })


    mainView.on("init", (view) => {
        console.log(`Navigating to ${internalUrl}`)
        //When the view loads lets reload the initial page so that we fire the component logic. 
        view.router.navigate(internalUrl, { reloadCurrent: true })
    })
    
    app.init()
}


export { init }

