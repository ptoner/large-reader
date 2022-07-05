import {  inject, injectable } from "inversify"
import { Animation } from "../../dto/animation"
import { DatabaseService } from "../../service/core/database-service"
import { AnimationRepository } from "../animation-repository"

@injectable()
class AnimationRepositoryImpl implements AnimationRepository {

    db:any
    dbName:string = "animations"

    @inject('DatabaseService')
    private databaseService: DatabaseService

    async load() {
        this.db = await this.databaseService.getDatabase({
            name: this.dbName
        })
    }

    constructor(
    ) {}


    async get(_id:string): Promise<Animation> {        
        return Object.assign(new Animation(), await this.db.get(_id))
    }



}

export {
    AnimationRepositoryImpl
}