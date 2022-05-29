interface WalletService {
  wallet
  address:string
  initWallet() : Promise<void>
  getWallet() : Promise<any>
  getContract(name:string)
}

export {
  WalletService
}

