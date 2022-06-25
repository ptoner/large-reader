import { BigNumber } from "ethers";
import { inject, injectable } from "inversify";
import { MetadataRepository } from "../repository/metadata-repository";
import { WalletService } from "./core/wallet-service";


@injectable()
class TokenService {

    @inject("MetadataRepository")
    private metadataRepository:MetadataRepository

    @inject("WalletService")
    private walletService:WalletService

    constructor(
    ) {}

    public get channelContract() : ChannelContract {
        return this.walletService.getContract("Channel")
    }

    async getBalance(address) : Promise<number> {
        if (!address) return 0
        return parseInt(await this.channelContract.balanceOf(address))
    }

    async getMetadata(tokenId) : Promise<any> {
        return this.metadataRepository.get(tokenId)      
    }

    async mint(quantity:number) {
        await this.channelContract.mint(quantity)
    }

    async mintFromStartOrFail(quantity:number, start:number) {
        await this.channelContract.mintFromStartOrFail(quantity, start)
    }

    async ownerOf(tokenId:number)  {
        return this.channelContract.ownerOf(tokenId)
    }

    async getTotalMinted() {
        return this.channelContract.totalMinted()
    }

    async getTotalSupply() {
        return this.channelContract.totalSupply()
    }

}

interface ChannelContract {
    mint(quantity:number)
    mintFromStartOrFail(quantity:number, start:number)
    ownerOf(tokenId:number) : string
    tokenURI(tokenId:number) : string
    balanceOf(address) : string
    totalMinted() : BigNumber
    totalSupply() : BigNumber
    address:string
}



export {
    TokenService
}