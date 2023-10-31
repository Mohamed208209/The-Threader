"use client";
import { sidebarLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";


export const BottomBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <section className="bottombar">
      <div className="bottombar_container">
      {sidebarLinks.map((link) => {
            const isActive = (pathname.includes(link.route)
             && link.route.length > 1) || pathname === link.route;
          return (
            <Link
              href={link.route}
              key={link.route}
              className={`bottombar_link ${isActive ? "bg-link" : ""}`}
            >
              <Image src={link.icon} alt={link.label} width={25} height={25} />
              <p className="text-subtitle text-subtle-medium max-sm:hidden">
                {link.label.split(" ")[0]}
                </p>
            </Link>
          );})}
      </div>
    </section>
  )
}
