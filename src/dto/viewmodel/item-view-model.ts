import { Author } from "../author";
import { Channel } from "../channel";
import { Image } from "../image";
import { Item } from "../item";
import { Animation } from "../animation";

import { AttributeSelectionViewModel } from "./attribute-selection-view-model";

interface ItemViewModel {

    channel?:Channel
    
    item?:Item 
    dateDisplay?:string

    coverImage?:Image
    animation?:Animation
    
    
    contentHTML?:string
    animationContentHTML?:string

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