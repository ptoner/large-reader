import { inject, injectable } from "inversify"
import { AnimationRepositoryImpl } from "../../repository/browser/animation-repository-impl"
import { AuthorRepositoryImpl } from "../../repository/browser/author-repository-impl"
import { ChannelRepositoryImpl } from "../../repository/browser/channel-repository-impl"
import { ImageRepositoryImpl } from "../../repository/browser/image-repository-impl"
import { ItemRepositoryImpl } from "../../repository/browser/item-repository-impl"


@injectable()
class SchemaService {

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



    constructor() {

    }

    async load(dbs:string[]) {

        const repositories = []

        repositories.push(this.itemRepository)
        repositories.push(this.channelRepository)
        repositories.push(this.authorRepository)
        repositories.push(this.imageRepository)
        repositories.push(this.animationRepository)


        for (let db of dbs) {

            let repo = repositories.filter( r => r.dbName == db)[0]

            if (!repo) continue

            if (!repo.db) {
                await repo.load()
            }
            
        }

    }

}

export {
    SchemaService
}