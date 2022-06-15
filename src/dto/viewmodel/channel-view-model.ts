import { PagingViewModel } from "../../service/core/paging-service";
import { Author } from "../author";
import { Channel } from "../channel";
import { ItemViewModel } from "./item-view-model";

interface ChannelViewModel {

    channel:Channel

    author:Author
    authorDisplayName:string 

    itemCount:number
    channelContractAbbrev:string

    pagingViewModel:PagingViewModel

    items:ItemViewModel[]


}

export {
    ChannelViewModel
}