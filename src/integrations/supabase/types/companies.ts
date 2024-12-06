import { Json } from './common'

export type CompanyMetadata = {
  team_size?: number | null
  performance?: string | null
  description?: string | null
  metrics?: Record<string, any> | null
  runway_months?: number | null
}

export type PortfolioCompany = {
  company_id: string
  created_at: string
  founding_date: string | null
  industry: string | null
  metadata: CompanyMetadata | null
  name: string
  status: string | null
  updated_at: string
}

export type PortfolioCompanyInsert = Omit<PortfolioCompany, 'company_id' | 'created_at' | 'updated_at'> & {
  company_id?: string
  created_at?: string
  updated_at?: string
}

export type PortfolioCompanyUpdate = Partial<PortfolioCompanyInsert>

export type CompanyMetricsHistory = {
  id: string
  company_id: string
  metric_date: string
  post_money_valuation: number | null
  shares_owned: number | null
  arr: number | null
  mrr: number | null
  burn_rate: number | null
  runway_months: number | null
  created_at: string
  updated_at: string
}

export type InvestorUpdate = {
  id: string
  company_id: string
  title: string
  content: string | null
  attachment_path: string | null
  created_at: string
  updated_at: string
}