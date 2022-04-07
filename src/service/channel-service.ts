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
    private channelRepository:ChannelRepository,
    private itemService:ItemService
  ) { }

  async get(_id:string): Promise<Channel> {
    return this.channelRepository.get(_id)
  }

  async list(limit: number, skip:number): Promise<Channel[]> {
    return this.channelRepository.list(limit, skip)
  }

  async countItemsByChannel(channelId:string) : Promise<number> {
    return this.itemService.countByChannel(channelId)
  }


}


export {
  ChannelService
}
