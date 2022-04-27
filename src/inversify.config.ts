import { providers } from "ethers"
import { Container } from "inversify";

import AppComponent from './components/reader/app.f7.html'

import { AuthorController } from "./controller/author-controller";
import { ChannelController } from "./controller/channel-controller";
import { ItemController } from "./controller/item-controller";

import { AuthorRepository } from "./repository/author-repository";
import { ChannelRepository } from "./repository/channel-repository";
import { ImageRepository } from "./repository/image-repository";
import { ItemRepository } from "./repository/item-repository";
import { AuthorService } from "./service/author-service";
import { ChannelService } from "./service/channel-service";
import { DatabaseService } from "./service/core/database-service";
import { PagingService } from "./service/core/paging-service";
import { RoutingService } from "./service/core/routing-service";

import TYPES from "./service/core/types";
import { UiService } from "./service/core/ui-service";
import { WalletService } from "./service/core/wallet-service";
import { WalletServiceImpl } from "./service/core/wallet-service-impl";
import { ImageService } from "./service/image-service";
import { ItemService } from "./service/item-service";
import { AuthorWebService } from "./service/web/author-web-service";
import { ChannelWebService } from "./service/web/channel-web-service";
import { ItemWebService } from "./service/web/item-web-service";

import Framework7 from 'framework7';


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


let container:Container

function getMainContainer() {

  if (container) return container

  container = new Container()

  function framework7() {

    let app = new Framework7({
      el: '#app', // App root element
      id: 'large-reader', // App bundle ID
      name: 'Large Reader', // App name
      theme: 'auto', // Automatic theme detection
      //@ts-ignore
      component: AppComponent
    })

    return app

  }

  function contracts() {
    const c = require('../contracts.json')
    return c
  }

  function provider() {

    if (typeof window !== "undefined" && window['ethereum']) {
      
      //@ts-ignore
      window.web3Provider = window.ethereum

      //@ts-ignore
      return new providers.Web3Provider(window.ethereum)


    }
  }

  function baseURI() {
    let base = window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1)
    return  base
  }


  // container.bind('sketch').toConstantValue(sketch())
  container.bind("contracts").toConstantValue(contracts())
  container.bind("provider").toConstantValue(provider())
  container.bind("name").toConstantValue("Large")
  container.bind("framework7").toConstantValue(framework7())
  container.bind("baseURI").toConstantValue(baseURI())

  container.bind(ChannelController).toSelf().inSingletonScope()
  container.bind(ItemController).toSelf().inSingletonScope()
  container.bind(AuthorController).toSelf().inSingletonScope()


  container.bind(UiService).toSelf().inSingletonScope()
  
  container.bind(ChannelWebService).toSelf().inSingletonScope()
  container.bind(ItemWebService).toSelf().inSingletonScope()
  container.bind(AuthorWebService).toSelf().inSingletonScope()

  container.bind<WalletService>(TYPES.WalletService).to(WalletServiceImpl).inSingletonScope()

  container.bind(ChannelService).toSelf().inSingletonScope()
  container.bind(AuthorService).toSelf().inSingletonScope()
  container.bind(ImageService).toSelf().inSingletonScope()
  container.bind(ItemService).toSelf().inSingletonScope()
  container.bind(DatabaseService).toSelf().inSingletonScope()
  container.bind(RoutingService).toSelf().inSingletonScope()
  container.bind(PagingService).toSelf().inSingletonScope()

  container.bind(ChannelRepository).toSelf().inSingletonScope()
  container.bind(ItemRepository).toSelf().inSingletonScope()
  container.bind(ImageRepository).toSelf().inSingletonScope()
  container.bind(AuthorRepository).toSelf().inSingletonScope()

  return container
}



export {
  getMainContainer, container
}