interface WalletService {
  wallet
  address:string
  initWallet() : Promise<void>
  getWallet() : Promise<any>
  getContract(name:string)
  truncateEthAddress(address) : string
}

export {
  WalletService
}

