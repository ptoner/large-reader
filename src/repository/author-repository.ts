import { Author } from "../dto/author"

interface AuthorRepository {
    get(_id:string): Promise<Author>
}

export {
    AuthorRepository
}
