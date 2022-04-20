import axios from "axios"
import { inject, injectable } from "inversify"
import { Author } from "../dto/author"

@injectable()
class AuthorRepository {

    constructor(
        @inject('baseURI') private baseURI:string
    ) {}

    async get(_id:string): Promise<Author> {        
        
        const response = await axios.get(`${this.baseURI}backup/authors.json`)
        
        let author:Author = response.data.filter( author => author._id == _id)[0]

        return author
    }

}

export {
    AuthorRepository
}