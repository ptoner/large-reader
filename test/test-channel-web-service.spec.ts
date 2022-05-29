import { WalletService } from "../src/service/core/wallet-service"
import { TokenService } from "../src/service/token-service"
import { getMainContainer } from "./inversify.config"

const assert = require('assert')



let tokenService

describe('TokenService', () => {

  before(async () => {
    
    let container = getMainContainer()

    tokenService = container.get(TokenService)

  })

  after(async () => {

  })

  it('', async () => {

  })

})