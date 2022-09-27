import axios from "axios"
import { inject, injectable } from "inversify"
import { Channel } from "../../dto/channel"
import { Item } from "../../dto/item"
import { AttributeReport } from "../../dto/viewmodel/attribute-report"
import { AttributeReportRepository } from "../attribute-report-repository"

@injectable()
class AttributeReportRepositoryImpl implements AttributeReportRepository {

    constructor(
        @inject("baseURI") private baseURI
    ) {}

    async get(): Promise<AttributeReport> {   

        const response = await axios.get(`${this.baseURI}attributeReport.json`)
            
        return response.data
    }

    async buildAttributeReport(channel:Channel, items:Item[]) : Promise<AttributeReport> {
        return 
    }


}

export {
    AttributeReportRepositoryImpl
}


