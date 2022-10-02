import { inject, injectable } from "inversify"
import { AnimationRepositoryImpl } from "../../repository/browser/animation-repository-impl"
import { AuthorRepositoryImpl } from "../../repository/browser/author-repository-impl"
import { ChannelRepositoryImpl } from "../../repository/browser/channel-repository-impl"
import { ImageRepositoryImpl } from "../../repository/browser/image-repository-impl"
import { ItemRepositoryImpl } from "../../repository/browser/item-repository-impl"
import { ReaderSettingsRepositoryImpl } from "../../repository/browser/reader-settings-repository-impl"
import { StaticPageRepositoryImpl } from "../../repository/browser/static-page-repository-impl"


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

    @inject("StaticPageRepository")
    private staticPageRepository:StaticPageRepositoryImpl

    @inject("ReaderSettingsRepository")
    private readerSettingsRepository:ReaderSettingsRepositoryImpl


    constructor() {

    }

    async load(dbs:string[]) {

        const repositories = []

        repositories.push(this.itemRepository)
        repositories.push(this.channelRepository)
        repositories.push(this.authorRepository)
        repositories.push(this.imageRepository)
        repositories.push(this.animationRepository)
        repositories.push(this.staticPageRepository)
        repositories.push(this.readerSettingsRepository)


        for (let db of dbs) {

            let repo = repositories.filter( r => r.dbName == db)[0]

            if (!repo) continue

            if (!repo.db) {
                await repo.load()
            }
            
        }

    }

    async loadWallet(walletAddress:string) {

        console.log(`Loading wallet: ${walletAddress}`)

        //Open and cache databases
        // await this.authorRepository.load(walletAddress)
        // await this.channelRepository.load(walletAddress)
        // await this.imageRepository.load(walletAddress)
        // await this.itemRepository.load(walletAddress)
        // await this.pinningApiRepository.load(walletAddress)
        // await this.gitlabRepository.load(walletAddress)
        // await this.animationRepository.load(walletAddress)
        // await this.themeRepository.load(walletAddress)
        // await this.staticPageRepository.load(walletAddress)
        // await this.ipfsHostRepository.load(walletAddress)

    }



}

export {
    SchemaService
}