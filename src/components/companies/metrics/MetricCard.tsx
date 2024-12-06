import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number | null;
  editedValue?: number | null;
  isEditing: boolean;
  isCurrency?: boolean;
  isPercentage?: boolean;
  suffix?: string;
  onChange: (value: string) => void;
}

export function MetricCard({
  title,
  value,
  editedValue,
  isEditing,
  isCurrency = false,
  isPercentage = false,
  suffix = '',
  onChange,
}: MetricCardProps) {
  const formatValue = (val: number | null): string => {
    if (val === null) return "N/A";
    if (isCurrency) return formatCurrency(val);
    if (isPercentage) return `${val.toLocaleString()}%`;
    return val.toLocaleString() + suffix;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {isEditing ? (
            <div className="space-y-2">
              <Input
                type="number"
                value={editedValue ?? ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={`Enter ${title.toLowerCase()}`}
              />
              <div className="text-sm text-muted-foreground">
                Current: {formatValue(value)}
              </div>
            </div>
          ) : (
            formatValue(value)
          )}
        </div>
      </CardContent>
    </Card>
  );
}