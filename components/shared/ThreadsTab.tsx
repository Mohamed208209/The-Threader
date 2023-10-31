import { fetchUserThreads } from "@/lib/actions/user.action";
import { redirect } from "next/navigation";
import { ThreadCard } from "../cards/ThreadCard";

type ThreadsTabProps = {
  currentUserId: string;
  accountId: string;
  accountType: string;
}
export const ThreadsTab = async ({currentUserId, accountId, accountType}:ThreadsTabProps) => {
  let result = await fetchUserThreads(accountId)
  if (!result) redirect("/");
  return (
    <section className="mt-10 flex flex-col gap-10">
      {
        result.threads.map((thread:any) => (
          <ThreadCard
            key={thread._id}
            id={thread._id}
            currentUserId={currentUserId}
            parentId={thread.parentId}
            content={thread.text}
            author={
              accountType === "User"
                ? {username:result.username, imageurl:result.imageurl, id:result.id}
                : {username:thread.author.username, imageurl:thread.author.imageurl, id:thread.author.id}
            }
            community={thread.community}
            createdAt={thread.createdAt}
            comments={thread.children}
          />
        ))
      }
    </section>
  )
}
