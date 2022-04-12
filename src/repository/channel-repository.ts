import { injectable } from "inversify"
import axios from "axios"

import { Channel } from "../dto/channel"

@injectable()
class ChannelRepository {
    
    constructor(
    ) {}


    async get(): Promise<Channel> {        
        
        const response = await axios.get(`/backup/channels.json`)
        
        return response.data[0]
    }

    // async get(_id:string): Promise<Channel> {        
        
    //     const response = await axios.get(`/backup/channels.json`)
        
    //     let channel:Channel = response.data.filter( channel => channel._id == _id)[0]

    //     return channel
    // }

}

export {
    ChannelRepository
}