"use client";
import * as zod from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Textarea } from "@/components/ui/textarea";


import path from "path";
import { usePathname, useRouter } from "next/navigation";
// import { UpdateUser } from "@/lib/actions/user.action";
import { threadSchema } from "@/lib/validators/thread";
import { createThread } from "@/lib/actions/thread.action";
import { useOrganization } from "@clerk/nextjs";

type PostThreadProps = {
  userId:string;
};

export type userForm = zod.infer<typeof threadSchema>;

 




export const PostThread = ({userId:notParsedUserId}:PostThreadProps) => {
  const userId = JSON.parse(notParsedUserId);
  const router = useRouter();
  const {organization} = useOrganization();
  const pathName = usePathname();
  const form = useForm({
    resolver: zodResolver(threadSchema),
    defaultValues: {
     thread:"",
     accountId:userId
    },
  });

   const onSubmit =async (values:zod.infer<typeof threadSchema>) => {
    console.log( "look here",organization);
     await createThread({
      text:values.thread,
      author:userId,
      communityId:organization? organization.id : null,
      path:pathName
     });
     router.push("/");
   }

  return (
   <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}
     className="flex flex-col justify-start gap-10 mt-10">
     
     <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full  gap-3">
              <FormLabel className="text-base-semibold text-subtitle-secondary">
               Content
              </FormLabel>
              <FormControl 
                  className="no-focus border border-subtitle bg-dark-3 text-light-1"
                >
                <Textarea
                  rows={16}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      <Button type="submit" className="submit-btn">Post</Button>
    </form>
   </Form>
  )
}

