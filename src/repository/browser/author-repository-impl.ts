import {  inject, injectable } from "inversify"
import { Author } from "../../dto/author"
import { DatabaseService } from "../../service/core/database-service"
import { AuthorRepository } from "../author-repository"

@injectable()
class AuthorRepositoryImpl implements AuthorRepository {

    db:any
    dbName:string = "authors"

    @inject('DatabaseService')
    private databaseService: DatabaseService

    async load() {
        this.db = await this.databaseService.getDatabase({
            name: this.dbName
        })
    }

    constructor(
    ) {}


    async get(_id:string): Promise<Author> {        
        return Object.assign(new Author(), await this.db.get(_id))
    }

}

export {
    AuthorRepositoryImpl
}