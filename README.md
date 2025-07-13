# Crypto Transaction CSV Exporter

A TypeScript CLI tool to fetch the complete transaction history of an Ethereum wallet (ETH transfers, ERC-20 tokens, and NFTs — ERC-721/1155) and export it to a structured CSV file.

---

## Features

* Supports ETH, ERC-20, ERC-721, and ERC-1155 transactions
* Pulls historical data using the Etherscan API
* Outputs a clean CSV file with:

  * Transaction Hash
  * Date & Time
  * From / To Address
  * Transaction Type (ETH, Token, NFT, or Contract Interaction)
  * Asset Info (Symbol, Contract Address, Token ID)
  * Amount
  * Gas Fee (ETH)
* Timestamps foldered by `csv/YYYY-MM-DD/`
* Easy CLI usage with wallet address

---

## Setup

```bash
git clone https://github.com/danny1105/ct-txn-exporter.git
cd ct-txn-exporter
npm install
```

### Set your Etherscan API key

Create a `.env` file and add your API key:

```
ETHERSCAN_API_KEY=your_api_key_here
```

---

## Usage

You can run the script in development or after building the project.
Development Mode (with ts-node)

```bash
npm run dev -- 0xYourWalletAddress
```

After compiling TypeScript

```bash
npm run build
npm start -- 0xYourWalletAddress
```

---

## Output

The CSV will be saved to:

```
csv/YYYY-MM-DD/0xYourWalletAddressHere.csv
```

Each row includes:

| Column                 | Description                        |
| ---------------------- | ---------------------------------- |
| Transaction Hash       | Unique identifier                  |
| Date & Time            | ISO timestamp                      |
| From Address           | Sender                             |
| To Address             | Recipient                          |
| Transaction Type       | ETH, ERC-20, NFT, or contract call |
| Asset Contract Address | Token/NFT contract                 |
| Asset Symbol / Name    | Token symbol or collection name    |
| Token ID               | NFT identifier (if applicable)     |
| Value / Amount         | ETH or token value                 |
| Gas Fee (ETH)          | Total gas cost                     |

---

## Project Structure

```
src/
├── __tests__/             
│   ├── generate-txn-csv.test.ts     # Unit tests for generateTxnCSV logic
│   ├── utils.test.ts                # Unit tests for utility functions
├── index.ts               # Entry point CLI script
├── generate-txn-csv.ts    # Main export logic
├── utils.ts               # Utility functions (formatting, API calls)
└── types.ts               # Shared types and interfaces
└── constants.ts           # Shared constants (e.g., CSV headers)

csv/
└── YYYY-MM-DD/
    └── 0xWallet.csv       # Exported CSV file
```

---

## Built With

* [TypeScript](https://www.typescriptlang.org/)
* [Etherscan API](https://docs.etherscan.io/)
* [csv-writer](https://www.npmjs.com/package/csv-writer)
* [Jest](https://jestjs.io/) – Testing framework for unit tests
* [ESLint](https://eslint.org/) – Linter for consistent code style and error checking

---
