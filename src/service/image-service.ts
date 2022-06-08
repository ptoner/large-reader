import { inject, injectable } from "inversify";
import { ImageRepository } from "../repository/image-repository";
import { Image } from "../dto/image";


@injectable()
class ImageService {

  @inject("ImageRepository")
  private imageRepository:ImageRepository

  constructor() { }

  async get(_id: string): Promise<Image> {
    return this.imageRepository.get(_id)
  }

}


export { ImageService }

