"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useOrganization } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "convex/react";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
  description: z.string().optional(),
  parentCategoryId: z.string().optional(),
});

export default function AddCategoryPage() {
  const router = useRouter();
  const { organization } = useOrganization();
  const me = useQuery(api.users.getMe, {});
  const createCategory = useMutation(api.categories.createCategory);
  const updateCategory = useMutation(api.categories.updateCategory);
  const deleteCategory = useMutation(api.categories.deleteCategory);
  const categories = useQuery(api.categories.listCategories, {
    orgId: organization?.id ?? "",
  });

  const [editingCategory, setEditingCategory] =
    useState<Id<"categories"> | null>(null);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      parentCategoryId: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!organization?.id || !me?._id) {
      toast.error("Organization or user not found");
      return;
    }

    try {
      await createCategory({
        name: values.name,
        description: values.description,
        orgId: organization.id,
        parentCategoryId: values.parentCategoryId
          ? (values.parentCategoryId as any)
          : undefined,
        createdBy: me._id,
      });
      toast.success("Category added successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to add category");
      console.error(error);
    }
  }

  async function handleDelete(id: Id<"categories">) {
    try {
      await deleteCategory({ id });
      toast.success("Category deleted successfully");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete category");
      console.error(error);
    }
  }

  async function handleUpdate(
    id: Id<"categories">,
    name: string,
    description: string
  ) {
    try {
      await updateCategory({ id, name, description });
      toast.success("Category updated successfully");
      setEditingCategory(null);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update category");
      console.error(error);
    }
  }

  return (
    <section className="flex flex-col gap-8 items-center h-full justify-center w-full container mx-auto ">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-8 ">Add New Category</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-x-8 flex items-center w-full"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Category description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="parentCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parent Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select parent category (optional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-8">
              <Plus className="size-4" />
              Add Category
            </Button>
          </form>
        </Form>
      </div>

      <div className="w-full">
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Parent Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories?.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>
                    {editingCategory === category._id ? (
                      <Input
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                      />
                    ) : (
                      category.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingCategory === category._id ? (
                      <Input
                        value={editedDescription}
                        onChange={(e) => setEditedDescription(e.target.value)}
                      />
                    ) : (
                      category.description || "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    {category.parentCategoryId
                      ? categories.find(
                          (c) => c._id === category.parentCategoryId
                        )?.name || "Unknown"
                      : "None"}
                  </TableCell>
                  <TableCell>
                    {editingCategory === category._id ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            handleUpdate(
                              category._id,
                              editedName,
                              editedDescription
                            );
                          }}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingCategory(null)}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingCategory(category._id);
                            setEditedName(category.name);
                            setEditedDescription(category.description || "");
                          }}
                        >
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(category._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
