import { injectable } from "inversify"
import fs from "fs"
import { AttributeReport, AttributeTotal } from "../../dto/viewmodel/attribute-report"
import { AttributeReportRepository } from "../attribute-report-repository"
import { Item } from "../../dto/item"
import { Channel } from "../../dto/channel"

@injectable()
class AttributeReportRepositoryImpl implements AttributeReportRepository {

    constructor() {}

    async get(): Promise<AttributeReport> {      
        let result = fs.readFileSync(`public/attributeReport.json`, 'utf8')          
        return JSON.parse(result)
    }

    async buildAttributeReport(channel:Channel, items:Item[]) : Promise<AttributeReport> {

        let report:AttributeReport = {
            totals: {}
        }
        
        for (let ao of channel.attributeOptions) {

            let totals:AttributeTotal[] = []

            //Create AttributeTotal for each possible value
            for (let value of ao.values) {
        
                let attributeTotal:AttributeTotal = {
                    value: value,
                    count: 0,
                    items: []
                }

                totals.push(attributeTotal)

            }

            report.totals[ao.traitType] = totals
        }


        //Loop through the items
        for (let item of items) {

            for (let as of item.attributeSelections) {
                
                let totals = report.totals[as.traitType]

                //Add one to the report total
                let total:AttributeTotal = totals.filter( at => at.value == as.value)[0]

                //If there's no total row for this one create it
                if (!total) {
                    total = {
                        value: as.value,
                        count: 0
                    }

                    totals.push(total)
                }

                // total.items.push(item)
                total.count++
            }

        }

        //Loop through keys and calculate totals for each one.
        for (let traitType of Object.keys(report.totals)) {

            let total = report.totals[traitType]

            //Calculate totals
            for (let at of total) {
                at.categoryPercent = new Intl.NumberFormat('default', {
                    style: 'percent',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }).format((at.count / channel.itemCount))
            }


            //Sort totals by count
            total.sort((a,b) => b.count - a.count)

        }


        return report
    }



}

export {
    AttributeReportRepositoryImpl
}


