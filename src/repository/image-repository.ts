import axios from "axios"
import { inject, injectable } from "inversify"
import { Image } from "../dto/image"

@injectable()
class ImageRepository {

    constructor(
        @inject('baseURI') private baseURI:string
    ) {}

    async get(_id: string): Promise<Image> {

        //If it's empty fetch it
        const response = await axios.get(`${this.baseURI}backup/images/${_id}`)

        let image = new Image()

        image.cid = _id
        image._id = _id 
        image.data = response.data

        return image


    }
}

export {
    ImageRepository
}