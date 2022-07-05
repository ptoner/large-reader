import {  injectable } from "inversify"
import { Channel } from "../../dto/channel"
import fs from "fs"
import { ChannelRepository } from "./../channel-repository"
import { AttributeReport, AttributeTotal } from "../../dto/viewmodel/attribute-report"
import { Item } from "../../dto/item"

@injectable()
class ChannelRepositoryImpl implements ChannelRepository {
    
    constructor() {}

    async get(): Promise<Channel> {        
        
        const channels = JSON.parse(fs.readFileSync('backup/channels.json', 'utf8'))
        let channel:Channel = channels[0]


        try {
            const contract = JSON.parse(fs.readFileSync('backup/contract.json', 'utf8'))

            if (contract?.contractAddress) {
                channel.contractAddress = contract.contractAddress
            }
    
        } catch(ex) {}

        return channel
    }

    async getAttributeReport(items:Item[]) : Promise<AttributeReport> {

        let report:AttributeReport = {
            totals: new Map<string, AttributeTotal[]>()
        }
        
        let channel:Channel = await this.get()


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

            report.totals.set(ao.traitType, totals)

        }


        //Loop through the items
        for (let item of items) {

            for (let as of item.attributeSelections) {
                
                let totals = report.totals.get(as.traitType)

                //Add one to the report total
                let total:AttributeTotal = totals.filter( at => at.value == as.value)[0]

                //If there's no total row for this one create it
                if (!total) {
                    total = {
                        value: as.value,
                        count: 0,
                        items: []
                    }

                    totals.push(total)
                }

                total.items.push(item)
                total.count++
            }

        }

        


        
        for (let traitType of report.totals.keys()) {

            let total = report.totals.get(traitType)

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
    ChannelRepositoryImpl
}