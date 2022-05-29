import { ItemViewModel } from "./item-view-model"

interface MintingViewModel {
    totalMinted?:number 
    totalSupply?:number
    mintPrice?:string
    items?:ItemViewModel[]
}

export {
    MintingViewModel
}