const { z } = require("zod");

const email = z
  .string({ error: "Email is required" })
  .trim()
  .toLowerCase()
  .email("Please provide a valid email");

const password = z
  .string({ error: "Password is required" })
  .min(6, "Password must be at least 6 characters")
  .max(72, "Password cannot exceed 72 characters");

const registerSchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),
  email,
  password,
});

const loginSchema = z.object({
  email,
  password: z
    .string({ error: "Password is required" })
    .min(1, "Password is required"),
});

module.exports = { registerSchema, loginSchema };
