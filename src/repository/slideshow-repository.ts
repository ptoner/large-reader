import { Slideshow } from "../dto/slideshow"

interface SlideshowRepository {
    get(): Promise<Slideshow>
}



export {
    SlideshowRepository
}
