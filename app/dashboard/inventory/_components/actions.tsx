import { Button } from "@/components/ui/button";
import { Plus, RotateCcw, Save, X } from "lucide-react";

interface ActionButtonsProps {
  selectedCount: number;
  onSaveAll: () => void;
  onCancelAll: () => void;
  onAddNew: () => void;
  onResetSort: () => void;
}

export function ActionButtons({
  selectedCount,
  onSaveAll,
  onCancelAll,
  onAddNew,
  onResetSort,
}: ActionButtonsProps) {
  return (
    <div className="space-x-2">
      {selectedCount > 0 && (
        <>
          <Button onClick={onSaveAll}>
            <Save className="mr-2 h-4 w-4" />
            Save All ({selectedCount})
          </Button>
          <Button variant="outline" onClick={onCancelAll}>
            <X className="mr-2 h-4 w-4" />
            Cancel All
          </Button>
        </>
      )}
      <Button onClick={onAddNew}>
        <Plus className="mr-2 h-4 w-4" /> Add New Item
      </Button>
      <Button variant="outline" onClick={onResetSort}>
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset Sort
      </Button>
    </div>
  );
}
