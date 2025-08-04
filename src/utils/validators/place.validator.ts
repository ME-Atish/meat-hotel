import z from "zod";

export const create = (data: Object) => {
  const schema = z.object({
    name: z.string().min(2).max(100),
    address: z.string().min(8).max(100),
    description: z.string().min(8).max(200),
    facilities: z.string().max(50),
    price: z
      .string()
      .transform((val) => Number(val))
      .refine((val) => !isNaN(val), { message: "Price must be a number" }),
    isReserved: z
      .string()
      .transform((val) => Number(val))
      .refine((val) => val === 0 || val === 1, {
        message: "Is reserved must be a 0 or 1",
      })
      .optional(),
    province: z.string().min(2).max(20),
  });

  return schema.safeParse(data);
};
