import axios from "axios"
import {  inject, injectable } from "inversify"
import { Channel } from "../../dto/channel"
import { ChannelRepository } from "../channel-repository"

@injectable()
class ChannelRepositoryImpl implements ChannelRepository {
    
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


}

export {
    ChannelRepositoryImpl
}