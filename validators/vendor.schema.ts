import { z } from "zod";

const optionalImageUrl = z.union([
  z.literal(""),
  z.null(),
  z
    .string()
    .url("Must be a valid URL")
    .refine(
      (url) => url.startsWith("https://") || url.startsWith("http://"),
      "Only http:// and https:// URLs are allowed",
    ),
]);

const rgbColorSchema = z
  .string()
  .regex(
    /^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/,
    "Must be a valid rgb color (e.g. rgb(83, 52, 131))",
  );

const themeColorsSchema = z.object({
  first: rgbColorSchema,
  second: rgbColorSchema,
  third: rgbColorSchema,
});

const themeSchema = z.object({
  blobs: themeColorsSchema,
  background: themeColorsSchema,
});

export const createVendorSchema = z.object({
  name: z.string().min(1, "Vendor name is required"),
  style: z
    .object({
      image: optionalImageUrl.optional(),
      theme: themeSchema.optional().nullable(),
    })
    .optional()
    .transform((style) => {
      if (!style) return undefined;

      return {
        image: style.image || null,
        theme: style.theme || null,
      };
    }),
  description: z.string().optional(),
});

export const updateVendorSchema = createVendorSchema.partial();

export type CreateVendorInput = z.infer<typeof createVendorSchema>;
export type UpdateVendorInput = z.infer<typeof updateVendorSchema>;
