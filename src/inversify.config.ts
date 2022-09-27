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
import { ImageService } from "./service/image-service";

import { ChannelService } from "./service/channel-service";
import { DatabaseService } from "./service/core/database-service";
import { PagingService } from "./service/core/paging-service";


import { ItemService } from "./service/item-service";
import { AuthorWebService } from "./service/web/author-web-service";
import { ChannelWebService } from "./service/web/channel-web-service";
import { ItemWebService } from "./service/web/item-web-service";

import { ethers, providers } from "ethers"


import Framework7, { Dom7 } from 'framework7';

// Import additional components
//@ts-ignore
import Dialog from 'framework7/components/dialog';
//@ts-ignore
import Toast from 'framework7/components/toast';
//@ts-ignore
import Preloader from 'framework7/components/preloader';
//@ts-ignore
import VirtualList from 'framework7/components/virtual-list'
//@ts-ignore
import ListIndex from 'framework7/components/list-index'
//@ts-ignore
import Range from 'framework7/components/range'
//@ts-ignore
import Accordion from 'framework7/components/accordion'
//@ts-ignore
import Autocomplete from 'framework7/components/autocomplete'
//@ts-ignore
import PhotoBrowser from 'framework7/components/photo-browser'
//@ts-ignore
import Swiper from 'framework7/components/swiper'
//@ts-ignore
import InfiniteScroll from 'framework7/components/infinite-scroll'
//@ts-ignore
import Card from 'framework7/components/card'
//@ts-ignore
import Chip from 'framework7/components/chip'
//@ts-ignore
import Form from 'framework7/components/form'
//@ts-ignore
import Grid from 'framework7/components/grid'
//@ts-ignore
import Searchbar from 'framework7/components/searchbar'
//@ts-ignore
import Popup from 'framework7/components/popup'


import { UiService } from "./service/core/ui-service";

import Navbar from './components/reader/navbar.f7.html'
import NftInfo from './components/reader/item/nft-info.f7.html'
import MintList from './components/reader/item/mint-list.f7.html'
import AttributeFilter from './components/reader/channel/attribute-filter.f7.html'
import MintInfo from './components/reader/channel/mint-info.f7.html'

import SearchList from './components/reader/item/search-list.f7.html'
import InfiniteScrollContent from './components/reader/item/infinite-scroll-content.f7.html'


import { TokenService } from "./service/token-service";
import { MetadataRepository } from "./repository/metadata-repository";
import { MetadataRepositoryImpl } from "./repository/browser/metadata-repository-impl";
import { MintWebService } from "./service/web/mint-web-service";
import { SchemaService } from "./service/core/schema-service";
import { ImageRepositoryImpl } from "./repository/browser/image-repository-impl";
import { ImageRepository } from "./repository/image-repository";
import { SearchbarService } from "./service/web/searchbar-service";
import { QuillService } from "./service/core/quill-service";
import { AnimationService } from "./service/animation-service";
import { AnimationRepositoryImpl } from "./repository/browser/animation-repository-impl";
import { AnimationRepository } from "./repository/animation-repository";
import { StaticPageService } from "./service/static-page-service";
import { StaticPageRepository } from "./repository/static-page-repository";
import { StaticPageRepositoryImpl } from "./repository/browser/static-page-repository-impl";
import { StaticPage } from "./dto/static-page";
import he from 'he'
import { ItemPageService } from "./service/item-page-service";
import { ItemPageRepository } from "./repository/item-page-repository";
import { ItemPageRepositoryImpl } from "./repository/browser/item-page-repository-impl";
import { SlideshowRepository } from "./repository/slideshow-repository";
import { SlideshowRepositoryImpl } from "./repository/browser/slideshow-repository-impl";
import { QueueService } from "./service/core/queue-service";
import { AttributeReportRepositoryImpl } from "./repository/browser/attribute-report-repository-impl";
import { AttributeReportRepository } from "./repository/attribute-report-repository";

// Install F7 Components using .use() method on Framework7 class:
Framework7.use([Dialog, Toast, Preloader, VirtualList, ListIndex, Card, Chip, Form, Grid, 
  Range, Accordion, Searchbar, Autocomplete, Popup, PhotoBrowser, Swiper, InfiniteScroll])




let container: Container

