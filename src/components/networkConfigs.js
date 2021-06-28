export const networkConfigs = {
    1: {
      readOnlyProvider:
        'https://eth-mainnet.alchemyapi.io/v2/b7Mxclz5hGyHqoeodGLQ17F5Qi97S7xJ',
      locksmithUri: 'https://locksmith.unlock-protocol.com',
      unlockAppUrl: 'https://app.unlock-protocol.com',
    },
    4: {
      readOnlyProvider:
        'https://eth-rinkeby.alchemyapi.io/v2/n0NXRSZ9olpkJUPDLBC00Es75jaqysyT',
      locksmithUri: 'https://rinkeby.locksmith.unlock-protocol.com',
      unlockAppUrl: 'https://app.unlock-protocol.com',
    },
    100: {
      readOnlyProvider: 'https://rpc.xdaichain.com/',
      locksmithUri: 'https://locksmith.unlock-protocol.com',
      unlockAppUrl: 'https://app.unlock-protocol.com',
    },
    137:{
      readOnlyProvider:"https://rpc-mainnet.matic.network",
      locksmithUri:"https://locksmith.unlock-protocol.com",
      unlockAppUrl: 'https://app.unlock-protocol.com',
  }
}

export const tokenMapConfig = [
    {'ETH': 1},
    {'RINKBEY': 4},
    {'XDAI':100},
    {'MATIC':137}

]

export const providerConfig = {
  1:{
    provider:'https://eth-mainnet.alchemyapi.io/v2/b7Mxclz5hGyHqoeodGLQ17F5Qi97S7xJ'
  },
  4:{
    provider:'https://eth-rinkeby.alchemyapi.io/v2/n0NXRSZ9olpkJUPDLBC00Es75jaqysyT'
  },
  100:{
    provider:"https://rpc.xdaichain.com/"
  },
  137:{
    provider:"https://rpc-mainnet.matic.network"
  }
}