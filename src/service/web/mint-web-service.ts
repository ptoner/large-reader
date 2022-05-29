import { BigNumber } from "ethers";
import { inject, injectable } from "inversify";
import { Channel } from "../../dto/channel";
import { MintingViewModel } from "../../dto/viewmodel/minting-view-model";
import { ChannelService } from "../channel-service";
import { SchemaService } from "../core/schema-service";
import { TokenService } from "../token-service";
import { ItemWebService } from "./item-web-service";

@injectable()
class MintWebService {

    @inject("TokenService")
    private tokenService:TokenService

    @inject("ChannelService")
    private channelService:ChannelService
    
    @inject("ItemWebService")
    private itemWebService:ItemWebService

    @inject("SchemaService")
    private schemaService:SchemaService

    constructor(
    ) {}

    async getMintingViewModel() : Promise<MintingViewModel> {

        await this.schemaService.load()

        let channel:Channel = await this.channelService.get()

        if (channel.contractAddress) {

            let totalMinted:BigNumber = await this.tokenService.getTotalMinted()

        
            let items = await this.itemWebService.list(totalMinted.toNumber(), 30)
    
            return {
                items: items,
                totalMinted: totalMinted.toNumber(),
                totalSupply: channel.itemCount,
                mintPrice: channel.mintPrice
            }
            
        }



    }


}

export {
    MintWebService
}