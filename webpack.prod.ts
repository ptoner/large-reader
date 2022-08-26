import { merge } from 'webpack-merge'
import common from './webpack.common'

let mainConfigs = []

let config:any = require("./large-config.json")

export default async () => {

    let configs = await common(config.hostname, config.baseURL, config.largeURL, config.ipfsCid, config.marketplaces)

    for (let config of configs) {
        //@ts-ignore
        mainConfigs.push(merge(config, {
            //@ts-ignore
            mode: 'production'
        }))
    }
    
    return mainConfigs

}
