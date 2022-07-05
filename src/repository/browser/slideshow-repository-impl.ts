import axios from "axios"
import { inject, injectable } from "inversify"
import { Slideshow } from "../../dto/slideshow"
import { SlideshowRepository } from "../slideshow-repository"

@injectable()
class SlideshowRepositoryImpl implements SlideshowRepository {

    constructor(
        @inject("baseURI") private baseURI
    ) {}

    async get(): Promise<Slideshow> {   

        const response = await axios.get(`${this.baseURI}slideshow.json`)
            
        return response.data
    }

}

export {
    SlideshowRepositoryImpl
}


