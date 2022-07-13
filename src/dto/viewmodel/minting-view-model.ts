import { Item } from "../item"

interface MintingViewModel {
    totalMinted?:number 
    totalSupply?:number
    mintPrice?:string

    lastMinted?:any[]

}

export {
    MintingViewModel
}