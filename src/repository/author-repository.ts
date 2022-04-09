import { injectable } from "inversify"
import { Author } from "../dto/author"
import { DatabaseService } from "../service/core/database-service"


@injectable()
class AuthorRepository {

    db

    constructor(
        private databaseService: DatabaseService
    ) { }

    async load(channelId:string) {
        this.db = await this.databaseService.getDatabase(`${channelId}-author`)
    }

    async get(_id: string): Promise<Author> {
        return Object.assign(new Author(), await this.db.get(_id))
    }

}

export {
    AuthorRepository
}