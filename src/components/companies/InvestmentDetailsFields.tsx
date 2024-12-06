import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CompanyFormValues } from "./types";

interface InvestmentDetailsFieldsProps {
  form: UseFormReturn<CompanyFormValues>;
}

export function InvestmentDetailsFields({ form }: InvestmentDetailsFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Investment Details</h3>
      
      <FormField
        control={form.control}
        name="investmentDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Investment Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="investmentStage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Investment Stage</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select investment stage" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Seed">Seed</SelectItem>
                <SelectItem value="Series A">Series A</SelectItem>
                <SelectItem value="Series B">Series B</SelectItem>
                <SelectItem value="Series C">Series C</SelectItem>
                <SelectItem value="Late Stage">Late Stage</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="roundName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Round Name</FormLabel>
            <FormControl>
              <Input placeholder="e.g., Seed Round, Series A" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="amountInvested"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amount Invested ($)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Enter amount" 
                {...field}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="ownershipPercentage"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Ownership Percentage (%)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Enter percentage" 
                {...field}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="valuation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Valuation ($)</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                placeholder="Enter valuation" 
                {...field}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}