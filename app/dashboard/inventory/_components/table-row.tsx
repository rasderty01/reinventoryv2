import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableCell, TableRow as UITableRow } from "@/components/ui/table";
import { Doc } from "@/convex/_generated/dataModel";
import { Check, MoreHorizontal, X } from "lucide-react";
import EditableCellComponent from "./editable-cell";

interface TableRowProps {
  item: Doc<"items">;
  isSelected: boolean;
  onSelect: () => void;
  editedItem: Doc<"items">;
  onEdit: (field: keyof Doc<"items">, value: string | number) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function TableRowComponent({
  item,
  isSelected,
  onSelect,
  editedItem,
  onEdit,
  onSave,
  onCancel,
}: TableRowProps) {
  const isEditing = isSelected && !!editedItem;

  return (
    <UITableRow className={isSelected ? "bg-muted/50" : ""}>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          aria-label={`Select ${item.name}`}
        />
      </TableCell>
      <TableCell>
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-10 h-10 object-cover rounded-md"
          />
        )}
      </TableCell>
      <TableCell className="font-medium">
        <EditableCellComponent
          value={editedItem?.name || item.name}
          isEditing={isEditing}
          onChange={(value) => onEdit("name", value)}
          fieldName="name"
        />
      </TableCell>
      <TableCell>
        <EditableCellComponent
          value={editedItem?.sku || item.sku}
          isEditing={isEditing}
          onChange={(value) => onEdit("sku", value)}
          fieldName="sku"
        />
      </TableCell>
      <TableCell>
        <EditableCellComponent
          value={editedItem?.barcode || item.barcode || ""}
          isEditing={isEditing}
          onChange={(value) => onEdit("barcode", value)}
          fieldName="barcode"
        />
      </TableCell>
      <TableCell>
        <span className="flex items-center gap-1">
          $
          <EditableCellComponent
            value={editedItem?.price || item.price}
            isEditing={isEditing}
            onChange={(value) => onEdit("price", Number(value))}
            fieldName="price"
          />
        </span>
      </TableCell>
      <TableCell>
        <span className="flex items-center gap-1">
          $
          <EditableCellComponent
            value={editedItem?.cost || item.cost}
            isEditing={isEditing}
            onChange={(value) => onEdit("cost", Number(value))}
            fieldName="cost"
          />
        </span>
      </TableCell>
      <TableCell>
        <EditableCellComponent
          value={editedItem?.quantity || item.quantity}
          isEditing={isEditing}
          onChange={(value) => onEdit("quantity", Number(value))}
          fieldName="quantity"
        />
      </TableCell>
      <TableCell>
        <EditableCellComponent
          value={editedItem?.status || item.status}
          isEditing={isEditing}
          onChange={(value) => onEdit("status", value)}
          fieldName="status"
        />
      </TableCell>
      <TableCell>
        <EditableCellComponent
          value={editedItem?.categoryId || item.categoryId}
          isEditing={isEditing}
          onChange={(value) => onEdit("categoryId", value)}
          fieldName="categoryId"
        />
      </TableCell>
      <TableCell>
        {isEditing ? (
          <div className="flex space-x-2">
            <Button size="sm" onClick={onSave}>
              <Check className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onSelect}>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </TableCell>
    </UITableRow>
  );
}
