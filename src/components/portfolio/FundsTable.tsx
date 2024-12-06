import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpRight } from "lucide-react";

interface Fund {
  fund_id: string;
  name: string;
  vintage_year: number;
  fund_size: number;
  status: string;
}

interface FundsTableProps {
  funds: Fund[];
  isLoading: boolean;
}

export function FundsTable({ funds, isLoading }: FundsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Funds</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fund Name</TableHead>
                <TableHead>Vintage Year</TableHead>
                <TableHead>Fund Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {funds.map((fund) => (
                <TableRow key={fund.fund_id}>
                  <TableCell className="font-medium">{fund.name}</TableCell>
                  <TableCell>{fund.vintage_year}</TableCell>
                  <TableCell>${fund.fund_size?.toLocaleString()}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ring-green-600/20 bg-green-50/10 text-green-400">
                      {fund.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <a
                      href={`/dashboard/funds/${fund.fund_id}`}
                      className="inline-flex items-center text-primary hover:text-primary/80"
                    >
                      View Details
                      <ArrowUpRight className="ml-1 h-4 w-4" />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}