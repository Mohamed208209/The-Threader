import Image from "next/image"
import Link from "next/link"
import { currentUser } from "@clerk/nextjs"
import { fetchUser } from "@/lib/actions/user.action";
export const TopBar = async () => {
   const user = await currentUser();
   if(!user) return null;
   const userInfo = await fetchUser(user?.id);
  return (
    <nav className="topbar">
     <Link href="/" className="flex items-center gap-4">
      <Image src="/logo.svg" alt="logo" width={40} height={40} />
      <p className="text-heading3-bold text-subtitle max-xs:hidden">
        The Threader
        </p>
     </Link>
     <div className="flex text-subtitle gap-1">
       <div className="flex items-center p-2  border rounded-full  border-subtitle ">
        <Image src={`${userInfo.imageurl}`}
         alt="search"
         width={40}
         height={40}
         className="rounded-full mr-2" 
            />
        {userInfo.username}
       </div>
     
     </div>
    </nav>
  )
}
