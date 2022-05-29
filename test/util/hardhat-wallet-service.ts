import { Contract, ethers } from "ethers"
import { inject, injectable } from "inversify"
import { WalletService } from "../../src/service/core/wallet-service"


@injectable()
class HardhatWalletServiceImpl implements WalletService {

  public wallet: any
  public address
  public ethersContracts:any = {}

  constructor(
    @inject("provider") private provider,
    @inject("contracts") private contracts:Contract[],
  ) {}

  async initWallet() {

    console.log('Init wallet')

    this.wallet = await this.provider.getSigner()
    console.log("Init wallet complete") 

  }

  async getWallet() {
    return this.provider.getSigner()
  }

  getContract(name:string)  {

    //If it's cached and the same wallet just return it.
    if (this.ethersContracts[name] && this.ethersContracts[name].signer == this.wallet) return this.ethersContracts[name]

    //Initialize and return
    let c = this.contracts[name]
    this.ethersContracts[name] = new ethers.Contract(c.address, c.abi, this.wallet ? this.wallet : this.provider)

    // console.log(`Getting contract ${name}`)

    return this.ethersContracts[name]
  }
}




export {
  HardhatWalletServiceImpl
}

