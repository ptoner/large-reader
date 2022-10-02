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

        // console.log("replicae")
        // PouchDB.replicate('./pouch/items', 'http://localhost:5984/items', {live: true});



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
            if (config.changesets) {

                console.log(`Creating indexes for ${fullName}`)

                let localChangesets:LocalChangeset = { 
                    _id: "_local/changesets",
                    ids: [] 
                }

                for (let changeset of config.changesets) {
                    await changeset.changeset(this.dbCache[fullName])
                    localChangesets.ids.push(changeset.id)
                    console.log(`New changeset detected...${changeset.id}`)
                }

                //Mark changesets as run
                await this.dbCache[fullName].put(localChangesets)

                
            }

            //Load initial records
            if (config.initialRecords) {
                await this.loadInitialRecords(config, fullName)

            }

        } else {

            //Otherwise check if each changeset has been applied and if not then apply it.
            if (config.changesets) {

                let localChangesets:LocalChangeset 

                try {
                    localChangesets = await this.dbCache[fullName].get("_local/changesets")
                } catch(ex) {}

                if (!localChangesets) {
                    localChangesets = { 
                        _id: "_local/changesets",
                        ids: [] 
                    }
                }


                let updated = false

                for (let changeset of config.changesets) {
                    
                    //If it hasn't been run then run it.
                    if (!localChangesets.ids.includes(changeset.id)) {

                        try {
                            //Execute the changes. This could fail if the changes have actually been applied but it wasn't marked. 
                            //But in that scenario we just accept the failure and mark it applied. 
                            await changeset.changeset(this.dbCache[fullName])
                        } catch(ex) { }
                        
                        
                        localChangesets.ids.push(changeset.id)
                        
                        updated = true
                        
                        console.log(`New changeset detected...${changeset.id}`)
                    }

                }


                if (updated) {
                    console.log(`Saving changeset log...`, localChangesets)
                    await this.dbCache[fullName].put(localChangesets)
                }

                


            }



        }


        return this.dbCache[fullName]

    }



    private async loadInitialRecords(config: DatabaseConfig, fullName: string) {

        const response = await axios.get(`${this.baseURI}backup/export/backup/${config.name}.json`)

        let initialRecords = response.data;

        if (initialRecords?.length > 0) {
            console.log(`Loading ${initialRecords?.length} initial records for ${fullName}`);
            await this.dbCache[fullName].bulkDocs(initialRecords);
        }

    }
}

interface DatabaseConfig {
    name:string
    changesets?:Changeset[]
    initialRecords?:boolean
}

interface Changeset {
    id:string
    changeset(db): Promise<void>
}

interface LocalChangeset {
    _id:string
    ids:string[]
}

export {
    DatabaseService, Changeset
}
