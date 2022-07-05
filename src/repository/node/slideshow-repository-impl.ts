import { injectable } from "inversify"
import fs from "fs"
import { SlideshowRepository } from "../slideshow-repository"
import { Slideshow } from "../../dto/slideshow"

@injectable()
class SlideshowRepositoryImpl implements SlideshowRepository {

    constructor() {}

    async get(): Promise<Slideshow> {                
        return JSON.parse(fs.readFileSync(`public/slideshow.json`, 'utf8'))
    }

}

export {
    SlideshowRepositoryImpl
}


