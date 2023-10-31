"use client";
import * as zod from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { userSchema } from "@/lib/validators/user";
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
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadThing";
import { UpdateUser } from "@/lib/actions/user.action";
import path from "path";
import { usePathname, useRouter } from "next/navigation";

type AccountProfileProps = {
  user:{
    id:string,
    objectId:string,
    username:string,
    firstname:string,
    lastname:string,
    imageurl:string,
    bio:string
  }
  btnTitle:string
}

export type userForm = zod.infer<typeof userSchema>;
export const AccountProfile = ({ user, btnTitle }: AccountProfileProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const {startUpload} = useUploadThing("media");
  const router = useRouter();
  const pathName = usePathname();
  const form = useForm({
    resolver: zodResolver( userSchema),
    defaultValues: {
      imageurl: user?.imageurl ? user.imageurl : "",
      firstname: user?.firstname ? user.firstname : "",
      lastname: user?.lastname ? user.lastname : "",
      username: user?.username ? user.username : "",
      bio: user?.bio ? user.bio : "",
    },
  });
  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    event.preventDefault();
    const fileReader = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFiles(Array.from(event.target.files));
      if (!file.type.includes("image")) return;
      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: zod.infer<typeof userSchema>) => {
    const blob = values.imageurl;
    const hasImageChanged = isBase64Image(blob);
     
    if (hasImageChanged) {
      const imageResult = await startUpload(files)
      if (imageResult && imageResult[0].url) {
        values.imageurl = imageResult[0].url;
      }
    }
    const { imageurl, firstname, lastname, username, bio}= values
   await UpdateUser({
    imageurl,
    firstname,
    lastname,
    username,
    bio,
    userId:user.id,
    path:pathName
  }
   );
   if(pathName === "/profile/edit"){
    router.back();
   }else{
    router.push("/")
   }
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="imageurl"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {field.value ? (
                  <Image
                    src={field.value}
                    alt="profile"
                    width={100}
                    height={100}
                    priority
                    className="rounded-full object-contain"
                  />
                ) : (
                  <Image
                    src="/profile.svg"
                    alt="profile"
                    width={25}
                    height={25}
                    className="object-contain"
                  />
                )}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-subtitle-secondary">
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Upload a profile image"
                  className="account-form_image-input"
                  onChange={(event) => handleImageChange(event, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="firstname"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full  gap-3">
              <FormLabel className="text-base-semibold text-subtitle-secondary">
                First Name
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastname"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full  gap-3">
              <FormLabel className="text-base-semibold text-subtitle-secondary">
                Last Name
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full  gap-3">
              <FormLabel className="text-base-semibold text-subtitle-secondary">
                user Name
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full  gap-3">
              <FormLabel className="text-base-semibold text-subtitle-secondary">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea
                  rows={12}
                  className="account-form_input no-focus"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button className="submit-btn" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  );
};
