import { Container } from "inversify";

import PouchDB from 'pouchdb-node';


import {
  AuthorRepositoryNodeImpl, 
  ChannelRepositoryNodeImpl,
  ItemRepositoryNodeImpl,
  ImageRepositoryNodeImpl,
  AnimationRepositoryNodeImpl,
  StaticPageRepositoryNodeImpl,
  ItemPageRepositoryNodeImpl,
  AttributeReportRepositoryNodeImpl,

  AuthorRepository, ChannelRepository, 
  ItemRepository, WalletService,WalletServiceImpl, AuthorService,
  ImageService, ChannelService, DatabaseService, PagingService, ItemService, AuthorWebService,
  ChannelWebService, ItemWebService, UiService, TokenService, ReaderSettingsService,
  MetadataRepository, MintWebService, SchemaService, 
  ImageRepository, SearchbarService, QuillService, AnimationService, 
  AnimationRepository, StaticPageService, StaticPageRepository, 
  StaticPage, ItemPageService, ItemPageRepository,  QueueService,
  AttributeReportRepository, ReaderSettingsRepository,
  TYPES
} from "large-reader-services/dist/node"

let container:Container

function getMainContainer(baseURI:string) {

  if (container) return container

  container = new Container()
  
  container.bind("framework7").toConstantValue({})
  container.bind("contracts").toConstantValue({})
  container.bind("provider").toConstantValue({})
  container.bind("baseURI").toConstantValue(baseURI)

  container.bind("PouchDB").toConstantValue(PouchDB)

  container.bind<WalletService>("WalletService").to(WalletServiceImpl).inSingletonScope()
  container.bind<ReaderSettingsService>("ReaderSettingsService").to(ReaderSettingsService).inSingletonScope()


  container.bind<ChannelRepository>("ChannelRepository").to(ChannelRepositoryNodeImpl).inSingletonScope()
  container.bind<ItemRepository>("ItemRepository").to(ItemRepositoryNodeImpl).inSingletonScope()
  container.bind<AuthorRepository>("AuthorRepository").to(AuthorRepositoryNodeImpl).inSingletonScope()
  container.bind<ImageRepository>("ImageRepository").to(ImageRepositoryNodeImpl).inSingletonScope()
  container.bind<AnimationRepository>("AnimationRepository").to(AnimationRepositoryNodeImpl).inSingletonScope()
  container.bind<StaticPageRepository>("StaticPageRepository").to(StaticPageRepositoryNodeImpl).inSingletonScope()
  container.bind<ItemPageRepository>("ItemPageRepository").to(ItemPageRepositoryNodeImpl).inSingletonScope()
  container.bind<AttributeReportRepository>("AttributeReportRepository").to(AttributeReportRepositoryNodeImpl).inSingletonScope()
  //@ts-ignore
  container.bind<ReaderSettingsRepository>("ReaderSettingsRepository").toConstantValue({})



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
  container.bind<QueueService>("QueueService").to(QueueService).inSingletonScope()
  container.bind<DatabaseService>("DatabaseService").to(DatabaseService).inSingletonScope()



  container.bind<QuillService>("QuillService").to(QuillService).inSingletonScope()


  return container
}



export {
  getMainContainer, container
}
