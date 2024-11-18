import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditableCellProps {
  value: string | number;
  isEditing: boolean;
  onChange: (value: string | number) => void;
  fieldName: string;
}

const EditableCellComponent = ({
  value,
  isEditing,
  onChange,
  fieldName,
}: EditableCellProps) => {
  if (!isEditing) {
    if (fieldName === "status") {
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold
          ${
            value === "in_stock"
              ? "bg-green-100 text-green-800"
              : value === "low_stock"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {value === "in_stock"
            ? "In Stock"
            : value === "low_stock"
              ? "Low Stock"
              : "Out of Stock"}
        </span>
      );
    }
    return <span>{value}</span>;
  }

  if (fieldName === "status") {
    return (
      <Select
        value={value.toString()}
        onValueChange={(value) => onChange(value)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="in_stock">In Stock</SelectItem>
          <SelectItem value="low_stock">Low Stock</SelectItem>
          <SelectItem value="out_of_stock">Out of Stock</SelectItem>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full"
    />
  );
};

export default EditableCellComponent;
