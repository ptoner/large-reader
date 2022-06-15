import { Author } from "../author";
import { Channel } from "../channel";
import { Image } from "../image";
import { Item } from "../item";
import { AttributeSelectionViewModel } from "./attribute-selection-view-model";

interface ItemViewModel {

    channel?:Channel
    
    item?:Item 
    dateDisplay?:string
    coverImage?:Image

    author?:Author
    authorDisplayName?:string 

    attributeSelections:AttributeSelectionViewModel[]

    //For previous/next navigation
    next?:Item
    previous?:Item 


}

export {
    ItemViewModel
}