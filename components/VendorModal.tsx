"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { assetVendorClient } from "@/clients/AssetVendorClient";
import { FormColorInputItem } from "@/components/input/color";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import VendorStyleDrawingPreview from "@/components/VendorStyleDrawingPreview";
import { hexToRgb, rgbToHex } from "@/lib/utils";
import { AssetVendor, ID } from "@/types/domain";

const safeImageUrl = z.union([
  z.literal(""),
  z
    .string()
    .url("Must be a valid URL")
    .refine(
      (url) => url.startsWith("https://") || url.startsWith("http://"),
      "Only http:// and https:// URLs are allowed",
    ),
]);

const hexColorField = z.union([
  z.literal(""),
  z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color (e.g. #FF5733)"),
]);

const vendorSchema = z.object({
  name: z.string().min(1, "Name is required"),
  blobFirst: hexColorField,
  blobSecond: hexColorField,
  blobThird: hexColorField,
  bgFirst: hexColorField,
  bgSecond: hexColorField,
  bgThird: hexColorField,
  imageUrl: safeImageUrl,
  description: z.string().optional(),
});

type FormValues = z.infer<typeof vendorSchema>;

const DEFAULT_THEME = {
  blobs: {
    first: "rgb(83, 52, 131)",
    second: "rgb(233, 69, 96)",
    third: "rgb(15, 52, 96)",
  },
  background: {
    first: "rgb(26, 26, 46)",
    second: "rgb(22, 33, 62)",
    third: "rgb(15, 52, 96)",
  },
};

const THEME_PRESETS = [
  {
    name: "Pink–Turquoise",
    blobFirst: "#a8edea",
    blobSecond: "#f9c6d0",
    blobThird: "#c3cfe2",
    bgFirst: "#d4f1f4",
    bgSecond: "#f9c6d0",
    bgThird: "#c3cfe2",
  },
  {
    name: "Blue–Purple",
    blobFirst: "#667eea",
    blobSecond: "#b06ab3",
    blobThird: "#8ec5fc",
    bgFirst: "#667eea",
    bgSecond: "#764ba2",
    bgThird: "#8ec5fc",
  },
  {
    name: "Orange–Gold",
    blobFirst: "#b56e10",
    blobSecond: "#c49a00",
    blobThird: "#b36d20",
    bgFirst: "#3d2800",
    bgSecond: "#5c3d00",
    bgThird: "#7a5200",
  },
  {
    name: "Green",
    blobFirst: "#0d7368",
    blobSecond: "#1a7a4a",
    blobThird: "#2a8a6a",
    bgFirst: "#0a2e26",
    bgSecond: "#0f4035",
    bgThird: "#145244",
  },
  {
    name: "Dark",
    blobFirst: "#533483",
    blobSecond: "#e94560",
    blobThird: "#0f3460",
    bgFirst: "#1a1a2e",
    bgSecond: "#16213e",
    bgThird: "#0f3460",
  },
  {
    name: "Warm",
    blobFirst: "#b34848",
    blobSecond: "#b38f3d",
    blobThird: "#b370aa",
    bgFirst: "#3d1a1a",
    bgSecond: "#4d2d10",
    bgThird: "#3d1a35",
  },
  {
    name: "Ocean",
    blobFirst: "#0077b6",
    blobSecond: "#00b4d8",
    blobThird: "#90e0ef",
    bgFirst: "#03045e",
    bgSecond: "#023e8a",
    bgThird: "#0077b6",
  },
  {
    name: "Berry",
    blobFirst: "#c9184a",
    blobSecond: "#ff758f",
    blobThird: "#590d22",
    bgFirst: "#2b0a1a",
    bgSecond: "#590d22",
    bgThird: "#800f2f",
  },
  {
    name: "Mint",
    blobFirst: "#b7e4c7",
    blobSecond: "#52b788",
    blobThird: "#d8f3dc",
    bgFirst: "#1b4332",
    bgSecond: "#2d6a4f",
    bgThird: "#40916c",
  },
  {
    name: "Lavender",
    blobFirst: "#b8c0ff",
    blobSecond: "#e7c6ff",
    blobThird: "#bbd0ff",
    bgFirst: "#2b2d42",
    bgSecond: "#3a3d5c",
    bgThird: "#515480",
  },
  {
    name: "Ember",
    blobFirst: "#f48c06",
    blobSecond: "#e85d04",
    blobThird: "#faa307",
    bgFirst: "#370617",
    bgSecond: "#6a040f",
    bgThird: "#9d0208",
  },
];

type Props = {
  vendor: AssetVendor | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (vendor: AssetVendor) => void;
  onDelete?: (id: ID) => void;
};

export default function VendorModal({
  vendor,
  open,
  onOpenChange,
  onSuccess,
  onDelete,
}: Props) {
  const isEdit = !!vendor?.id;
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(vendorSchema),
    defaultValues: {
      name: "",
      blobFirst: "",
      blobSecond: "",
      blobThird: "",
      bgFirst: "",
      bgSecond: "",
      bgThird: "",
      imageUrl: "",
      description: "",
    },
  });

  const imageUrl = form.watch("imageUrl");
  const vendorName = form.watch("name");
  const blobFirst = form.watch("blobFirst");
  const blobSecond = form.watch("blobSecond");
  const blobThird = form.watch("blobThird");
  const bgFirst = form.watch("bgFirst");
  const bgSecond = form.watch("bgSecond");
  const bgThird = form.watch("bgThird");

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = form;

  useEffect(() => {
    if (!open) return;

    if (vendor) {
      const theme = vendor.style?.theme;
      reset({
        name: vendor.name,
        blobFirst: theme?.blobs?.first ? rgbToHex(theme.blobs.first) : "",
        blobSecond: theme?.blobs?.second ? rgbToHex(theme.blobs.second) : "",
        blobThird: theme?.blobs?.third ? rgbToHex(theme.blobs.third) : "",
        bgFirst: theme?.background?.first
          ? rgbToHex(theme.background.first)
          : "",
        bgSecond: theme?.background?.second
          ? rgbToHex(theme.background.second)
          : "",
        bgThird: theme?.background?.third
          ? rgbToHex(theme.background.third)
          : "",
        imageUrl: vendor.style?.image ?? "",
        description: vendor.description ?? "",
      });
    } else {
      reset({
        name: "",
        blobFirst: "",
        blobSecond: "",
        blobThird: "",
        bgFirst: "",
        bgSecond: "",
        bgThird: "",
        imageUrl: "",
        description: "",
      });
    }
  }, [vendor, open, reset]);

  const onFormSubmit = async (data: FormValues) => {
    try {
      const hasThemeValue = [
        data.blobFirst,
        data.blobSecond,
        data.blobThird,
        data.bgFirst,
        data.bgSecond,
        data.bgThird,
      ].some(Boolean);

      const theme = hasThemeValue
        ? {
            blobs: {
              first: data.blobFirst
                ? hexToRgb(data.blobFirst)
                : DEFAULT_THEME.blobs.first,
              second: data.blobSecond
                ? hexToRgb(data.blobSecond)
                : DEFAULT_THEME.blobs.second,
              third: data.blobThird
                ? hexToRgb(data.blobThird)
                : DEFAULT_THEME.blobs.third,
            },
            background: {
              first: data.bgFirst
                ? hexToRgb(data.bgFirst)
                : DEFAULT_THEME.background.first,
              second: data.bgSecond
                ? hexToRgb(data.bgSecond)
                : DEFAULT_THEME.background.second,
              third: data.bgThird
                ? hexToRgb(data.bgThird)
                : DEFAULT_THEME.background.third,
            },
          }
        : null;

      const payload = {
        name: data.name,
        style: {
          image: data.imageUrl || null,
          theme,
        },
        description: data.description,
      };

      let result: AssetVendor;

      if (vendor?.id) {
        result = await assetVendorClient.update(String(vendor.id), payload);
      } else {
        result = await assetVendorClient.create(payload);
      }

      onSuccess?.(result);
      await router.refresh();
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onDeleteVendor = async () => {
    try {
      if (!vendor?.id) return;
      setIsDeleting(true);
      await assetVendorClient.delete(String(vendor.id));
      onDelete?.(vendor.id);
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
        <DialogContent className="sm:w-fit sm:max-w-fit">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Update" : "Create"} vendor</DialogTitle>
            <DialogDescription>
              {isEdit
                ? "Modify the vendor details below."
                : "Fill in the details to create a new vendor."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
              <FormInputItem
                control={form.control}
                name="name"
                label="Name"
                placeholder="Vendor name"
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <div className="flex gap-3 items-center">
                        <Input
                          placeholder="https://example.com/logo.png"
                          {...field}
                        />
                        {imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={imageUrl}
                            alt="Vendor preview"
                            className="size-9 rounded object-contain border border-input shrink-0 bg-white"
                            onError={(e) =>
                              (e.currentTarget.style.display = "none")
                            }
                            onLoad={(e) =>
                              (e.currentTarget.style.display = "block")
                            }
                          />
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Theme presets</FormLabel>
                <div className="flex gap-2 flex-wrap">
                  {THEME_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      title={preset.name}
                      className="size-8 rounded-full border-2 border-transparent hover:scale-110 transition-transform shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${preset.bgFirst}, ${preset.bgSecond}, ${preset.bgThird})`,
                      }}
                      onClick={() => {
                        form.setValue("blobFirst", preset.blobFirst);
                        form.setValue("blobSecond", preset.blobSecond);
                        form.setValue("blobThird", preset.blobThird);
                        form.setValue("bgFirst", preset.bgFirst);
                        form.setValue("bgSecond", preset.bgSecond);
                        form.setValue("bgThird", preset.bgThird);
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-8 flex-wrap sm:flex-nowrap items-start">
                <div className="flex flex-col gap-5 sm:w-fit">
                  <div className="space-y-3">
                    <FormLabel>Blob colors</FormLabel>
                    <div className="flex flex-col gap-3">
                      <FormColorInputItem
                        control={form.control}
                        name="blobFirst"
                        label="Blob 1"
                        placeholder="#533483"
                        pickerDefault="#533483"
                        pickerLabel="Blob 1 color picker"
                      />
                      <FormColorInputItem
                        control={form.control}
                        name="blobSecond"
                        label="Blob 2"
                        placeholder="#E94560"
                        pickerDefault="#E94560"
                        pickerLabel="Blob 2 color picker"
                      />
                      <FormColorInputItem
                        control={form.control}
                        name="blobThird"
                        label="Blob 3"
                        placeholder="#0F3460"
                        pickerDefault="#0F3460"
                        pickerLabel="Blob 3 color picker"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <FormLabel>Background colors</FormLabel>
                    <div className="flex flex-col gap-3">
                      <FormColorInputItem
                        control={form.control}
                        name="bgFirst"
                        label="Background 1"
                        placeholder="#1A1A2E"
                        pickerDefault="#1A1A2E"
                        pickerLabel="Background 1 color picker"
                      />
                      <FormColorInputItem
                        control={form.control}
                        name="bgSecond"
                        label="Background 2"
                        placeholder="#16213E"
                        pickerDefault="#16213E"
                        pickerLabel="Background 2 color picker"
                      />
                      <FormColorInputItem
                        control={form.control}
                        name="bgThird"
                        label="Background 3"
                        placeholder="#0F3460"
                        pickerDefault="#0F3460"
                        pickerLabel="Background 3 color picker"
                      />
                    </div>
                  </div>
                </div>

                <VendorStyleDrawingPreview
                  vendorName={vendorName}
                  blobFirst={blobFirst}
                  blobSecond={blobSecond}
                  blobThird={blobThird}
                  bgFirst={bgFirst}
                  bgSecond={bgSecond}
                  bgThird={bgThird}
                />
              </div>

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
        title="Delete vendor?"
        description="This action cannot be undone. The vendor will be permanently deleted."
        onConfirm={onDeleteVendor}
      />
    </>
  );
}
