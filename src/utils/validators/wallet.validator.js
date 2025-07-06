const z = require("zod/v4");

exports.increase = (data) => {
  const schema = z.object({
    amount: z.number(),
  });

  return schema.safeParse(data);
};
