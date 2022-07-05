import { Container } from "inversify";

import { AuthorRepository } from "./src/repository/author-repository";
import { AuthorRepositoryImpl } from "./src/repository/node/author-repository-impl";

import { ChannelRepository } from "./src/repository/channel-repository";
import { ChannelRepositoryImpl } from "./src/repository/node/channel-repository-impl";

import { ItemRepository } from "./src/repository/item-repository";
import {  ItemRepositoryImpl } from "./src/repository/node/item-repository-impl";
import {  AnimationRepositoryImpl } from "./src/repository/node/animation-repository-impl";

import { ImageRepository } from "./src/repository/image-repository";
import { ImageRepositoryImpl } from "./src/repository/node/image-repository-impl";

import { StaticPageService } from "./src/service/static-page-service";

import { StaticPageRepository } from "./src/repository/static-page-repository";
import { StaticPageRepositoryImpl } from "./src/repository/node/static-page-repository-impl";

import { ItemPageRepository } from "./src/repository/item-page-repository";
import { ItemPageRepositoryImpl } from "./src/repository/node/item-page-repository-impl";


import { SlideshowRepository } from "./src/repository/slideshow-repository";
import { SlideshowRepositoryImpl } from "./src/repository/node/slideshow-repository-impl";

import { AuthorService } from "./src/service/author-service";
import { ChannelService } from "./src/service/channel-service";
import { SearchbarService } from "./src/service/web/searchbar-service";
import { ItemPageService } from "./src/service/item-page-service";

import { DatabaseService } from "./src/service/core/database-service";
import { PagingService } from "./src/service/core/paging-service";
import { WalletService } from "./src/service/core/wallet-service";
import { WalletServiceImpl } from "./src/service/core/wallet-service-impl";
import { QuillService } from "./src/service/core/quill-service";


import { ItemService } from "./src/service/item-service";
import { AuthorWebService } from "./src/service/web/author-web-service";
import { ChannelWebService } from "./src/service/web/channel-web-service";
import { ItemWebService } from "./src/service/web/item-web-service";
import TYPES from "./src/service/core/types";

import { ImageService } from "./src/service/image-service";
import { SchemaService } from "./src/service/core/schema-service";
import { UiService } from "./src/service/core/ui-service";
import { AnimationService } from "./src/service/animation-service";
import { AnimationRepository } from "./src/repository/animation-repository";




let container:Container

function getMainContainer() {

  if (container) return container

  container = new Container()
  
  container.bind("framework7").toConstantValue({})
  container.bind("contracts").toConstantValue({})
  container.bind("provider").toConstantValue({})
  container.bind("baseURI").toConstantValue("")

  container.bind<WalletService>("WalletService").to(WalletServiceImpl).inSingletonScope()

  container.bind<ChannelRepository>("ChannelRepository").to(ChannelRepositoryImpl).inSingletonScope()
  container.bind<ItemRepository>("ItemRepository").to(ItemRepositoryImpl).inSingletonScope()
  container.bind<AuthorRepository>("AuthorRepository").to(AuthorRepositoryImpl).inSingletonScope()
  container.bind<ImageRepository>("ImageRepository").to(ImageRepositoryImpl).inSingletonScope()
  container.bind<AnimationRepository>("AnimationRepository").to(AnimationRepositoryImpl).inSingletonScope()
  container.bind<StaticPageRepository>("StaticPageRepository").to(StaticPageRepositoryImpl).inSingletonScope()
  container.bind<ItemPageRepository>("ItemPageRepository").to(ItemPageRepositoryImpl).inSingletonScope()
  container.bind<SlideshowRepository>("SlideshowRepository").to(SlideshowRepositoryImpl).inSingletonScope()



  container.bind<ChannelWebService>("ChannelWebService").to(ChannelWebService).inSingletonScope()
  container.bind<ItemWebService>("ItemWebService").to(ItemWebService).inSingletonScope()
  container.bind<AuthorWebService>("AuthorWebService").to(AuthorWebService).inSingletonScope()
  container.bind<SearchbarService>("SearchbarService").to(SearchbarService).inSingletonScope()
  container.bind<StaticPageService>("StaticPageService").to(StaticPageService).inSingletonScope()
  container.bind<ItemPageService>("ItemPageService").to(ItemPageService).inSingletonScope()

  container.bind<PagingService>("PagingService").to(PagingService).inSingletonScope()
  container.bind<AnimationService>("AnimationService").to(AnimationService).inSingletonScope()

  container.bind<ImageService>("ImageService").to(ImageService).inSingletonScope()
  container.bind<ItemService>("ItemService").to(ItemService).inSingletonScope()
  container.bind<ChannelService>("ChannelService").to(ChannelService).inSingletonScope()
  container.bind<AuthorService>("AuthorService").to(AuthorService).inSingletonScope()
  container.bind<SchemaService>("SchemaService").to(SchemaService).inSingletonScope()
  container.bind<UiService>("UiService").to(UiService).inSingletonScope()

  container.bind<QuillService>("QuillService").to(QuillService).inSingletonScope()


  return container
}



export {
  getMainContainer, container
}
