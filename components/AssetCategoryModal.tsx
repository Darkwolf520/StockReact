"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { assetCategoryClient } from "@/clients/AssetCategoryClient";
import { FormColorInputItem } from "@/components/input/color";
import { FormIconPickerItem } from "@/components/input/icon-picker";
import { FormInputItem } from "@/components/input/input";
import DeleteConfirmDialog from "@/components/modal/DeleteConfirmDialog";
import ModalActionFooter from "@/components/modal/ModalActionFooter";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Category, ID } from "@/types/domain";

const optionalHexColor = z.union([
  z.literal(""),
  z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color (e.g. #FF5733)"),
]);

const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  icon: z.string().optional(),
  color: optionalHexColor,
  description: z.string().optional(),
});

type FormValues = z.infer<typeof categorySchema>;

type Props = {
  category: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (category: Category) => void;
  onDelete?: (id: ID) => void;
};

export default function AssetCategoryModal({
  category,
  open,
  onOpenChange,
  onSuccess,
  onDelete,
}: Props) {
  const isEdit = !!category?.id;
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: "",
      icon: "",
      color: "",
      description: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (!open) return;

    if (category) {
      reset({
        name: category.name,
        icon: category.style?.icon ?? "",
        color: category.style?.color ?? "",
        description: category.description ?? "",
      });
    } else {
      reset({
        name: "",
        icon: "",
        color: "",
        description: "",
      });
    }
  }, [category, open, reset]);

  const onFormSubmit = async (data: FormValues) => {
    try {
      const style = {
        icon: data.icon || undefined,
        color: data.color || undefined,
      };

      const payload = {
        name: data.name,
        style: style.icon || style.color ? style : undefined,
        description: data.description,
      };

      let result: Category;

      if (category?.id) {
        result = await assetCategoryClient.update(String(category.id), payload);
      } else {
        result = await assetCategoryClient.create(payload);
      }

      onSuccess?.(result);
      await router.refresh();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onDeleteCategory = async () => {
    try {
      if (!category?.id) return;

      setIsDeleting(true);
      await assetCategoryClient.delete(String(category.id));
      onDelete?.(category.id);
      await router.refresh();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Update" : "Create"} category</DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Modify the category details below."
                : "Fill in the details to create a new category."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
              <FormInputItem
                control={form.control}
                name="name"
                label="Name"
                placeholder="Category name"
              />

              <FormIconPickerItem
                control={form.control}
                name="icon"
                label="Icon"
                accentColor={form.watch("color") || undefined}
              />

              <FormColorInputItem
                control={form.control}
                name="color"
                label="Color"
                placeholder="#000000"
                pickerDefault="#000000"
                pickerLabel="Background color picker"
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Optional description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <ModalActionFooter
                isEdit={isEdit}
                isSubmitting={isSubmitting}
                isDeleting={isDeleting}
                submitLabel={isEdit ? "Update" : "Create"}
                onCancel={() => onOpenChange(false)}
                onDelete={() => setIsDeleteConfirmOpen(true)}
              />
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <DeleteConfirmDialog
        open={isDeleteConfirmOpen}
        onOpenChange={setIsDeleteConfirmOpen}
        title="Delete category?"
        description="This action cannot be undone. The category will be permanently deleted."
        onConfirm={onDeleteCategory}
      />
    </>
  );
}
