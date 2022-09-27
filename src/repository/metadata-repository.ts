import { NFTMetadata } from "../dto/nft-metadata"


interface MetadataRepository {
    get(tokenId:string): Promise<NFTMetadata>
}

export {
    MetadataRepository
}
