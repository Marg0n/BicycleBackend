import { z } from 'zod';

const updateProductSchema = z.object({
  body: z.object({
    price: z.number().positive().optional(),
    quantity: z.number().int().positive().optional(),
    inStock: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().min(24).max(24),
  }),
});

export default updateProductSchema;
