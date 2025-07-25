import dotenv from "dotenv"

dotenv.config()

export const CSV_HEADERS = [
  { id: "hash", title: "Transaction Hash" },
  { id: "timestamp", title: "Date & Time" },
  { id: "from", title: "From Address" },
  { id: "to", title: "To Address" },
  { id: "type", title: "Transaction Type" },
  { id: "contractAddress", title: "Asset Contract Address" },
  { id: "symbol", title: "Asset Symbol / Name" },
  { id: "tokenId", title: "Token ID" },
  { id: "value", title: "Value / Amount" },
  { id: "gasFee", title: "Gas Fee (ETH)" },
]

export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
export const BASE_URL = 'https://api.etherscan.io/api'