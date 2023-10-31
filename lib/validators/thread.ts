import * as zod from "zod";

export const threadSchema = zod.object({
  thread:zod.string().min(3, {
      message: "threads must be at least 3 characters",
  }),
  accountId :zod.string()
});


export const commentSchema = zod.object({
    thread:zod.string().min(3, {
        message: "threads must be at least 3 characters",
    })

  });
  
