import { Container } from "inversify";

import { AuthorRepository } from "./src/repository/author-repository";
import { AuthorRepositoryImpl } from "./src/repository/node/author-repository-impl";

import { ChannelRepository } from "./src/repository/channel-repository";
import { ChannelRepositoryImpl } from "./src/repository/node/channel-repository-impl";

import { ItemRepository } from "./src/repository/item-repository";
import { ItemRepositoryImpl } from "./src/repository/node/item-repository-impl";

import { AuthorService } from "./src/service/author-service";
import { ChannelService } from "./src/service/channel-service";
import { DatabaseService } from "./src/service/core/database-service";
import { PagingService } from "./src/service/core/paging-service";


import { ItemService } from "./src/service/item-service";
import { AuthorWebService } from "./src/service/web/author-web-service";
import { ChannelWebService } from "./src/service/web/channel-web-service";
import { ItemWebService } from "./src/service/web/item-web-service";
import TYPES from "./src/service/core/types";


let container:Container

function getMainContainer() {

  if (container) return container

  container = new Container()
  
  container.bind<ChannelRepository>("ChannelRepository").to(ChannelRepositoryImpl).inSingletonScope()
  container.bind<ItemRepository>("ItemRepository").to(ItemRepositoryImpl).inSingletonScope()
  container.bind<AuthorRepository>("AuthorRepository").to(AuthorRepositoryImpl).inSingletonScope()

  container.bind(ChannelWebService).toSelf().inSingletonScope()
  container.bind(ItemWebService).toSelf().inSingletonScope()
  container.bind(AuthorWebService).toSelf().inSingletonScope()

  container.bind(ChannelService).toSelf().inSingletonScope()
  container.bind(AuthorService).toSelf().inSingletonScope()
  container.bind(ItemService).toSelf().inSingletonScope()
  container.bind(PagingService).toSelf().inSingletonScope()


  return container
}



export {
  getMainContainer, container
}
