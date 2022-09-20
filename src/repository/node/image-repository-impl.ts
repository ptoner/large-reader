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
            this.images = JSON.parse(fs.readFileSync('backup/export/backup/images.json', 'utf8'))
        }

        let matches = this.images.filter( image => image._id == _id)

        let image:Image

        if (matches?.length > 0) {
            image = matches[0]
        }

        if (image) {
            //Load content
            if (image.generated) {
                image.svg = fs.readFileSync(`backup/export/images/${image.cid}.svg`, 'utf8')
            } else {
                image.buffer = fs.readFileSync(`backup/export/images/${image.cid}.jpg`)
            }
        }


        return image
    }

    async list() : Promise<Image[]> {

        if(this.images?.length == 0) {
            this.images = JSON.parse(fs.readFileSync('backup/export/backup/images.json', 'utf8'))
        }

        return this.images
    }


}

export {
    ImageRepositoryImpl
}