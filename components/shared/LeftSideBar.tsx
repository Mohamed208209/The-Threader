"use client";
import { sidebarLinks } from "@/constants";
import { SignOutButton, SignedIn, useAuth } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export const LeftSideBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const {userId} = useAuth();
  return (
    <section className="leftsidebar custom-scrollbar">
      <div className="flex w-full flex-1 flex-col gap-6 px-6">

        {sidebarLinks.map((link) => {
            const isActive = (pathname.includes(link.route)
             && link.route.length > 1) || pathname === link.route;
             if (link.route === "/profile") link.route = `${link.route}/${userId}`;
          return (
            <Link
              href={link.route}
              key={link.route}
              className={`leftsidebar_link ${isActive ? "bg-link" : ""}`}
            >
              <Image src={link.icon} alt={link.label} width={25} height={25} />
              <p className="text-subtitle max-lg:hidden">{link.label}</p>
            </Link>
          );})}
      </div>
      <div className="mt-10 px-6">
      <SignedIn>
          <SignOutButton signOutCallback={() => {
            router.push("/sign-in");
          }}>
         <div className="flex cursor-pointer gap-4 p-4">
          <Image  src="/logout-2.svg" alt="logout"
           width={25} height={25} />
           <p className="text-subtitle max-lg:hidden">Logout</p>
         </div>
         </SignOutButton>
        </SignedIn>
      </div>
    </section>
  );
};
