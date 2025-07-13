import { weiToEth, timestampToDate, gasFeeEth } from "../utils"

describe("weiToEth", () => {
  it("converts 1 ETH in wei", () => {
    expect(weiToEth("1000000000000000000")).toBe("1.000000")
  })

  it("returns empty string on invalid input", () => {
    expect(weiToEth("abc")).toBe("")
    expect(weiToEth("")).toBe("")
  })
})

describe("timestampToDate", () => {
  it("converts timestamp to ISO string", () => {
    expect(timestampToDate("1609459200")).toBe("2021-01-01T00:00:00.000Z")
  })

  it("returns empty string on invalid timestamp", () => {
    expect(timestampToDate("abc")).toBe("")
    expect(timestampToDate("0")).toBe("")
  })
})

describe("gasFeeEth", () => {
  it("calculates gas fee in ETH", () => {
    const gasUsed = "21000"
    const gasPrice = "1000000000" // 1 Gwei
    expect(gasFeeEth(gasUsed, gasPrice)).toBe("0.000021")
  })

  it("returns empty string for missing values", () => {
    expect(gasFeeEth("", "100")).toBe("")
    expect(gasFeeEth("100", "")).toBe("")
  })
})
