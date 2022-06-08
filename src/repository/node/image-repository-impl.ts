import {  injectable } from "inversify"
import fs from "fs"
import { ImageRepository } from "../image-repository"
import { Image } from "../../dto/image"

@injectable()
class ImageRepositoryImpl implements ImageRepository {
    
    constructor() {}

    images:Image[] = []

    async get(_id:string): Promise<Image> {        
        
        if(this.images?.length == 0) {
            this.images = JSON.parse(fs.readFileSync('backup/images.json', 'utf8'))
        }

        let matches = this.images.filter( image => image._id == _id)

        if (matches?.length > 0) {
            return matches[0]
        }

        return matches[0]
    }


}

export {
    ImageRepositoryImpl
}