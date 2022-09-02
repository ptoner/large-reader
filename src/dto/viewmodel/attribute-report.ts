import { Item } from "../item"

interface AttributeReport {
    totals?:any 
}

interface AttributeTotal {
    value?:string 
    count?:number 
    categoryPercent?:string
    items?:Item[]
}

export { AttributeReport,AttributeTotal }