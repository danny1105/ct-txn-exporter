import fs from 'fs'
import path from 'path'
import axios from 'axios'

import { EtherscanTx, TxnRecord, EtherscanAction } from './types'
import { CSV_HEADERS, ETHERSCAN_API_KEY, BASE_URL } from "./constants"
import { createObjectCsvWriter } from 'csv-writer'


export function getCsvFilePath(walletAddress: string): string {
  const datePart = new Date().toISOString().slice(0, 10) // "YYYY-MM-DD"
  const dir = path.join('csv', datePart)
  const fileName = `${walletAddress}.csv`

  // Ensure directory exists
  fs.mkdirSync(dir, { recursive: true })

  return path.join(dir, fileName)
}

export function weiToEth(wei: string, decimals = 18) {
  if (!wei || isNaN(Number(wei))) {
    return ''
  }

  return (Number(wei) / Math.pow(10, decimals)).toFixed(6)
}

export function timestampToDate(ts: string) {
  const ms = Number(ts) * 1000
  if (!ts || isNaN(ms) || ms <= 0) return ''
  return new Date(ms).toISOString()
}

export function gasFeeEth(gasUsed: string, gasPrice: string) {
  if (!gasUsed || !gasPrice) {
    return ''
  }

  try {
    const fee = BigInt(gasUsed) * BigInt(gasPrice)
    
    return weiToEth(fee.toString())
  } catch (err) {
    console.warn({
      message: 'Invalid gasUsed or gasPrice:', 
      gasUsed, 
      gasPrice, 
      error: err
    })

    return ''
  }
}

export async function fetchEtherscanData(action: EtherscanAction, walletAddress: string) {
  const allResults: EtherscanTx[] = []
  let startBlock = 0
  let keepFetching = true

  while (keepFetching) {
    const response = await axios.get(BASE_URL, {
      params: {
        module: 'account',
        action,
        address: walletAddress,
        sort: 'asc',
        startblock: startBlock,
        apikey: ETHERSCAN_API_KEY,
      },
    })

    const result = response.data.result || []

    if (result.length === 0) {
      keepFetching = false
    } else {
      allResults.push(...result)

      // Prevent infinite loop by checking last block number
      const lastBlock = parseInt(result[result.length - 1].blockNumber, 10)
      if (isNaN(lastBlock) || result.length < 10000) {
        keepFetching = false
      } else {
        startBlock = lastBlock + 1
      }
    }
  }

  return allResults
}

export async function exportToCSV(walletAddress: string, allTxs: TxnRecord[]) {
  const filePath = getCsvFilePath(walletAddress)

  const csvWriter = createObjectCsvWriter({
    path: filePath,
    header: CSV_HEADERS,
  })

  await csvWriter.writeRecords(allTxs)

  console.log("CSV export completed!")
}