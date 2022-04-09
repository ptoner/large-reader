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
        const response = await axios.get(`/backup/images/${_id}.json`)

        let image = Object.assign(new Image(), response.data)

        console.log(image)

        return image


    }
}

export {
    ImageRepository
}