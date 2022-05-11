import { PagingViewModel } from "../../service/core/paging-service";
import { Author } from "../author";
import { Channel } from "../channel";
import { Image } from "../image";
import { Item } from "../item";
import { ImageViewModel } from "../viewmodel/image-view-model";
import { ItemViewModel } from "./item-view-model";

interface ChannelViewModel {

    channel:Channel

    author:Author
    authorDisplayName:string 

    itemCount:number

    pagingViewModel:PagingViewModel

    items:ItemViewModel[]


}

export {
    ChannelViewModel
}