import { Channel } from "../dto/channel"
import { Item } from "../dto/item"
import { AttributeReport } from "../dto/viewmodel/attribute-report"

interface ChannelRepository {
    get(): Promise<Channel>
}

export {
    ChannelRepository
}
