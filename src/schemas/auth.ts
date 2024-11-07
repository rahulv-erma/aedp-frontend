import { z } from "zod";

export const signupSchema = z
  .object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(1),
    confirmPassword: z.string(),
  })
  .refine((data: any) => data.confirmPassword === data.password, {
    path: ["confirmPassword"],
  });

export type SignupSchemaType = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
