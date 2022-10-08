import "core-js/stable"
import "regenerator-runtime/runtime"
import "reflect-metadata"

import { StaticPage, initReader } from "large-reader-services/dist/browser"
import { Container } from "inversify"
import PouchDB from 'pouchdb-browser';


let init = (baseURI:string, hostname:string, version:string, routablePages:StaticPage[]) => {

    let container = new Container()        

    function contracts() {
        
        const contract = require('../backup/contract/contract.json')
    
        if (!contract.contractAddress) return []
    
        const c = require('../backup/contract/contract-abi.json')
    
        //Override address
        c['Channel'].address = contract.contractAddress
    
        return c
    }
    
    container.bind("contracts").toConstantValue(contracts())
    container.bind("PouchDB").toConstantValue(PouchDB)


    return initReader(container, baseURI, hostname, version, routablePages)

} 



export { init }

