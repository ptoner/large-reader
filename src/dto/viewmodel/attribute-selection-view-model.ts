import { AttributeOptions, AttributeSelection } from "../../dto/attribute";
import { AttributeTotal } from "./attribute-report";


interface AttributeSelectionViewModel {

    id:string
    traitType:string

    values:string[]
    value:string

    attributeTotal:AttributeTotal
}

export {
    AttributeSelectionViewModel
}