import axios from "axios"
import { inject, injectable } from "inversify"
import { NFTMetadata } from "../../dto/nft-metadata"
import { MetadataRepository } from "../metadata-repository"

@injectable()
class MetadataRepositoryImpl implements MetadataRepository {

    static CHUNK_SIZE = 10

    constructor(
        @inject('baseURI') private baseURI:string
    ) {}

    async get(tokenId: string): Promise<NFTMetadata> {
        const response = await axios.get(`${this.baseURI}backup/metadata/${tokenId}.json`)
        return Object.assign(new NFTMetadata(), response.data)
    }

}

export {
    MetadataRepositoryImpl
}


