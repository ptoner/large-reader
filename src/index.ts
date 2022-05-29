import "core-js/stable"
import "regenerator-runtime/runtime"
import "reflect-metadata"

import { getMainContainer } from "./inversify.config"

//Import CSS
import './html/css/framework7-bundle.css'
import './html/css/framework7-icons.css'

import './html/css/app.css'
import Framework7 from "framework7"

import {Workbox} from 'workbox-window'


let init = (baseURL:string, version:string) => {


    if ('serviceWorker' in navigator) {

        const wb = new Workbox(`./sw-${version}.js`, {
            scope: baseURL
        })

        if (navigator.serviceWorker.controller) {
            startApp(baseURL, version, window.location.pathname)
        } else {
            wb.addEventListener('controlling', e => {
                startApp(baseURL, version, window.location.pathname)
            })
        }

        wb.register()

    }


} 

let startApp = (baseURL:string, version:string, pathName:string) => {

    console.log(baseURL, version, pathName)

    let container = getMainContainer(baseURL, version)            
    let app:Framework7 = container.get("framework7")
    
    const url = `${baseURL}${pathName.split('/').pop()}`

    const mainView = app.views.create('.view-main', {
        url: url
    })


    mainView.on("init", (view) => {
        console.log(`Navigating to ${url}`)
        //When the view loads lets reload the initial page so that we fire the component logic. 
        view.router.navigate(url, { reloadCurrent: true })
    })
    
    app.init()
}


export { init }

