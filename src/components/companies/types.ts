import * as z from "zod";

export const companyFormSchema = z.object({
  // Company Details
  name: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
  foundingDate: z.string().min(1, "Founding date is required"),
  description: z.string().optional(),
  hqLocation: z.string().min(1, "HQ location is required"),
  
  // Investment Details
  investmentDate: z.string().min(1, "Investment date is required"),
  investmentStage: z.string().min(1, "Investment stage is required"),
  roundName: z.string().min(1, "Round name is required"),
  amountInvested: z.number().min(1, "Amount invested must be greater than 0").or(z.string().transform(val => (val ? parseFloat(val) : 0))),
  ownershipPercentage: z.number().min(0, "Ownership percentage must be positive").max(100, "Ownership percentage cannot exceed 100").or(z.string().transform(val => (val ? parseFloat(val) : 0))),
  valuation: z.number().min(1, "Valuation must be greater than 0").or(z.string().transform(val => (val ? parseFloat(val) : 0))),
});

export type CompanyFormValues = z.infer<typeof companyFormSchema>;