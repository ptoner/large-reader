import axios from "axios"
import { injectable } from "inversify"
import { Image } from "../dto/image"
import { DatabaseService } from "../service/core/database-service"



@injectable()
class ImageRepository {

    constructor(
    ) { }

    async get(_id: string): Promise<Image> {

        //If it's empty fetch it
        const response = await axios.get(`/backup/images/${_id}`)

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