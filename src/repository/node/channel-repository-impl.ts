import {  injectable } from "inversify"
import { Channel } from "../../dto/channel"
import fs from "fs"
import { ChannelRepository } from "./../channel-repository"
import { AttributeReport, AttributeTotal } from "../../dto/viewmodel/attribute-report"
import { Item } from "../../dto/item"

@injectable()
class ChannelRepositoryImpl implements ChannelRepository {
    
    constructor() {}

    async get(): Promise<Channel> {        
        
        const channels = JSON.parse(fs.readFileSync('backup/channels.json', 'utf8'))
        let channel:Channel = channels[0]


        try {
            const contract = JSON.parse(fs.readFileSync('backup/contract.json', 'utf8'))

            if (contract?.contractAddress) {
                channel.contractAddress = contract.contractAddress
            }
    
        } catch(ex) {}

        return channel
    }



}

export {
    ChannelRepositoryImpl
}