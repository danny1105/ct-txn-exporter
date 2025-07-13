import axios from 'axios';
import { createObjectCsvWriter } from 'csv-writer';
import dotenv from 'dotenv';

dotenv.config();

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const address = process.argv[2];

if (!address) {
  console.error("Usage: node getTransactions.js <wallet_address>");
  process.exit(1);
}

async function fetchTransactions(address: string) {
  const url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&sort=asc&apikey=${ETHERSCAN_API_KEY}`;
  const response = await axios.get(url);
  return response.data.result;
}

async function exportToCSV(transactions: any[]) {
  const csvWriter = createObjectCsvWriter({
    path: 'transactions.csv',
    header: [
      { id: 'hash', title: 'Hash' },
      { id: 'from', title: 'From' },
      { id: 'to', title: 'To' },
      { id: 'value', title: 'Value (ETH)' },
      { id: 'timeStamp', title: 'Timestamp' },
    ],
  });

  await csvWriter.writeRecords(
    transactions.map(tx => ({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: (Number(tx.value) / 1e18).toFixed(5),
      timeStamp: new Date(Number(tx.timeStamp) * 1000).toISOString(),
    }))
  );

  console.log("✅ CSV export completed!");
}

(async () => {
  const transactions = await fetchTransactions(address);
  await exportToCSV(transactions);
})();
