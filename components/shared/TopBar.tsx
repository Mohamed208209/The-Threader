import { OrganizationSwitcher, SignOutButton, SignedIn } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import {shadesOfPurple} from "@clerk/themes";

export const TopBar = () => {
  return (
    <nav className="topbar">
     <Link href="/" className="flex items-center gap-4">
      <Image src="/logo.svg" alt="logo" width={40} height={40} />
      <p className="text-heading3-bold text-subtitle max-xs:hidden">
        The Threader
        </p>
     </Link>
     <div className="flex text-subtitle items-center gap-1">
       <div className="block md:hidden">
        <SignedIn>
          <SignOutButton>
         <div className="flex cursor-pointer">
          <Image className="text-subtitle" src="/logout-2.svg" alt="logout"
           width={25} height={25} />
         </div>
         </SignOutButton>
        </SignedIn>
       </div>
       <OrganizationSwitcher 
         appearance={{
          baseTheme: shadesOfPurple,
          elements: {
            organizationSwitcherTrigger:"py-2.5 px-4 text-subtitle-secondary"
          }
         }}
        />
     </div>
    </nav>
  )
}
