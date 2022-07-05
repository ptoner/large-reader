
interface ItemPage {
    items?:RowItemViewModel[]
}

interface RowItemViewModel {
    _id:string
    title:string
    coverImageId:string
    coverImageGenerated:boolean 

}

export {
    ItemPage, RowItemViewModel
}