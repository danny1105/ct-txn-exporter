import fs from 'fs'
import path from 'path'

export function getCsvFilePath(walletAddress: string): string {
  const datePart = new Date().toISOString().slice(0, 10) // "YYYY-MM-DD"
  const dir = path.join('csv', datePart)
  const fileName = `${walletAddress}.csv`

  // Ensure directory exists
  fs.mkdirSync(dir, { recursive: true })

  return path.join(dir, fileName)
}