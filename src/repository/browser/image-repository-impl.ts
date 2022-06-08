import {  inject, injectable } from "inversify"
import { Image } from "../../dto/image"
import { DatabaseService } from "../../service/core/database-service"
import { ImageRepository } from "../image-repository"

@injectable()
class ImageRepositoryImpl implements ImageRepository {

    db:any

    @inject('DatabaseService')
    private databaseService: DatabaseService

    async load() {
        this.db = await this.databaseService.getDatabase({
            name: "images"
        })
    }

    constructor(
    ) {}


    async get(_id:string): Promise<Image> {        
        return Object.assign(new Image(), await this.db.get(_id))
    }

}

export {
    ImageRepositoryImpl
}