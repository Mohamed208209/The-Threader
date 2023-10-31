import { ThreadCard } from "@/components/cards/ThreadCard";
import { fetchThreads } from "@/lib/actions/thread.action";
import Thread from "@/lib/models/thread.model";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Home() {
  const result = await fetchThreads();
  const user = await currentUser();

  if (!user) return redirect("/onboarding");

  return (
    <>
      <h1 className="head-text text-left">Home</h1>
      <section className="mt-10 flex flex-col gap-10">
        {result.threads.length === 0 ? (
          <p className="no-result">No Threads Yet</p>
        ) : (
          <>
            {result.threads.map((thread) => (
              <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={user?.id}
                parentId={thread.parentId}
                content={thread.text}
                author={thread.author}
                community={thread.community}
                createdAt={thread.createdAt}
                comments={thread.children}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
}
