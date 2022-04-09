import axios from "axios"
import { injectable } from "inversify"
import { Image } from "../dto/image"
import { DatabaseService } from "../service/core/database-service"



@injectable()
class ImageRepository {

    db: any

    constructor(
        private databaseService: DatabaseService
    ) { }

    async load(channelId:string) {
        this.db = await this.databaseService.getDatabase(`${channelId}-image`)
    }

    async get(_id: string): Promise<Image> {

        let image:Image

        //Try to get it from db
        try {
            return this.db.get(_id)
        } catch(ex) {}

        //If it's empty fetch it
        const response = await axios.get(`/backup/images/${_id}.json`)

        console.log(response)

        return Object.assign(new Image(), response.data)


    }
}

export {
    ImageRepository
}