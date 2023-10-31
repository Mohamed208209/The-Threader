import { ProfileHeader } from "@/components/shared/ProfileHeader"
import { ThreadsTab } from "@/components/shared/ThreadsTab"
import { Tabs, TabsList,TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { profileTabs } from "@/constants"
import { fetchUser } from "@/lib/actions/user.action"
import { currentUser } from "@clerk/nextjs"
import Image from "next/image"
import {redirect} from "next/navigation"
const page = async ({params}:{params:{id:string}}) => {
    const user = await currentUser()
    if(!user) return null;

    const userInfo = await fetchUser(params.id)
    if(!userInfo?.onboarded) redirect("/onboarding")
  return (
    <section>
     <ProfileHeader
       accountId={userInfo.id} 
       authUserId={user.id}
       userName={userInfo.username}
       imageUrl={userInfo.imageurl}
       bio={userInfo.bio}
     />

     <div className="mt-9">
      <Tabs defaultValue="threads" className="w-full">
       <TabsList className="tab">
        {
          profileTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="tab">
              <Image src={tab.icon} alt={tab.label} width={30} height={30} className="object-contain" />
              <p className="text-subtitle max-sm:hidden">{tab.label}</p>
              {tab.label === "Threads" && (
                <p className="ml-1 rounded-xl bg-dark-3 px-2 py-1 !text-tiny-medium text-[#22d3ee]">
                  {userInfo?.threads?.length}
                </p>
              ) }
            </TabsTrigger>
          ))
        }
       </TabsList>
       {profileTabs.map((tab) => (
         <TabsContent key={`content-${tab.value}`} value={tab.value} className="w-full text-white">
          <ThreadsTab currentUserId={user.id} accountId={userInfo.id} accountType="User" />
         </TabsContent>
       ))}
      </Tabs>
     </div>

    </section>
  )
}
export default page