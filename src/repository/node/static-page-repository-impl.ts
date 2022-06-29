import {  injectable } from "inversify"
import { Author } from "../../dto/author"
import fs from "fs"
import { StaticPageRepository } from "../static-page-repository"
import { StaticPage } from "../../dto/static-page"

@injectable()
class StaticPageRepositoryImpl implements StaticPageRepository {

    staticPages:StaticPage[] = []

    constructor() {}

    async load() {
        this.staticPages = JSON.parse(fs.readFileSync('backup/static-pages.json', 'utf8'))
    }


    async get(_id: string): Promise<StaticPage> {        
        
        let matches = this.staticPages.filter( staticPage => staticPage._id == _id)

        if (matches?.length > 0) {
            return matches[0]
        }

        return matches[0]

    }

    async listByLocation(location:string, skip:number): Promise<StaticPage[]> {
        return this.staticPages.filter( (s) => s.locations.includes(location) ).slice(skip, skip + 1000)
    }

}

export {
    StaticPageRepositoryImpl
}