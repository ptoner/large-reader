import { AttributeReport } from "../dto/viewmodel/attribute-report"
import { Item } from "../dto/item"
import { Channel } from "../dto/channel"

interface AttributeReportRepository {
    get(): Promise<AttributeReport>
    buildAttributeReport(channel:Channel, items:Item[]) : Promise<AttributeReport>
}



export {
    AttributeReportRepository
}
