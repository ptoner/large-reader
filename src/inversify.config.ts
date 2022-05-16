import { Container } from "inversify";

import { AuthorRepository } from "./repository/author-repository";
import { AuthorRepositoryImpl } from "./repository/browser/author-repository-impl";

import { ChannelRepository } from "./repository/channel-repository";
import { ChannelRepositoryImpl } from "./repository/browser/channel-repository-impl";

import { ItemRepository } from "./repository/item-repository";
import { ItemRepositoryImpl } from "./repository/browser/item-repository-impl";

import { WalletService } from "./service/core/wallet-service";
import { WalletServiceImpl } from "./service/core/wallet-service-impl";

import { AuthorService } from "./service/author-service";
import { ChannelService } from "./service/channel-service";
import { DatabaseService } from "./service/core/database-service";
import { PagingService } from "./service/core/paging-service";


import { ItemService } from "./service/item-service";
import { AuthorWebService } from "./service/web/author-web-service";
import { ChannelWebService } from "./service/web/channel-web-service";
import { ItemWebService } from "./service/web/item-web-service";

import { providers } from "ethers"


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
import { UiService } from "./service/core/ui-service";

import Navbar from './components/reader/navbar.f7.html'


// Install F7 Components using .use() method on Framework7 class:
Framework7.use([Dialog, Toast, Preloader, VirtualList, ListIndex, Card, Chip, Form, Grid])




let container: Container

function getMainContainer(init:Function, baseURI:string, version:string) {

  if (container) return container

  container = new Container()

  function framework7() {

    Framework7.registerComponent('main-navbar', Navbar)

    const component = (props, { $, $f7, $h, $on, $update, $f7ready }) => {

      //Load content from initial div on page
      let pageElement = document.getElementsByClassName('page')[0]

      //Get a copy of page attributes

      //Get content
      let content = new XMLSerializer().serializeToString(pageElement)

      //Get script
      let script = document.getElementById('page-init-scripts')

      //Execute it. Will put init in globalThis.pageInit
      let f = new Function(script.textContent)
      f()

      init(props, {
        $: $,
        $f7: $f7,
        $on: $on,
        $update: $update
      })

      //Clean up
      delete globalThis.pageInit

      return () => $h` 
         
          <div id="app">
          
              <div class="view view-main view-init" 
                   data-browser-history="true" 
                   data-browser-history-separator=""    
                   data-browser-history-on-load="false" 
                   data-browser-history-initial-match="true"
                   
              >
                <${Navbar} />

                <div innerHTML="${content}"></div>
              
              </div>
          </div>
      `
    }

    const resolveWithSpinner = (resolve, url) => {

      let currentUrl = window.location.pathname.split('/').pop()

      //Navigating to same page freezes it. So don't.
      if (url === currentUrl) return 

      app.preloader.show()
      
      resolve({ componentUrl: url })

    }

    let app = new Framework7({
      el: '#app', // App root element
      id: 'large-reader', // App bundle ID
      name: 'Large Reader', // App name
      theme: 'auto', // Automatic theme detection
      init: false,
      routes: [
        {
          path: `${baseURI}index.html`,
          async async({ resolve, reject }) {
            await resolveWithSpinner(resolve, 'index.html')
          }
        },
        {
          path: `${baseURI}list-:page.html`,
          async async({ resolve, reject }) {
            await resolveWithSpinner(resolve, 'list-{{page}}.html')
          }
        },
        {
          path: `${baseURI}item-show-:id.html`,
          async async({ resolve, reject }) {
            await resolveWithSpinner(resolve, 'item-show-{{id}}.html')
          }

        },
        {
          path: '(.*)',
          async async(ctx) {
            console.log(`404 error: ${ctx.to.path}`, ctx)
          }
        }
      ],
      //@ts-ignore
      component: component,

      serviceWorker: {
        path: `./sw-${version}.js`,
        scope: baseURI,
      }
    })

    return app
  }

  function provider() {

    if (typeof window !== "undefined" && window['ethereum']) {

      //@ts-ignore
      window.web3Provider = window.ethereum

      //@ts-ignore
      return new providers.Web3Provider(window.ethereum)

    }
  }


  container.bind("framework7").toConstantValue(framework7())
  container.bind("baseURI").toConstantValue(baseURI)
  container.bind("version").toConstantValue(version)
  container.bind("provider").toConstantValue(provider())

  container.bind<WalletService>("WalletService").to(WalletServiceImpl).inSingletonScope()

  container.bind<ChannelRepository>("ChannelRepository").to(ChannelRepositoryImpl).inSingletonScope()
  container.bind<ItemRepository>("ItemRepository").to(ItemRepositoryImpl).inSingletonScope()
  container.bind<AuthorRepository>("AuthorRepository").to(AuthorRepositoryImpl).inSingletonScope()

  container.bind(ChannelWebService).toSelf().inSingletonScope()
  container.bind(ItemWebService).toSelf().inSingletonScope()
  container.bind(AuthorWebService).toSelf().inSingletonScope()

  container.bind(ChannelService).toSelf().inSingletonScope()
  container.bind(AuthorService).toSelf().inSingletonScope()
  container.bind(ItemService).toSelf().inSingletonScope()
  container.bind(DatabaseService).toSelf().inSingletonScope()
  container.bind(PagingService).toSelf().inSingletonScope()


  container.bind<UiService>("UiService").to(UiService).inSingletonScope()

  
  
  
  //Attach container to window so we can easily access it from the browser console
  globalThis.container = container


  return container
}



export {
  getMainContainer, container
}









//serializeToString escapes the tags f7 needs to initalize the components. So were going to swap 
//back the original text in after serializing
// for (let i=0; i < f7Components.length; i++) {

//   let escaped = f7Components[i].innerHTML.trim()
//   //@ts-ignore
//   let original = f7Components[i].innerText.trim()

//   content = content.replace(escaped, original)

// }


// console.log(content)