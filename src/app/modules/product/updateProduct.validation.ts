import { z } from 'zod';

const updateProductSchema = z.object({
  body: z.object({
    price: z.number().positive().optional(),
    quantity: z.number().int().positive().optional(),
    inStock: z.boolean().optional(),
    name: z.string().min(1).optional(),
    brand: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    type: z.enum(['Mountain', 'Road', 'Hybrid', 'BMX', 'Electric']).optional(),
    Img: z.string().url().optional(),
    rating: z.number().min(1).max(5).optional(),
  }),
  params: z.object({
    id: z.string().min(24).max(24),
  }),
});

export default updateProductSchema;
