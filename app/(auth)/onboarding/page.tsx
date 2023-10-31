import { AccountProfile } from "@/components/forms/AccountProfile"
import { fetchUser } from "@/lib/actions/user.action"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"


async function Page() {
    const user  = await currentUser()
    if(!user) return null
    const userInfo = await fetchUser(user.id)
    if(userInfo?.onboarded) redirect("/")
    
    const userData = {
         id: user?.id,
         objectId:userInfo?._id,
         username: userInfo ? userInfo?.username : user.username,
         firstname: userInfo ? userInfo?.firstname : user.firstName ?? "",
         lastname: userInfo ? userInfo?.lastname : user.lastName ?? "",
         
         
         imageurl: userInfo ? userInfo?.imageurl : user.imageUrl ?? "",
         bio: userInfo ? userInfo?.bio : "",
        
        }


        
    return (
        <main className="mx-auto flex max-w-3xl flex-col
        justify-start px-10 py-20">
        <h1 className="head-text">Welcome</h1>
        <p className="text-subtitle mt-3 text-base-regular">
         Complete your profile to use The Threader
        </p>
        <section className=" bg-slate-heavy mt-10 p-10">
          <AccountProfile
             user={userData}
             btnTitle="Complete Profile"
           />
        </section>
        </main>
    )
}

export default Page