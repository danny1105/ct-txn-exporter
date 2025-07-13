import fs from 'fs'
import path from 'path'
import axios from 'axios'

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const BASE_URL = 'https://api.etherscan.io/api'

export function getCsvFilePath(walletAddress: string): string {
  const datePart = new Date().toISOString().slice(0, 10) // "YYYY-MM-DD"
  const dir = path.join('csv', datePart)
  const fileName = `${walletAddress}.csv`

  // Ensure directory exists
  fs.mkdirSync(dir, { recursive: true })

  return path.join(dir, fileName)
}

export function weiToEth(wei: string, decimals = 18) {
  return (Number(wei) / Math.pow(10, decimals)).toFixed(6) 
}

export function timestampToDate(ts: string) {
  return new Date(Number(ts) * 1000).toISOString() 
}

export function gasFeeEth(gasUsed: string, gasPrice: string) {
  return weiToEth((BigInt(gasUsed) * BigInt(gasPrice)).toString()) 
}

export async function fetchEtherscanData(action: string, walletAddress: string) {
  const response = await axios.get(BASE_URL, {
    params: {
      module: 'account',
      action,
      address: walletAddress,
      sort: 'asc',
      apikey: ETHERSCAN_API_KEY,
    },
  }) 
  return response.data.result 
}