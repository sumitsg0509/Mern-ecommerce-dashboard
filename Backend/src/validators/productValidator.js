const { z } = require("zod");

// Accepts numbers and numeric strings, but rejects empty/null values instead of
// silently coercing them to 0 (which plain `z.coerce.number()` would do).
const price = z
  .union([z.string(), z.number()], { error: "Price is required" })
  .transform((value, ctx) => {
    const normalized = typeof value === "string" ? value.trim() : value;

    if (normalized === "") {
      ctx.addIssue({ code: "custom", message: "Price is required" });
      return z.NEVER;
    }

    const numeric =
      typeof normalized === "string" ? Number(normalized) : normalized;

    if (!Number.isFinite(numeric)) {
      ctx.addIssue({ code: "custom", message: "Price must be a number" });
      return z.NEVER;
    }

    if (numeric < 0) {
      ctx.addIssue({ code: "custom", message: "Price cannot be negative" });
      return z.NEVER;
    }

    return numeric;
  });

const productSchema = z.object({
  name: z
    .string({ error: "Product name is required" })
    .trim()
    .min(1, "Product name is required")
    .max(120, "Product name cannot exceed 120 characters"),
  price,
  brand: z
    .string({ error: "Brand is required" })
    .trim()
    .min(1, "Brand is required"),
  category: z
    .string({ error: "Category is required" })
    .trim()
    .min(1, "Category is required"),
});

module.exports = { productSchema };
