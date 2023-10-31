import { ThreadCard } from "@/components/cards/ThreadCard"
import { Comment } from "@/components/forms/Comment"
import { fetchOneThread } from "@/lib/actions/thread.action"
import { fetchUser } from "@/lib/actions/user.action"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"

export  const page = async ({params}:{params:{id:string}}) => {
    if(!params.id) return null
    const user = await currentUser()
     if (!user) return null
     const userInfo = await fetchUser(user.id)
     if (!userInfo?.onboarded) return redirect("/onboarding")
     const thread = await fetchOneThread(params.id)
    
  return (
    <section className="relative">
     <div>
     <ThreadCard
        key={thread._id}
        id={thread._id}
        currentUserId={user.id || ""}
        parentId={thread.parentId}
        content={thread.text}
        author={thread.author}
        community={thread.community}
        createdAt={thread.createdAt}
        comments={thread.children}
        />
     </div>

     <div className="mt-7">
      <Comment
       threadId={thread.id}
       currentUserId={JSON.stringify(userInfo._id)}
       currentUserImage={userInfo.imageurl}
       />
     </div>
     <div className="mt-10">
       {
        thread.children.map((threadChild:any) => (
          <ThreadCard
           key={threadChild._id}
           id={threadChild._id}
           currentUserId={user.id }
           parentId={threadChild.parentId}
           content={threadChild.text}
           community={threadChild.community}
           author={threadChild.author}
           createdAt={threadChild.createdAt}
           comments={threadChild.children}
           isComment
           />
        ))
       }
     </div>
    </section>
  )
}
export default page