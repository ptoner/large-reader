import { inject, injectable } from "inversify"
import { AuthorRepositoryImpl } from "../../repository/browser/author-repository-impl"
import { ChannelRepositoryImpl } from "../../repository/browser/channel-repository-impl"
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

    @inject("framework7")
    private app:any

    constructor() {}

    async load() {

        if (!this.itemRepository.db) {
            this.app.preloader.show()
            await this.itemRepository.load()
        }

        if (!this.channelRepository.db) {
            this.app.preloader.show()
            await this.channelRepository.load()
        }

        if (!this.authorRepository.db) {
            this.app.preloader.show()
            await this.authorRepository.load()
        }


        this.app.preloader.hide()
    }

}

export {
    SchemaService
}