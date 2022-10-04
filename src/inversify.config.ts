import { Container } from "inversify";
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
//@ts-ignore
import Panel from 'framework7/components/panel'
//@ts-ignore
import Popover from 'framework7/components/popover'


import Navbar from 'large-reader-services/src/components/reader/navbar.f7.html'
import TokenToolbar from 'large-reader-services/src/components/reader/token-toolbar.f7.html'

import NftInfo from 'large-reader-services/src/components/reader/item/nft-info.f7.html'
import MintList from 'large-reader-services/src/components/reader/item/mint-list.f7.html'
import AttributeFilter from 'large-reader-services/src/components/reader/channel/attribute-filter.f7.html'
import MintInfo from 'large-reader-services/src/components/reader/channel/mint-info.f7.html'

import SearchList from 'large-reader-services/src/components/reader/item/search-list.f7.html'
import InfiniteScrollContent from 'large-reader-services/src/components/reader/item/infinite-scroll-content.f7.html'

import he from 'he'
import PouchDB from 'pouchdb-browser';

import {
  AuthorRepositoryBrowserImpl, 
  ChannelRepositoryBrowserImpl,
  ItemRepositoryBrowserImpl,
  ImageRepositoryBrowserImpl,
  AnimationRepositoryBrowserImpl,
  StaticPageRepositoryBrowserImpl,
  ItemPageRepositoryBrowserImpl,
  AttributeReportRepositoryBrowserImpl,
  ReaderSettingsRepositoryBrowserImpl,

  AuthorRepository, ChannelRepository, 
  ItemRepository, WalletService,WalletServiceImpl, AuthorService,
  ImageService, ChannelService, DatabaseService, PagingService, ItemService, AuthorWebService,
  ChannelWebService, ItemWebService, UiService, TokenService, ReaderSettingsService,
  MetadataRepository, MetadataRepositoryBrowserImpl, MintWebService, SchemaService, 
  ImageRepository, SearchbarService, QuillService, AnimationService, 
  AnimationRepository, StaticPageService, StaticPageRepository, 
  StaticPage, ItemPageService, ItemPageRepository,  QueueService,
  AttributeReportRepository, ReaderSettingsRepository,
  TYPES
} from "large-reader-services/dist/browser"

// Install F7 Components using .use() method on Framework7 class:
Framework7.use([Dialog, Toast, Preloader, VirtualList, ListIndex, Card, Chip, Form, Grid, 
  Range, Accordion, Searchbar, Autocomplete, Popup, PhotoBrowser, Swiper, InfiniteScroll, Panel,Popover])




let container: Container

function getMainContainer(baseURI:string, version:string, routablePages:StaticPage[]) {

  if (container) return container

  container = new Container()

  function framework7() {

    Framework7.registerComponent("nav-bar", Navbar)
    Framework7.registerComponent("token-toolbar", TokenToolbar)

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

      toolbar: {
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

  container.bind("PouchDB").toConstantValue(PouchDB)


  container.bind("provider").toConstantValue(() => {

    if (typeof window !== "undefined" && window['ethereum']) {

      //@ts-ignore
      window.web3Provider = window.ethereum

      //@ts-ignore
      return new providers.Web3Provider(window.ethereum)

    }

  })

  container.bind<WalletService>("WalletService").to(WalletServiceImpl).inSingletonScope()

  container.bind<ChannelRepository>("ChannelRepository").to(ChannelRepositoryBrowserImpl).inSingletonScope()
  container.bind<ItemRepository>("ItemRepository").to(ItemRepositoryBrowserImpl).inSingletonScope()
  container.bind<AuthorRepository>("AuthorRepository").to(AuthorRepositoryBrowserImpl).inSingletonScope()
  container.bind<MetadataRepository>("MetadataRepository").to(MetadataRepositoryBrowserImpl).inSingletonScope()
  container.bind<ImageRepository>("ImageRepository").to(ImageRepositoryBrowserImpl).inSingletonScope()
  container.bind<AnimationRepository>("AnimationRepository").to(AnimationRepositoryBrowserImpl).inSingletonScope()
  container.bind<StaticPageRepository>("StaticPageRepository").to(StaticPageRepositoryBrowserImpl).inSingletonScope()
  container.bind<ItemPageRepository>("ItemPageRepository").to(ItemPageRepositoryBrowserImpl).inSingletonScope()
  container.bind<AttributeReportRepository>("AttributeReportRepository").to(AttributeReportRepositoryBrowserImpl).inSingletonScope()

  container.bind<ReaderSettingsRepository>("ReaderSettingsRepository").to(ReaderSettingsRepositoryBrowserImpl).inSingletonScope()


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

  container.bind<ReaderSettingsService>("ReaderSettingsService").to(ReaderSettingsService).inSingletonScope()



  //Attach container to window so we can easily access it from the browser console
  globalThis.container = container
  globalThis.ethers = ethers
  globalThis.he = he 

  return container
}



export {
  getMainContainer, container
}




