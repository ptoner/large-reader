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
import TYPES from "./service/core/types";


import { ItemService } from "./service/item-service";
import { AuthorWebService } from "./service/web/author-web-service";
import { ChannelWebService } from "./service/web/channel-web-service";
import { ItemWebService } from "./service/web/item-web-service";


let container:Container

function getMainContainer() {

  if (container) return container

  container = new Container()
  
  function baseURI() {
    return window.location.pathname
  }

  container.bind("baseURI").toConstantValue(baseURI())
  container.bind<WalletService>(TYPES.WalletService).to(WalletServiceImpl).inSingletonScope()

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



  


  return container
}



export {
  getMainContainer, container
}