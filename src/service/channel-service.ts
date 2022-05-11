import { inject, injectable } from "inversify"

import { Channel } from "../dto/channel"
import { ChannelRepository } from "../repository/channel-repository"

@injectable()
class ChannelService {

  @inject("ChannelRepository")
  private channelRepository:ChannelRepository

  constructor() { }

  async get(): Promise<Channel> {
    return this.channelRepository.get()
  }

}


export {
  ChannelService
}
