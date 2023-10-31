import { ClerkProvider } from "@clerk/nextjs"
import { Inter } from "next/font/google"
import "../globals.css"
export const metadata = {
    title:"The Threader",
    description:"A Next.js project bootstrapped with create-next-app that's a clone of the famous Threads app." 
    }

const inter = Inter({ subsets: ["latin"] }) 


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={`${inter.className} bg-slate-light`}>
       <div className="w-full flex justify-center items-center min-h-screen">
        {children}
        </div>
      </body>
    </html>
    </ClerkProvider>
  )
}