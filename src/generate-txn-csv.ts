import axios from 'axios' 
import { createObjectCsvWriter } from 'csv-writer' 
import dotenv from 'dotenv' 

dotenv.config() 

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY 

async function fetchTransactions(address: string) {
  const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=asc&apikey=${ETHERSCAN_API_KEY}` 
  const response = await axios.get(url) 
  return response.data.result 
}

async function exportToCSV(transactions: any[]) {
  const csvWriter = createObjectCsvWriter({
    path: 'transactions.csv',
    header: [
      { id: 'hash', title: 'Transaction Hash' },
      { id: 'timestamp', title: 'Date & Time' },
      { id: 'from', title: 'From Address' },
      { id: 'to', title: 'To Address' },
      { id: 'type', title: 'Transaction Type' },
      { id: 'contractAddress', title: 'Asset Contract Address' },
      { id: 'symbol', title: 'Asset Symbol / Name' },
      { id: 'tokenId', title: 'Token ID' },
      { id: 'value', title: 'Value / Amount' },
      { id: 'gasFee', title: 'Gas Fee (ETH)' },
    ],
  }) 

  await csvWriter.writeRecords(
    transactions.map(tx => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: (Number(tx.value) / 1e18).toFixed(5),
      timeStamp: new Date(Number(tx.timeStamp) * 1000).toISOString(),
    }))
  )

  console.log("CSV export completed!") 
}

export async function generateTxnCSV(walletAddress: string): Promise<void> {
  const transactions = await fetchTransactions(walletAddress)
  await exportToCSV(transactions)
}
