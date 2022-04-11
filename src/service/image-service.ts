import { injectable } from "inversify"
import { Image } from "../dto/image"
import { ImageRepository } from "../repository/image-repository"
import { Blob } from 'blob-polyfill'

@injectable()
class ImageService {

  constructor(
    private imageRepository: ImageRepository
  ) { }

  async get(_id: string): Promise<Image> {
    return this.imageRepository.get(_id)
  }

  async getUrl(image: Image) {

    if (!image.data) return ""

    return 'data:image/png;base64,' + btoa(Buffer.from(image.data).toString('base64'));
  }

  public bufferToBlob(buffer: Uint8Array): Promise<Blob> {

    if (Blob != undefined) {
      return new Blob([buffer], { type: "image/jpg" })
    }

  }


  public blobToDataURL(blob) : Promise<string> {
    
    let dataUrl

    return new Promise((resolve, reject) => {

      const fr = new FileReader()

      fr.onload = async function () {
        dataUrl = fr.result
        resolve(dataUrl)
      }

      fr.readAsDataURL(blob)
    })


  }

}

export {
  ImageService
}