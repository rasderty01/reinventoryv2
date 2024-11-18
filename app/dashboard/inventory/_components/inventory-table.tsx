"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table, TableBody } from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { useOrganization } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ActionButtons } from "./actions";
import { Pagination } from "./pagination";
import { SearchBar } from "./search-bar";
import { TableHeaderComponent } from "./table-header";
import { TableRowComponent } from "./table-row";

type SortDirection = "asc" | "desc" | null;

interface SortState {
  column: string | null;
  direction: SortDirection;
}

export default function InventoryTable() {
  const { organization } = useOrganization();
  const inventoryData = useQuery(api.items.list, {
    orgId: organization?.id ?? "",
  });
  const updateItem = useMutation(api.items.update);
  const batchUpdateItems = useMutation(api.items.batchUpdate);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortState, setSortState] = useState<SortState>({
    column: null,
    direction: null,
  });
  const [selectedItems, setSelectedItems] = useState<Id<"items">[]>([]);
  const [editedItems, setEditedItems] = useState<{
    [key: Id<"items">]: Doc<"items">;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
    localStorage.setItem("editedItems", JSON.stringify(editedItems));
  }, [selectedItems, editedItems]);

  const filteredData =
    inventoryData?.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.barcode &&
          item.barcode.toLowerCase().includes(searchTerm.toLowerCase()))
    ) ?? [];

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortState.column === null || sortState.direction === null) return 0;
    const aValue = a[sortState.column as keyof Doc<"items">];
    const bValue = b[sortState.column as keyof Doc<"items">];
    if (aValue === undefined || bValue === undefined) return 0;
    if (aValue < bValue) return sortState.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortState.direction === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (column: string) => {
    setSortState((prevState) => ({
      column,
      direction:
        prevState.column === column
          ? prevState.direction === "asc"
            ? "desc"
            : prevState.direction === "desc"
              ? null
              : "asc"
          : "asc",
    }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleSelectAll = () => {
    if (selectedItems.length === paginatedData.length) {
      handleCancelAll();
    } else {
      const newSelectedItems = paginatedData.map((item) => item._id);
      setSelectedItems(newSelectedItems);
      const newEditedItems = paginatedData.reduce(
        (acc, item) => {
          acc[item._id] = { ...item };
          return acc;
        },
        {} as { [key: Id<"items">]: Doc<"items"> }
      );
      setEditedItems(newEditedItems);
    }
  };

  const handleSelectItem = (id: Id<"items">) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    if (!editedItems[id]) {
      const item = inventoryData?.find((item) => item._id === id);
      if (item) {
        setEditedItems((prev) => ({ ...prev, [id]: { ...item } }));
      }
    }
  };

  const handleSaveAll = async () => {
    if (!organization?.id) return;
    const itemsToUpdate = Object.entries(editedItems).map(([id, item]) => {
      const { _creationTime, _id, createdBy, orgId, updatedBy, ...updates } =
        item;
      return {
        id: id as Id<"items">,
        updates,
      };
    });
    toast.promise(
      batchUpdateItems({ items: itemsToUpdate, orgId: organization.id }),
      {
        loading: "Updating items...",
        success: () => {
          setEditedItems({});
          setSelectedItems([]);
          return "All items updated successfully";
        },
        error: "Failed to update items. Please try again.",
      }
    );
  };

  const handleCancelAll = () => {
    setEditedItems({});
    setSelectedItems([]);
    toast.info("All edits cancelled");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1);
  };

  const resetSort = () => {
    setSortState({ column: null, direction: null });
  };

  if (inventoryData === undefined) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!inventoryData || inventoryData.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>No Inventory Items</CardTitle>
          <CardDescription>Your inventory is currently empty.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => console.log("Add new item")}>
            <Plus className="mr-2 h-4 w-4" /> Add New Item
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center">
        <SearchBar searchTerm={searchTerm} onSearch={handleSearch} />
        <ActionButtons
          selectedCount={selectedItems.length}
          onSaveAll={handleSaveAll}
          onCancelAll={handleCancelAll}
          onAddNew={() => console.log("Add new item")}
          onResetSort={resetSort}
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeaderComponent
            sortState={sortState}
            onSort={handleSort}
            onSelectAll={handleSelectAll}
            allSelected={selectedItems.length === paginatedData.length}
          />
          <TableBody>
            {paginatedData.map((item) => (
              <TableRowComponent
                key={item._id}
                item={item}
                isSelected={selectedItems.includes(item._id)}
                onSelect={() => handleSelectItem(item._id)}
                editedItem={editedItems[item._id]}
                onEdit={(field, value) => {
                  setEditedItems((prev) => ({
                    ...prev,
                    [item._id]: { ...prev[item._id], [field]: value },
                  }));
                }}
                onSave={async () => {
                  const {
                    _creationTime,
                    createdBy,
                    _id,
                    orgId,
                    updatedBy,
                    ...updates
                  } = editedItems[item._id];
                  toast.promise(
                    updateItem({
                      id: item._id,
                      ...updates,
                    }),
                    {
                      loading: "Updating item...",
                      success: () => {
                        setEditedItems((prev) => {
                          const newState = { ...prev };
                          delete newState[item._id];
                          return newState;
                        });
                        setSelectedItems((prev) =>
                          prev.filter((id) => id !== item._id)
                        );
                        return "Item updated successfully";
                      },
                      error: "Failed to update item. Please try again.",
                    }
                  );
                }}
                onCancel={() => {
                  setEditedItems((prev) => {
                    const newState = { ...prev };
                    delete newState[item._id];
                    return newState;
                  });
                  setSelectedItems((prev) =>
                    prev.filter((id) => id !== item._id)
                  );
                  toast.info("Edit cancelled");
                }}
              />
            ))}
          </TableBody>
        </Table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
      />
    </div>
  );
}
