const z = require("zod/v4");

exports.login = (data) => {
  const z = require("zod");

  const schema = z.object({
    identifier: z.union([z.string().email(), z.string().min(5).max(25)]),
    password: z.string().min(5).max(16),
    rememberMe: z.boolean(),
  });

  return schema.safeParse(data);
};

exports.register = (data) => {
  const schema = z
    .object({
      username: z.string().min(5).max(25),
      firstName: z.string().min(3).max(25),
      lastName: z.string().min(3).max(25),
      email: z.string().email(),
      phone: z.string(),
      isReserved: z.boolean(),
      password: z.string().min(5).max(16),
      repeatPassword: z.string(),
    })
    .refine((data) => data.password === data.repeatPassword, {
      message: "Password do not match",
      path: ["repeatPassword"],
    });

  return schema.safeParse(data);
};
