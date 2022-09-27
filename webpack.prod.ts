import { merge } from 'webpack-merge'
import common from './webpack.common'

let mainConfigs = []

let baseConfig:any = require("./base-config.json")

let config:any = require("./large-config.json")


//Set base URL
if (!config.baseURL) {
    config.baseURL = baseConfig.baseURL
}

//Set hostname
if (!config.hostname) {
    config.hostname = baseConfig.hostname
}

//Create marketplace config from base config + anything set in large-config
if (config.marketplaces?.length > 0) {
    for (let marketplace of config.marketplaces) {

        //Look it up in base config
        let matches = baseConfig.marketplaces.filter(m => m.name == marketplace.name)
    
        if (matches?.length > 0) {
        
            //Set asset link
            if (!marketplace.assetLink) {
                marketplace.assetLink = matches[0].assetLink
            }
    
            if (!marketplace.link) {
                marketplace.link = matches[0].link
            }
    
        }
    
    }
}

export default async () => {
    let configs = await common(config.hostname, config.baseURL, config.marketplaces, 100000)

    // let configs = await common(config.hostname, config.baseURL, config.largeURL, config.ipfsCid, config.marketplaces, 35)

    for (let config of configs) {
        //@ts-ignore
        mainConfigs.push(merge(config, {
            //@ts-ignore
            mode: 'production'
        }))
    }
    
    return mainConfigs

}
