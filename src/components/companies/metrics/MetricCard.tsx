import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number | null;
  isEditing: boolean;
  isCurrency?: boolean;
  isPercentage?: boolean;
  suffix?: string;
  onChange: (value: string) => void;
}

export function MetricCard({
  title,
  value,
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
            <Input
              type="number"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder={`Enter ${title.toLowerCase()}`}
            />
          ) : (
            formatValue(value)
          )}
        </div>
      </CardContent>
    </Card>
  );
}