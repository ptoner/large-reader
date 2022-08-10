import { merge } from 'webpack-merge'
import common from './webpack.common'

let mainConfigs = []

let hostname = "https://localhost:8081"
let baseURL = "/"
let largeURL = "https://localhost:8081"
let ipfsCid = ""


export default async () => {

    let configs = await common(hostname, baseURL, largeURL, ipfsCid)

    for (let config of configs) {
        //@ts-ignore
        mainConfigs.push(merge(config, {
            //@ts-ignore
            mode: 'production'
        }))
    }
    
    return mainConfigs

}
