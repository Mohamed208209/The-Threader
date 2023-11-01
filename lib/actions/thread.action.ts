"use server"
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";
import Community from "../models/community.model";

type Params = {
    text: string;
    author:string;
    communityId: string | null;
    path:string
}
export const createThread = async (params: Params) => {
    const { text, author, communityId, path } = params;

    try{
        connectToDB();
        const communityIdObject = await Community.findOne(
            {id:communityId},
            {_id:1}
        )
        const createdThread = await Thread.create({
            text,
            author,
            community:communityId
        });
        if (communityIdObject){
            await Community.findByIdAndUpdate(communityIdObject,{
                $push:{threads:createdThread._id}
            })
        }
    
      await User.findByIdAndUpdate(author,{
        $push:{threads:createdThread._id}
      })
      revalidatePath(path);
    }catch(error:any){
        throw new Error(`Error creating thread: ${error.message}`);
    }
 

}

export const fetchThreads = async (pageNumber=1, pageSize=20) => {
    const skip = (pageNumber - 1) * pageSize;
    try{
        connectToDB();
        const threadsQuery =  Thread.find({parentId:{$in:[null, undefined]}})
        .sort({createdAt:"desc"})
        .skip(skip)
        .limit(pageSize)
        .populate({path:"author", model:User})
        .populate({path:"community",model:Community})
        .populate({
            path:"children",
            populate:{
                path:"author",
                model:User,
                select:"_id username parentId imageurl"
            }});
           
  
            const totalThreadsCount = await Thread.countDocuments({parentId:{$in:[null, undefined]}});
            const threads = await threadsQuery.exec();
       
        
        const isNextPageAvailable = totalThreadsCount > skip + threads.length;
        return {
            threads,
            isNextPageAvailable
        }
    }catch(error:any){
        throw new Error(`Error fetching threads: ${error.message}`);
    }
}

export const fetchOneThread = async (id:string) => {
    try{
        connectToDB();
        const thread = await Thread.findById(id)
        .populate({path:"author", model:User, select:"_id id username  imageurl"})
        .populate({path:"community",model:Community, select:"_id id name imageUrl"})
        .populate({
            path:"children",
            populate:[
                {
                    path:"author",
                    model:User,
                    select:"_id id username parentId imageurl"
                },
                {
                    path:"children",
                    model:Thread,
                    populate:{
                        path:"author",
                        model:User,
                        select:"_id id username parentId imageurl"
                    }
                    
                }
            ]
        }).exec();
        return thread;
    }catch(error:any){
        throw new Error(`Error fetching thread: ${error.message}`);
    }
}

export const commentOnThread = async (threadId:string,userId:string ,commentText:string, path:string) => {
    try{
        connectToDB();
        const originalThread = await Thread.findById(threadId);
        if(!originalThread) throw new Error("Thread not found");
        const comment = new Thread({
            text:commentText,
            author:userId,
            parentId:threadId  
        })
        const savedComment = await comment.save();
        await originalThread.updateOne({$push:{children:savedComment._id}});
        revalidatePath(path);
    }catch(error:any){
        throw new Error(`Error commenting on thread: ${error.message}`);
    }
}


export const fetchAllChildThreads = async (threadId:string): Promise<any[]> => {
    const childThreads = await Thread.find({parentId:threadId});
    const descendantThreads = []
    for (const childThread of childThreads) {
        const descendants = await fetchAllChildThreads(childThread._id);
        descendantThreads.push(childThread, ...descendants);
    }
    return descendantThreads
}




export const deleteThread= async (id: string, path: string): Promise<void> => {
  try {
    connectToDB();

    const mainThread = await Thread.findById(id).populate("author community");

    if (!mainThread) {
      throw new Error("Thread not found");
    }

    const descendantThreads = await fetchAllChildThreads(id);

   
    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id),
    ];

 
    const uniqueAuthorIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString()), 
        mainThread.author?._id?.toString(),
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set(
      [
        ...descendantThreads.map((thread) => thread.community?._id?.toString()),
      ].filter((id) => id !== undefined)
    );

    // Recursively delete child threads and their descendants
    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}
