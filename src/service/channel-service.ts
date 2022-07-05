import { inject, injectable } from "inversify"

import { Channel } from "../dto/channel"
import { Item } from "../dto/item"
import { AttributeReport } from "../dto/viewmodel/attribute-report"
import { ChannelRepository } from "../repository/channel-repository"

@injectable()
class ChannelService {

  @inject("ChannelRepository")
  private channelRepository:ChannelRepository

  constructor() { }

  async get(): Promise<Channel> {
    return this.channelRepository.get()
  }

  async getAttributeReport(items:Item[]) : Promise<AttributeReport> {
    return this.channelRepository.getAttributeReport(items)
  }

}


export {
  ChannelService
}
