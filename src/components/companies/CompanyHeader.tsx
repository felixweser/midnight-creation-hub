import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Edit2, X } from "lucide-react";

interface CompanyHeaderProps {
  name: string;
  isEditing: boolean;
  editedName: string;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onNameChange: (value: string) => void;
}

export function CompanyHeader({
  name,
  isEditing,
  editedName,
  onEdit,
  onSave,
  onCancel,
  onNameChange,
}: CompanyHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-3xl font-bold">
        {isEditing ? (
          <Input
            value={editedName}
            onChange={(e) => onNameChange(e.target.value)}
            className="text-3xl font-bold h-12"
          />
        ) : (
          name
        )}
      </h1>
      <div className="flex gap-2">
        {isEditing ? (
          <>
            <Button onClick={onSave} variant="default" size="sm">
              <Check className="h-4 w-4 mr-1" /> Save
            </Button>
            <Button onClick={onCancel} variant="outline" size="sm">
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
          </>
        ) : (
          <Button onClick={onEdit} variant="outline" size="sm">
            <Edit2 className="h-4 w-4 mr-1" /> Edit
          </Button>
        )}
      </div>
    </div>
  );
}