export type TxnRecord = {
  hash: string 
  timestamp: string 
  from: string 
  to: string 
  type: string 
  contractAddress: string 
  symbol: string 
  tokenId: string 
  value: string 
  gasFee: string 
}

export type EtherscanTx = {
  hash: string
  timeStamp: string
  from: string
  to: string
  value: string
  gasPrice?: string
  gasUsed?: string
  tokenSymbol?: string
  tokenName?: string
  contractAddress?: string
  tokenID?: string
  isError?: string
  input?: string
  [key: string]: unknown // optional, for unknown fields
}

export enum EtherscanAction {
  TxList = 'txlist',
  TokenTx = 'tokentx',
  TokenNftTx = 'tokennfttx',
  TxListInternal = 'txlistinternal',
}