function getMainContainer(baseURI:string, version:string, routablePages:StaticPage[]) {

  if (container) return container

  container = new Container()

  function framework7() {

    Framework7.registerComponent("nav-bar", Navbar)
    Framework7.registerComponent("nft-info", NftInfo)
    Framework7.registerComponent("mint-list", MintList)
    Framework7.registerComponent("attribute-filter", AttributeFilter)

    Framework7.registerComponent("mint-info", MintInfo)
    Framework7.registerComponent("search-list", SearchList)
    Framework7.registerComponent("infinite-scroll-content", InfiniteScrollContent)

    const resolveWithSpinner = (resolve, url) => {
      
      // let currentUrl = window.location.pathname.split('/').pop()

      //Navigating to same page freezes it. So don't.
      // if (url != currentUrl)  {
      //   app.preloader.show()
      // } 

      // console.log(url)

      resolve({ componentUrl: `${baseURI}${url}` })

    }

    const routes = [
      {
        path: `${baseURI}`,
        async async({ resolve, reject }) {
          await resolveWithSpinner(resolve, 'index.html')
        }
      },
      {
        path: `${baseURI}index.html`,
        async async({ resolve, reject }) {
          await resolveWithSpinner(resolve, 'index.html')
        }
      },


      {
        path: `${baseURI}mint.html`,
        async async({ resolve, reject }) {
          await resolveWithSpinner(resolve, 'mint.html')
        }
      },

      {
        path: `${baseURI}search.html`,
        async async({ resolve, reject }) {
          await resolveWithSpinner(resolve, 'search.html')
        }
      },

      {
        path: `${baseURI}attributes.html`,
        async async({ resolve, reject }) {
          await resolveWithSpinner(resolve, 'attributes.html')
        }
      },

      {
        path: `${baseURI}explore.html`,
        async async({ resolve, reject }) {
          await resolveWithSpinner(resolve, 'explore.html')
        }
      },


      {
        path: `${baseURI}list-:page.html`,
        async async({ resolve, reject }) {
          await resolveWithSpinner(resolve, 'list-{{page}}.html')
        }
      },
      {
        path: `${baseURI}t/:tokenId`,
        async async({ resolve, reject }) {
          await resolveWithSpinner(resolve, `t/{{tokenId}}`)
        }
      }
    ]


    if (routablePages?.length > 0) {

      for (let routablePage of routablePages) {
        
        routes.push({
          path: `${baseURI}${routablePage.slug}.html`,
          async async({ resolve, reject }) {
            await resolveWithSpinner(resolve, `${routablePage.slug}.html`)
          }
        })

      }

    }

    routes.push({
      path: '(.*)',
      //@ts-ignore
      async async({ resolve, reject, to }) {
        console.log(`404 error: ${to.path}`)
        await resolveWithSpinner(resolve, '404.html')
      }
    })


    let app = new Framework7({
      el: '#app', // App root element
      id: 'large-reader', // App bundle ID
      name: 'Large Reader', // App name
      theme: 'auto', // Automatic theme detection
      init: false,
      
      view: {
        browserHistory: true,
        browserHistorySeparator: "",
        browserHistoryOnLoad: false,
        browserHistoryInitialMatch: false
      },
      
      navbar: {
        hideOnPageScroll: true
      },

      routes: routes
    })

    return app
  }


  function contracts() {
        
    const contract = require('../backup/contract/contract.json')

    if (!contract.contractAddress) return []

    const c = require('../backup/contract/contract-abi.json')

    //Override address
    c['Channel'].address = contract.contractAddress

    return c
  }

  container.bind("contracts").toConstantValue(contracts())
  container.bind("framework7").toConstantValue(framework7())
  container.bind("baseURI").toConstantValue(baseURI)
  container.bind("version").toConstantValue(version)
  container.bind("provider").toConstantValue(() => {

    if (typeof window !== "undefined" && window['ethereum']) {

      //@ts-ignore
      window.web3Provider = window.ethereum

      //@ts-ignore
      return new providers.Web3Provider(window.ethereum)

    }

  })

  container.bind<WalletService>("WalletService").to(WalletServiceImpl).inSingletonScope()

  container.bind<ChannelRepository>("ChannelRepository").to(ChannelRepositoryImpl).inSingletonScope()
  container.bind<ItemRepository>("ItemRepository").to(ItemRepositoryImpl).inSingletonScope()
  container.bind<AuthorRepository>("AuthorRepository").to(AuthorRepositoryImpl).inSingletonScope()
  container.bind<MetadataRepository>("MetadataRepository").to(MetadataRepositoryImpl).inSingletonScope()
  container.bind<ImageRepository>("ImageRepository").to(ImageRepositoryImpl).inSingletonScope()
  container.bind<AnimationRepository>("AnimationRepository").to(AnimationRepositoryImpl).inSingletonScope()
  container.bind<StaticPageRepository>("StaticPageRepository").to(StaticPageRepositoryImpl).inSingletonScope()
  container.bind<ItemPageRepository>("ItemPageRepository").to(ItemPageRepositoryImpl).inSingletonScope()
  container.bind<SlideshowRepository>("SlideshowRepository").to(SlideshowRepositoryImpl).inSingletonScope()
  container.bind<AttributeReportRepository>("AttributeReportRepository").to(AttributeReportRepositoryImpl).inSingletonScope()



  container.bind<ChannelWebService>("ChannelWebService").to(ChannelWebService).inSingletonScope()
  container.bind<ItemWebService>("ItemWebService").to(ItemWebService).inSingletonScope()
  container.bind<AuthorWebService>("AuthorWebService").to(AuthorWebService).inSingletonScope()
  container.bind<MintWebService>("MintWebService").to(MintWebService).inSingletonScope()
  container.bind<SearchbarService>("SearchbarService").to(SearchbarService).inSingletonScope()
  container.bind<StaticPageService>("StaticPageService").to(StaticPageService).inSingletonScope()
  container.bind<ItemPageService>("ItemPageService").to(ItemPageService).inSingletonScope()
  container.bind<QueueService>("QueueService").to(QueueService).inSingletonScope()


  container.bind<PagingService>("PagingService").to(PagingService).inSingletonScope()
  container.bind<DatabaseService>("DatabaseService").to(DatabaseService).inSingletonScope()
  container.bind<AnimationService>("AnimationService").to(AnimationService).inSingletonScope()

  container.bind<UiService>("UiService").to(UiService).inSingletonScope()
  container.bind<ItemService>("ItemService").to(ItemService).inSingletonScope()
  container.bind<ImageService>("ImageService").to(ImageService).inSingletonScope()
  container.bind<ChannelService>("ChannelService").to(ChannelService).inSingletonScope()
  container.bind<AuthorService>("AuthorService").to(AuthorService).inSingletonScope()
  container.bind<TokenService>("TokenService").to(TokenService).inSingletonScope()
  container.bind<SchemaService>("SchemaService").to(SchemaService).inSingletonScope()
  container.bind<QuillService>("QuillService").to(QuillService).inSingletonScope()

  //Attach container to window so we can easily access it from the browser console
  globalThis.container = container
  globalThis.ethers = ethers
  globalThis.he = he 

  return container
}



export {
  getMainContainer, container
}




