import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";

interface TableHeaderProps {
  sortState: {
    column: string | null;
    direction: "asc" | "desc" | null;
  };
  onSort: (column: string) => void;
  onSelectAll: () => void;
  allSelected: boolean;
}

export function TableHeaderComponent({
  sortState,
  onSort,
  onSelectAll,
  allSelected,
}: TableHeaderProps) {
  const renderSortIcon = (column: string) => {
    if (sortState.column !== column)
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    if (sortState.direction === "asc")
      return <ChevronUp className="ml-2 h-4 w-4" />;
    if (sortState.direction === "desc")
      return <ChevronDown className="ml-2 h-4 w-4" />;
    return <ArrowUpDown className="ml-2 h-4 w-4" />;
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[50px]">
          <Checkbox
            checked={allSelected}
            onCheckedChange={onSelectAll}
            aria-label="Select all items"
          />
        </TableHead>
        <TableHead className="w-[100px]">Image</TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("name")}
            className="font-bold"
          >
            Name {renderSortIcon("name")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("sku")}
            className="font-bold"
          >
            SKU {renderSortIcon("sku")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("barcode")}
            className="font-bold"
          >
            Barcode {renderSortIcon("barcode")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("price")}
            className="font-bold"
          >
            Price {renderSortIcon("price")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("cost")}
            className="font-bold"
          >
            Cost {renderSortIcon("cost")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("quantity")}
            className="font-bold"
          >
            Quantity {renderSortIcon("quantity")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("status")}
            className="font-bold"
          >
            Status {renderSortIcon("status")}
          </Button>
        </TableHead>
        <TableHead>
          <Button
            variant="ghost"
            onClick={() => onSort("category")}
            className="font-bold"
          >
            Category {renderSortIcon("category")}
          </Button>
        </TableHead>
        <TableHead className="w-[100px]">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
}
