import { Json } from './common'

export type CompanyMetadata = {
  team_size?: number | null
  performance?: string | null
  description?: string | null
  metrics?: Record<string, any> | null
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