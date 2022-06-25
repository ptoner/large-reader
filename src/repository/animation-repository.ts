import { Animation } from "../dto/animation"


interface AnimationRepository {
    get(_id:string): Promise<Animation>

}

export {
    AnimationRepository
}
