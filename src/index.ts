import "core-js/stable"
import "regenerator-runtime/runtime"
import "reflect-metadata"

// import { getMainContainer } from "./inversify.config"

if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      
      try {
        await navigator.serviceWorker.register('/sw.js')
        console.log('SW registered')
      } catch(ex) {
        console.log('SW registration failed: ', ex)
      }

    })
}

import Framework7, { Dom7 } from 'framework7';

// Import additional components
import Dialog from 'framework7/components/dialog';
import Toast from 'framework7/components/toast';
import Preloader from 'framework7/components/preloader';
import VirtualList from 'framework7/components/virtual-list'
import ListIndex from 'framework7/components/list-index'
import Card from 'framework7/components/card'
import Chip from 'framework7/components/chip'

import Form from 'framework7/components/form'
import Grid from 'framework7/components/grid'


// Install F7 Components using .use() method on Framework7 class:
Framework7.use([Dialog, Toast, Preloader, VirtualList, ListIndex, Card, Chip,  Form, Grid])


//Import CSS
import './html/css/framework7-bundle.css'
import './html/css/framework7-icons.css'

import './html/css/app.css'


let getApp = (init) => {

    const component = (props, { $, $f7, $f7ready, $h, $on }) => {
       
        //Load content from initial div on page
        let pageElement = document.getElementsByClassName('page')[0]

        //Get content
        let content = new XMLSerializer().serializeToString( pageElement )

        //Get script
        let script = document.getElementById('page-init-scripts')

        //Execute it. Will put init in globalThis.pageInit
        let f = new Function(script.textContent)
        f()
        
        init(props, {
            $: $, 
            $f7: $f7, 
            $on: $on
        })

        //Clean up
        delete globalThis.pageInit

        // $('#app').remove()
        
        return () => $h` 
            <div id="app">

                <!-- Status bar overlay for fullscreen mode-->
                <div class="statusbar"></div>

                <div class="view view-main view-init" 
                     data-browser-history="true" 
                     data-browser-history-separator=""    
                     data-browser-history-on-load="false"   
                     innerHTML="${content}"
                >
                
                </div>
            </div>
        `
    }

    let app = new Framework7({
        el: '#app', // App root element
        id: 'large-reader', // App bundle ID
        name: 'Large Reader', // App name
        theme: 'auto', // Automatic theme detection
        init: false,
        routes: [
            {
                path: '/index.html',
                componentUrl: 'index.html'
            },
            {
                path: '/list-:page.html',
                componentUrl: 'list-{{page}}.html'
            },
            {
                path: '(.*)',
                async async(ctx) {
                    console.log(`404 error: ${ctx.to.path}`)
                }
            }
        ],
        //@ts-ignore
        component:component
    })
    
    return app

} 

export { getApp }





    // app.views.create('.view-main', {
    //     url: window.location.pathname,
    //     browserHistory: true,
    //     // browserHistoryOnLoad: false,
    //     // browserHistoryInitialMatch: true,
    //     // browserHistoryRoot: window.location.pathname,
    //     browserHistorySeparator:"",
    //     loadInitialPage: false
    // })