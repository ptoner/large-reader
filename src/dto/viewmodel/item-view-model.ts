import { Author } from "../author";
import { Channel } from "../channel";
import { Item } from "../item";
import { AttributeSelectionViewModel } from "./attribute-selection-view-model";
import { ImageViewModel } from "./image-view-model";

interface ItemViewModel {

    channel?:Channel
    
    item?:Item 
    dateDisplay?:string
    coverImage?:ImageViewModel

    author?:Author
    authorDisplayName?:string 

    images?:ImageViewModel[]

    attributeSelections:AttributeSelectionViewModel[]

    //For previous/next navigation
    next?:Item
    previous?:Item 

}

export {
    ItemViewModel
}