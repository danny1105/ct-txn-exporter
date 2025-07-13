import {
  weiToEth,
  timestampToDate,
  gasFeeEth,
  fetchEtherscanData,
  exportToCSV,
} from "./utils"
import { TxnRecord, EtherscanAction } from "./types"

const allTxs: TxnRecord[] = []

async function fetchTransactions(walletAddress: string) {
  // Fetch normal external transactions (ETH transfers & contract interactions)
  const ethTxs = await fetchEtherscanData(
    EtherscanAction.TxList,
    walletAddress
  )

  // Fetch ERC-20 token transfer history (e.g., USDC, DAI, etc.)
  const erc20Txs = await fetchEtherscanData(
    EtherscanAction.TokenTx,
    walletAddress
  )

  // Fetch NFT transfer history (ERC-721 and ERC-1155 tokens)
  const nftTxs = await fetchEtherscanData(
    EtherscanAction.TokenNftTx,
    walletAddress
  )

  // Fetch internal transactions (value transfers triggered inside smart contracts)
  const internalTxs = await fetchEtherscanData(
    EtherscanAction.TxListInternal,
    walletAddress
  )

  // Convert each ETH transaction into a standardized CSV row format.

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
