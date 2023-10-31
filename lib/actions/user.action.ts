"use server";

import mongoose, { FilterQuery, SortOrder } from "mongoose";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import Community from "../models/community.model";
type UpdateUserProps = {
  userId: string;
  username: string;
  firstname: string;
  lastname: string;
  bio: string | undefined;
  imageurl: string;
  path: string;
};

export const UpdateUser = async (user: UpdateUserProps) => {
  const { userId ,username, firstname, lastname, bio, imageurl, path } = user;
  connectToDB();
 try{
  await User.findOneAndUpdate(
    { id:userId },

    {
      username: username.toLowerCase(),
      firstname,
      lastname,
      bio,
      imageurl,
      
      onboarded: true,
    },
    { upsert: true }
  );
  if (path === "/profile/edit"){
    revalidatePath(path)
  }
 }catch(error:any){
  throw new Error(`Error updating user: ${error.message}`);
 }
};

export const fetchUser = async(userId: string) => {
try{
  connectToDB();
  return await User.findOne({ id: userId})
  .populate({
    path:"communities",
    model:Community
  })
}catch(error:any){
  throw new Error(`Error fetching user: ${error.message}`);
}
}

export const fetchUserThreads = async(userId: string) => {
  try {
    connectToDB();
    const threads = await User.findOne({ id: userId })
    .populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path:"community",
          model: Community,
          select: "_id id name imageUrl"
        },
        { path:"children",
        model: Thread,
        populate: {
          path: "author",
          model: User,
          select: " id username imageurl"
        }}
       
      ]
    });
    return threads
  } catch (error: any) {
    throw new Error(`Error fetching user threads: ${error.message}`);
  }
}


type fetchSearchedUsersProps = {
  userId: string;
  searchString?:string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder 
}

export const fetchSearchedUsers = async ({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc"}: fetchSearchedUsersProps ) => {


  try {
    connectToDB();
    const skip = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");
    const query : FilterQuery<typeof User> = { id: { $ne: userId }};
    if (searchString.trim() !== "") {
      query.$or = [
        { username: {$regex: regex} },
        { firstname:{$regex: regex} },
        { lastname: {$regex: regex} },
      ];
    }
    const sortOptions = {createdAt: sortBy};
    const usersQuery =  User.find(query)
                 .sort(sortOptions)
                 .skip(skip)
                 .limit(pageSize)
    
    const totalUsersCount = await User.countDocuments(query);
    const users = await usersQuery.exec();
    const isNextPageAvailable = totalUsersCount > skip + users.length;
    return {
      users,
      isNextPageAvailable
    }
                        

  } catch (error: any) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
}


export const fetchActivities = async(userId: string) => {
  try {
    connectToDB();
    const userThreads = await Thread.find({author:userId});
    const childThreadsIds = userThreads.reduce((acc, userThread) => {
      return acc.concat(userThread.children);
    },[])
    const replies = await Thread.find({_id:{$in:childThreadsIds}, author:{$ne:userId}})
                           .populate({
                             path:"author",
                             model:User,
                             select:"_id username imageurl"
                           })
    return replies
  }catch(error:any){
    throw new Error(`Error fetching activity: ${error.message}`);
  }
}