import { Item } from "../item"

interface AttributeReport {
    totals?:Map<string, AttributeTotal[]>
}

interface AttributeTotal {
    value?:string 
    count?:number 
    categoryPercent?:string
    items:Item[]
}

export { AttributeReport,AttributeTotal }