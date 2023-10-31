import * as zod from "zod";

export const userSchema = zod.object({
  imageurl: zod.string().url(),
  firstname: zod
    .string()
    .min(3, {
      message: "First name must be at least 3 characters",
    })
    .max(28, {
      message: "Firstname must be at most 28 characters",
    }),

  lastname: zod
    .string()
    .min(3, {
      message: "last name must be at least 3 characters",
    })
    .max(28, {
      message: "last name must be at most 28 characters",
    }),

  username: zod
    .string()
    .min(3, {
      message: "user name must be at least 3 characters",
    })
    .max(28, {
      message: "user name must be at most 28 characters",
    }),

  bio: zod
    .string()
    .max(1000, {
      message: "Bio must be at most 1000 characters",
    })
    .optional(),
});
