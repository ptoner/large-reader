import axios from "axios"

import { inject, injectable } from 'inversify';

import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find'
import PouchQuickSearch from 'pouchdb-quick-search'


@injectable()
class DatabaseService {

    dbCache = {}

    constructor(
        @inject('baseURI') private baseURI:string
    ) {
        //Enable find plugin
        PouchDB.plugin(PouchFind)

        //Enable quicksearch
        PouchDB.plugin(PouchQuickSearch)
    }

    async getDatabase(config:DatabaseConfig) {

        const fullName = `./pouch/${config.name}`

        if (this.dbCache[fullName]) return this.dbCache[fullName]

        //Create or open database
        this.dbCache[fullName] = new PouchDB(fullName)

        const details = await this.dbCache[fullName].info()

        //If it's empty build the indexes
        if (details.doc_count == 0 && details.update_seq == 0) {

            //Create indexes
            if (config.buildIndexes) {
                console.log(`Creating indexes for ${fullName}`)
                await config.buildIndexes(this.dbCache[fullName])
            }

            //Load initial records
            const response = await axios.get(`${this.baseURI}backup/${config.name}.json`)

            let initialRecords = response.data

            if (initialRecords?.length > 0) {
                console.log(`Loading ${initialRecords?.length} initial records for ${fullName}`)
                await this.dbCache[fullName].bulkDocs(initialRecords)
            }

        }


        return this.dbCache[fullName]

    }


}

interface DatabaseConfig {
    name:string
    buildIndexes?:Function
    initialRecords?:any[]
}

export {
    DatabaseService
}
