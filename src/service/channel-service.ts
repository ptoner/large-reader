import { inject, injectable } from "inversify"

import { Channel } from "../dto/channel"

import { ImageService } from "./image-service"
import { ItemService } from "./item-service"

import { ChannelRepository } from "../repository/channel-repository"
import { WalletService } from "./core/wallet-service"

import TYPES from "./core/types"


@injectable()
class ChannelService {

  constructor(
    private channelRepository:ChannelRepository
  ) { }

  async get(): Promise<Channel> {
    return this.channelRepository.get()
  }

}


export {
  ChannelService
}
