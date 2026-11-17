import type { CostRow } from '../engine/profit'
export type Product = { id: string; name: string; sku: string; category: string; variant: string; mrp: number; sellingPrice: number; manufacturingCost: number; gstRate: number; notes?: string; costs?: CostRow[]; createdAt?: string; updatedAt?: string }
export type Scenario = { id: string; name: string; input: { sellingPrice: number; discount: number; manufacturingCost: number; shipping: number; paymentFee: number; quantity: number; cpa: number }; updatedAt?: string }
export type AppSection = 'Dashboard' | 'Quick Profit Calculator' | 'Offer Builder' | 'Bundle Calculator' | 'Ads & Break-even' | 'Scenario Simulator' | 'Scenario Comparison' | 'Product Library' | 'Reports' | 'Settings'
