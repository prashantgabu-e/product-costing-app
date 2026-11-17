import Decimal from 'decimal.js'

export type CostRow = { id: string; label: string; amount: number; kind: 'item' | 'order' | 'percent' }
export type ProfitInput = {
  mrp: number; sellingPrice: number; quantity: number; gstRate: number; priceIncludesGst: boolean
  costs: CostRow[]; discount: number; advertisingCost: number
}
export type ProfitResult = {
  customerPayable: number; discount: number; netSales: number; productCosts: number; fulfillmentCosts: number
  paymentCosts: number; variableCosts: number; contributionBeforeAds: number; contributionAfterAds: number
  margin: number; profitPerItem: number; breakEvenPrice: number; maxCpa: number
}
export type ReturnOutcome = {
  id: 'delivered' | 'returned' | 'rto' | 'cancelled'
  probability: number
  revenue: number
  refund: number
  forwardShipping: number
  reverseShipping: number
  damagedInventory: number
  paymentProcessing: number
  otherCosts?: number
}
export type OutcomeProfit = { expectedProfit: number; probabilityTotal: number; valid: boolean; byOutcome: Array<ReturnOutcome & { profit: number; weightedProfit: number }> }
const money = (value: Decimal.Value) => new Decimal(value || 0)
const round = (value: Decimal) => value.toDecimalPlaces(2, Decimal.ROUND_HALF_UP).toNumber()

export function calculateProfit(input: ProfitInput): ProfitResult {
  const quantity = money(Math.max(0, input.quantity || 0))
  const listTotal = money(Math.max(0, input.sellingPrice || 0)).mul(quantity)
  const discount = Decimal.min(listTotal, money(Math.max(0, input.discount || 0)))
  const payable = listTotal.minus(discount)
  const taxDivisor = money(1).plus(money(Math.max(0, input.gstRate || 0)).div(100))
  const netSales = input.priceIncludesGst ? payable.div(taxDivisor) : payable
  let productCosts = money(0), fulfillmentCosts = money(0), paymentCosts = money(0)
  input.costs.forEach((row) => {
    const amount = money(Math.max(0, row.amount || 0))
    const cost = row.kind === 'percent' ? payable.mul(amount).div(100) : row.kind === 'item' ? amount.mul(quantity) : amount
    if (/payment|gateway|cod/i.test(row.label)) paymentCosts = paymentCosts.plus(cost)
    else if (/shipping|packaging|handling|label/i.test(row.label)) fulfillmentCosts = fulfillmentCosts.plus(cost)
    else productCosts = productCosts.plus(cost)
  })
  const variableCosts = productCosts.plus(fulfillmentCosts).plus(paymentCosts)
  const beforeAds = netSales.minus(variableCosts)
  const afterAds = beforeAds.minus(money(Math.max(0, input.advertisingCost || 0)))
  return {
    customerPayable: round(payable), discount: round(discount), netSales: round(netSales), productCosts: round(productCosts),
    fulfillmentCosts: round(fulfillmentCosts), paymentCosts: round(paymentCosts), variableCosts: round(variableCosts),
    contributionBeforeAds: round(beforeAds), contributionAfterAds: round(afterAds),
    margin: netSales.isZero() ? 0 : round(afterAds.div(netSales).mul(100)),
    profitPerItem: quantity.isZero() ? 0 : round(afterAds.div(quantity)),
    breakEvenPrice: quantity.isZero() ? 0 : round(variableCosts.mul(taxDivisor).div(quantity)), maxCpa: round(beforeAds)
  }
}

/** The greatest order discount that preserves the requested post-ad contribution. */
export function calculateMaximumSafeDiscount(input: ProfitInput, targetContribution: number): number {
  const baseline = calculateProfit({ ...input, discount: 0 })
  const taxMultiplier = input.priceIncludesGst ? money(1).plus(money(input.gstRate || 0).div(100)) : money(1)
  const percentageCosts = input.costs.filter((row) => row.kind === 'percent').reduce((total, row) => total.plus(Math.max(0, row.amount || 0)), money(0)).div(100)
  const room = money(baseline.contributionAfterAds).minus(Math.max(0, targetContribution)).div(money(1).div(taxMultiplier).plus(percentageCosts))
  return Math.max(0, Math.min(input.sellingPrice * Math.max(0, input.quantity), round(room)))
}

/** Solves the inclusive/exclusive selling price needed to reach a target contribution margin. */
export function calculateRequiredPriceForMargin(input: ProfitInput, targetMarginPercent: number): number {
  const target = money(Math.min(99.99, Math.max(0, targetMarginPercent))).div(100)
  const quantity = money(Math.max(1, input.quantity || 1))
  const fixedCosts = input.costs.reduce((total, row) => {
    if (row.kind === 'percent') return total
    const value = money(Math.max(0, row.amount || 0))
    return total.plus(row.kind === 'item' ? value.mul(quantity) : value)
  }, money(Math.max(0, input.advertisingCost || 0)))
  const percentageCosts = input.costs.filter((row) => row.kind === 'percent').reduce((total, row) => total.plus(Math.max(0, row.amount || 0)), money(0)).div(100)
  const taxMultiplier = input.priceIncludesGst ? money(1).plus(money(Math.max(0, input.gstRate || 0)).div(100)) : money(1)
  const grossRevenueNeeded = fixedCosts.div(money(1).div(taxMultiplier).minus(percentageCosts).minus(target.div(taxMultiplier)))
  return round(grossRevenueNeeded.div(quantity))
}

export function calculateOutcomeProfit(outcomes: ReturnOutcome[]): OutcomeProfit {
  const probabilityTotal = outcomes.reduce((total, outcome) => total.plus(Math.max(0, outcome.probability || 0)), money(0))
  const byOutcome = outcomes.map((outcome) => {
    const profit = money(outcome.revenue).minus(outcome.refund).minus(outcome.forwardShipping).minus(outcome.reverseShipping).minus(outcome.damagedInventory).minus(outcome.paymentProcessing).minus(outcome.otherCosts || 0)
    return { ...outcome, profit: round(profit), weightedProfit: round(profit.mul(Math.max(0, outcome.probability || 0)).div(100)) }
  })
  return { probabilityTotal: round(probabilityTotal), valid: probabilityTotal.eq(100), expectedProfit: round(byOutcome.reduce((total, outcome) => total.plus(outcome.weightedProfit), money(0))), byOutcome }
}

export const formatINR = (value: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(Number.isFinite(value) ? value : 0)
