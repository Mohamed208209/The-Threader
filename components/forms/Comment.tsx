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

import { Input } from "@/components/ui/input";


import path from "path";
import { usePathname, useRouter } from "next/navigation";
// import { UpdateUser } from "@/lib/actions/user.action";
import { commentSchema } from "@/lib/validators/thread";
import Image from "next/image";
import { commentOnThread } from "@/lib/actions/thread.action";
// import { createThread } from "@/lib/actions/thread.action";



type CommentProps = {
    threadId: string;
    currentUserId: string;
    currentUserImage: string;
}
export const Comment = ({threadId, currentUserId, currentUserImage}: CommentProps) => {

    const router = useRouter();
    const pathName = usePathname();
    const form = useForm({
      resolver: zodResolver(commentSchema),
      defaultValues: {
       thread:""
      },
    });
  
     const onSubmit =async (values:zod.infer<typeof commentSchema>) => {
       await commentOnThread(threadId,JSON.parse(currentUserId), values.thread, pathName);
       form.reset();
     }

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)}
     className="comment-form">
     
     <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex items-center w-full  gap-3">
              <FormLabel >
               <Image src={currentUserImage}
                      alt="Profile image"
                      width={48}
                      height={48}
                      className="rounded-full object-cover"
                  />
              </FormLabel>
              <FormControl 
                  className="no-focus border border-subtitle bg-dark-3 text-white"
                >
                <Input
                 type="text"
                 placeholder="Enter your comment"
                 className="no-focus text-white outline-none"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      <Button type="submit" className="comment-form_btn">Reply</Button>
    </form>
   </Form>
  )
}
