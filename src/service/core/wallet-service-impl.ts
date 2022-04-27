import { Contract, ethers } from "ethers"
import { inject, injectable } from "inversify"
import { WalletService } from "./wallet-service"


@injectable()
class WalletServiceImpl implements WalletService {

  public wallet: any
  public address: any
  // public ethersContracts:any = {}

  

  constructor(
    // @inject("contracts") private contracts:Contract[],
    @inject("provider") private provider
  ) {}

  async initWallet() {

    console.log('Init wallet')

    //@ts-ignore
    let accounts = await this.provider.send("eth_accounts", [])

    if (accounts?.length > 0) {
      this.address = accounts[0]
      // return this.connect()
    }
    
    console.log("Init wallet complete") 


  }


  async connect() {
    
    console.log("Connect wallet")

    await this.provider.send("eth_requestAccounts", []);

    this.wallet = await this.provider.getSigner()
    this.address = await this.getAddress()
    
    console.log(`Wallet ${this.address} connected`) 

  }

  async getAddress() {

      let accounts = await this.provider.send("eth_accounts", []);

      if (accounts?.length > 0) {
        return accounts[0]
      }

  }

  async getWallet() {
    return this.provider.getSigner()
  }

}




export {
    WalletServiceImpl
}

