import { z } from "zod";

const optionalHexColor = z.union([
  z.literal(""),
  z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color format"),
]);

export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  style: z
    .object({
      icon: z.string().optional(),
      color: optionalHexColor.optional(),
    })
    .optional()
    .transform((style) => {
      if (!style) return undefined;

      const nextStyle = {
        icon: style.icon || undefined,
        color: style.color || undefined,
      };

      if (!nextStyle.icon && !nextStyle.color) {
        return undefined;
      }

      return nextStyle;
    }),
  description: z.string().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
