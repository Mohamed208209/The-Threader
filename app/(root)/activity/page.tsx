import {  fetchActivities, fetchUser } from "@/lib/actions/user.action"
import { currentUser } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import {redirect} from "next/navigation"
const page = async () => {
    const user = await currentUser()
    if(!user) return null;

    const userInfo = await fetchUser(user.id)
    if(!userInfo?.onboarded) redirect("/onboarding")
    const activities = await fetchActivities(userInfo._id)
  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>
      <section className="mt-10 flex flex-col gap-5">
        {
          activities.length > 0 ? (
            
              activities.map((activity) => (
                <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                  <article className="activity-card">
                    <Image
                      src={activity.author.imageurl}
                      alt={activity.author.username}
                      width={20}
                      height={20}
                      className="rounded-full object-cover"
                      />
                      <p className="text-subtitle-secondary !text-small-regular">
                      <span className="text-heading4-medium text-subtitle">{activity.author.username}</span>   replied to your thread
                      </p>
                  </article>
                </Link>
              ))
            
          ): <p className="!text-base-regular text-subtitle-secondary">No Activities Yet</p>
        }
      </section>
    </section>
  )
}
export default page