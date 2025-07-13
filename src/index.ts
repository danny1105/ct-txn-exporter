import { generateTxnCSV } from "./generate-txn-csv.js"

const walletAddress = process.argv[2]

if (!walletAddress) {
  console.error({ walletAddress, message: "Please provide a wallet address." })
  process.exit(1)
}

(async () => {
  try {
    await generateTxnCSV(walletAddress)
    console.log("CSV generation complete.")
  } catch (error) {
    console.error({
        error,
        message: "Error in generating CSV."
    })
  }
})()
