import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { TopBar,BottomBar,LeftSideBar,RightSideBar } from "@/components/shared";
import "../globals.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title:"The Threader",
  description:"A Next.js project bootstrapped with create-next-app that's a clone of the famous Threads app." 
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
       <body className={inter.className}>
        <TopBar />
         <main className="flex flex-row">
          <LeftSideBar />
          <section className="main-container">
            <div className="w-full max-w-4xl">
              {children}
            </div>
          </section>
          <RightSideBar />
          </main>  
        <BottomBar /> 
       </body>  
      </html>
    </ClerkProvider>
  );
}
