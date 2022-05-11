import { Channel } from "../dto/channel"

interface ChannelRepository {
    get(): Promise<Channel>
}

export {
    ChannelRepository
}
