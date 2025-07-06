import z from "zod";

export const increase = (data: Object) => {
  const schema = z.object({
    amount: z.number(),
  });

  return schema.safeParse(data);
};
