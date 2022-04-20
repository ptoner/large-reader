import { inject, injectable } from "inversify"
import axios from "axios"

import { Channel } from "../dto/channel"

@injectable()
class ChannelRepository {
    
    constructor(
        @inject('baseURI') private baseURI:string
    ) {}

    async get(): Promise<Channel> {        
        
        const response = await axios.get(`${this.baseURI}backup/channels.json`)
        
        let channel:Channel = response.data[0]

        const contractResponse = await axios.get(`${this.baseURI}backup/contract.json`)

        if (contractResponse?.data) {
            channel.contractAddress = contractResponse.data.contractAddress
        }

        return channel
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