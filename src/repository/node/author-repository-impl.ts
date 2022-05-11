import {  injectable } from "inversify"
import { Author } from "../../dto/author"
import fs from "fs"
import { AuthorRepository } from "../author-repository"

@injectable()
class AuthorRepositoryImpl implements AuthorRepository {

    constructor(
    ) {}

    async get(_id:string): Promise<Author> {        
        
        const authors = JSON.parse(fs.readFileSync('backup/authors.json', 'utf8'))
        
        let author:Author = authors.filter( author => author._id == _id)[0]

        return author
    }

}

export {
    AuthorRepositoryImpl
}