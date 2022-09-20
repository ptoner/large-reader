import { Container } from "inversify"

import { AuthorRepository } from "../src/repository/author-repository"
import { AuthorRepositoryImpl } from "../src/repository/browser/author-repository-impl"

import { ChannelRepository } from "../src/repository/channel-repository"
import { ChannelRepositoryImpl } from "../src/repository/browser/channel-repository-impl"

import { ItemRepository } from "../src/repository/item-repository"
import { ItemRepositoryImpl } from "../src/repository/browser/item-repository-impl"

import { WalletService } from "../src/service/core/wallet-service"
import { WalletServiceImpl } from "../src/service/core/wallet-service-impl"

import { AuthorService } from "../src/service/author-service"
import { ChannelService } from "../src/service/channel-service"
import { DatabaseService } from "../src/service/core/database-service"
import { PagingService } from "../src/service/core/paging-service"


import { ItemService } from "../src/service/item-service"
import { AuthorWebService } from "../src/service/web/author-web-service"
import { ChannelWebService } from "../src/service/web/channel-web-service"
import { ItemWebService } from "../src/service/web/item-web-service"

import { providers } from "ethers"



import { UiService } from "../src/service/core/ui-service"

import { TokenService } from "../src/service/token-service"
import { MetadataRepository } from "../src/repository/metadata-repository"
import { MetadataRepositoryImpl } from "../src/repository/browser/metadata-repository-impl"
import { HardhatWalletServiceImpl } from "./util/hardhat-wallet-service"




let container: Container

function getMainContainer() {

  if (container) return container

  container = new Container()

  function provider() {

    if (typeof window !== "undefined" && window['ethereum']) {

      //@ts-ignore
      window.web3Provider = window.ethereum

      //@ts-ignore
      return new providers.Web3Provider(window.ethereum)

    }
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
  container.bind("framework7").toConstantValue({})
  container.bind("baseURI").toConstantValue("")
  container.bind("version").toConstantValue("test")
  container.bind("provider").toConstantValue(provider())

  container.bind<WalletService>("WalletService").to(HardhatWalletServiceImpl).inSingletonScope();

  container.bind<ChannelRepository>("ChannelRepository").to(ChannelRepositoryImpl).inSingletonScope()
  container.bind<ItemRepository>("ItemRepository").to(ItemRepositoryImpl).inSingletonScope()
  container.bind<AuthorRepository>("AuthorRepository").to(AuthorRepositoryImpl).inSingletonScope()
  container.bind<MetadataRepository>("MetadataRepository").to(MetadataRepositoryImpl).inSingletonScope()

  container.bind(ChannelWebService).toSelf().inSingletonScope()
  container.bind(ItemWebService).toSelf().inSingletonScope()
  container.bind(AuthorWebService).toSelf().inSingletonScope()

  container.bind(DatabaseService).toSelf().inSingletonScope()
  container.bind(PagingService).toSelf().inSingletonScope()
  container.bind(TokenService).toSelf().inSingletonScope()


  container.bind<UiService>("UiService").to(UiService).inSingletonScope()
  container.bind<ItemService>("ItemService").to(ItemService).inSingletonScope()
  container.bind<ChannelService>("ChannelService").to(ChannelService).inSingletonScope()
  container.bind<AuthorService>("AuthorService").to(AuthorService).inSingletonScope()
  
  
  
  //Attach container to window so we can easily access it from the browser console
  globalThis.container = container


  return container
}



export {
  getMainContainer, container
}


