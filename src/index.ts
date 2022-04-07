import "core-js/stable"
import "regenerator-runtime/runtime"
import "reflect-metadata"


import { getMainContainer } from "./inversify.config"


//Import CSS
import './html/css/app.css'
import './html/css/framework7-bundle.css'
import './html/css/framework7-icons.css'

import 'material-icons/iconfont/material-icons.css';


export default async() => {
                
    let container = getMainContainer()

    let contractAddress = ""
    let collectionCid = ""

    
}
