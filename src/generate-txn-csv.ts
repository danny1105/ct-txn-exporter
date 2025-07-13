import {
  weiToEth,
  timestampToDate,
  gasFeeEth,
  fetchEtherscanData,
  exportToCSV,
} from "./utils"
import { TxnRecord } from "./types"

const allTxs: TxnRecord[] = []

async function fetchTransactions(walletAddress: string) {
  const ethTxs = await fetchEtherscanData("txlist", walletAddress)
  const erc20Txs = await fetchEtherscanData("tokentx", walletAddress)
  const nftTxs = await fetchEtherscanData("tokennfttx", walletAddress)
  const internalTxs = await fetchEtherscanData("txlistinternal", walletAddress)

  for (const tx of ethTxs) {
    allTxs.push({
      hash: tx.hash,
      timestamp: timestampToDate(tx.timeStamp),
      from: tx.from,
      to: tx.to,
      type: tx.input !== "0x" ? "Contract Interaction" : "ETH Transfer",
      contractAddress: "",
      symbol: "ETH",
      tokenId: "",
      value: weiToEth(tx.value),
      gasFee: gasFeeEth(tx.gasUsed ?? "", tx.gasPrice ?? ""),
    })
  }

  for (const tx of erc20Txs) {
    allTxs.push({
      hash: tx.hash,
      timestamp: timestampToDate(tx.timeStamp),
      from: tx.from,
      to: tx.to,
      type: "ERC-20 Transfer",
      contractAddress: tx.contractAddress ?? "",
      symbol: tx.tokenSymbol ?? "",
      tokenId: "",
      value: weiToEth(
        tx.value,
        typeof tx.tokenDecimal === "string" ? parseInt(tx.tokenDecimal) : 18
      ),
      gasFee: "",
    })
  }

  for (const tx of nftTxs) {
    allTxs.push({
      hash: tx.hash,
      timestamp: timestampToDate(tx.timeStamp),
      from: tx.from,
      to: tx.to,
      type: "ERC-721/1155 Transfer",
      contractAddress: tx.contractAddress ?? "",
      symbol: tx.tokenName ?? "",
      tokenId: tx.tokenID ?? "",
      value: "1",
      gasFee: "",
    })
  }

  for (const itx of internalTxs) {
    allTxs.push({
      hash: itx.hash,
      timestamp: timestampToDate(itx.timeStamp),
      from: itx.from,
      to: itx.to,
      type: "Internal Transfer",
      contractAddress: "", // no token
      symbol: "ETH",
      tokenId: "",
      value: weiToEth(itx.value),
      gasFee: "", // N/A for internal transfers
    })
  }
}

export async function generateTxnCSV(walletAddress: string): Promise<void> {
  await fetchTransactions(walletAddress)
  await exportToCSV(walletAddress, allTxs)
}
