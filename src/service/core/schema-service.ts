import { inject, injectable } from "inversify"
import { AnimationRepositoryImpl } from "../../repository/browser/animation-repository-impl"
import { AuthorRepositoryImpl } from "../../repository/browser/author-repository-impl"
import { ChannelRepositoryImpl } from "../../repository/browser/channel-repository-impl"
import { ImageRepositoryImpl } from "../../repository/browser/image-repository-impl"
import { ItemRepositoryImpl } from "../../repository/browser/item-repository-impl"
import { ChannelRepository } from "../../repository/channel-repository"
import { UiService } from "./ui-service"

@injectable()
class SchemaService {

    @inject("UiService")
    private uiService:UiService

    @inject("ItemRepository")
    private itemRepository:ItemRepositoryImpl //ugh

    @inject("ChannelRepository")
    private channelRepository:ChannelRepositoryImpl

    @inject("AuthorRepository")
    private authorRepository:AuthorRepositoryImpl

    @inject("ImageRepository")
    private imageRepository:ImageRepositoryImpl

    
    @inject("AnimationRepository")
    private animationRepository:AnimationRepositoryImpl

    @inject("framework7")
    private app:any

    constructor() {}

    async load() {

        if (!this.itemRepository.db) {
            await this.itemRepository.load()
        }

        if (!this.channelRepository.db) {
            await this.channelRepository.load()
        }

        if (!this.authorRepository.db) {
            await this.authorRepository.load()
        }

        if (!this.imageRepository.db) {
            await this.imageRepository.load()
        }

        // if (!this.animationRepository.db) {
        //     await this.animationRepository.load()
        // }

    }

}

export {
    SchemaService
}