import { UserCard } from "@/components/cards/UserCard"
import { ProfileHeader } from "@/components/shared/ProfileHeader"
import { ThreadsTab } from "@/components/shared/ThreadsTab"
import { profileTabs } from "@/constants"
import { fetchSearchedUsers, fetchUser } from "@/lib/actions/user.action"
import { currentUser } from "@clerk/nextjs"
import Image from "next/image"
import {redirect} from "next/navigation"
const page = async () => {
    const user = await currentUser()
    if(!user) return null;

    const userInfo = await fetchUser(user.id)
    if(!userInfo?.onboarded) redirect("/onboarding")
    const result = await fetchSearchedUsers({
      userId: user.id,
      searchString: "",
      pageNumber: 1,
      pageSize: 25,
  })
  return (
    <section>
      <h1 className="head-text mb-10">Search</h1>

      <div className="mt-14 flex flex-col gap-9">
        {
          result.users.length === 0 ? (
            <p className="no-result">No Users Found</p>
          ): (
            <>
            {result.users.map((user) => (
              <UserCard
               key={user.id}
               id={user.id}
               userName={user.username}
               imageUrl={user.imageurl}
               type="User"
                 />
            ))}
            </>
          )
        }
      </div>
    </section>
  )
}
export default page