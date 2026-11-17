import { describe, expect, it } from 'vitest'
import { calculateMaximumSafeDiscount, calculateOutcomeProfit, calculateProfit, calculateRequiredPriceForMargin } from './profit'

describe('calculateProfit', () => {
  const base = { mrp: 1000, sellingPrice: 1050, quantity: 1, gstRate: 5, priceIncludesGst: true, discount: 0, advertisingCost: 100, costs: [{ id: 'cost', label: 'Manufacturing', amount: 400, kind: 'item' as const }] }
  it('removes GST from a tax-inclusive customer charge', () => expect(calculateProfit(base).netSales).toBe(1000))
  it('keeps tax-exclusive selling price as net sales', () => expect(calculateProfit({ ...base, priceIncludesGst: false }).netSales).toBe(1050))
  it('applies a fixed discount before GST treatment', () => expect(calculateProfit({ ...base, discount: 105 }).customerPayable).toBe(945))
  it('uses contribution before advertising as break-even CPA', () => {
    const result = calculateProfit(base)
    expect(result.maxCpa).toBe(result.contributionBeforeAds)
    expect(result.contributionAfterAds).toBe(result.contributionBeforeAds - 100)
  })
  it('handles zero quantity without NaN or infinity', () => {
    const result = calculateProfit({ ...base, quantity: 0 })
    expect(result.margin).toBe(0)
    expect(result.profitPerItem).toBe(0)
  })
  it('keeps a target contribution when calculating a safe discount', () => {
    const discount = calculateMaximumSafeDiscount(base, 300)
    expect(calculateProfit({ ...base, discount }).contributionAfterAds).toBeGreaterThanOrEqual(299.99)
  })
  it('solves a price that reaches the requested contribution margin', () => {
    const sellingPrice = calculateRequiredPriceForMargin(base, 20)
    const result = calculateProfit({ ...base, sellingPrice })
    expect(result.margin).toBeCloseTo(20, 1)
  })
  it('models a probability-weighted return outcome and validates total probability', () => {
    const output = calculateOutcomeProfit([
      { id: 'delivered', probability: 80, revenue: 1000, refund: 0, forwardShipping: 70, reverseShipping: 0, damagedInventory: 0, paymentProcessing: 20 },
      { id: 'returned', probability: 20, revenue: 1000, refund: 1000, forwardShipping: 70, reverseShipping: 70, damagedInventory: 50, paymentProcessing: 20 },
    ])
    expect(output.valid).toBe(true)
    expect(output.expectedProfit).toBe(686)
  })
})
