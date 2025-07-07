import z from "zod";

export const login = (data: Object) => {
  const schema = z.object({
    identifier: z.union([z.string().email(), z.string().min(5).max(25)]),
    password: z.string().min(5).max(16),
    rememberMe: z.boolean(),
  });

  return schema.safeParse(data);
};

export const register = (data: object) => {
  const schema = z
    .object({
      username: z.string().min(5).max(25),
      firstName: z.string().min(3).max(25),
      lastName: z.string().min(3).max(25),
      email: z.string().email(),
      phone: z.string(),
      password: z.string().min(5).max(16),
      repeatPassword: z.string(),
    })
    .refine(
      (data) => {
        return data.password.toString() === data.repeatPassword.toString();
      },
      {
        message: "Password do not match",
        path: ["repeatPassword"],
      }
    );

  return schema.safeParse(data);
};
