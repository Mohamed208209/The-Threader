import { formatDateString } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

type ThreadCardProps = {
    id: string,

    currentUserId:string,

    parentId:string | null,

    content:string,

    author:{
      id:string,
      imageurl:string,
      username:string,
    },

    community:{
        id:string,
        communityname:string,
        imageurl:string} | null,

    createdAt:string,

    comments:{
      author:{
          imageurl:string
      }
    }[],
    isComment?:boolean
}
export const ThreadCard = ({
    id,
    currentUserId,
    parentId,
    content,
    author,
    community,
    createdAt,
    comments,
    isComment

}:ThreadCardProps )=> {
  return (
    <article className={`flex w-full flex-col rounded-xl 
                        ${isComment ?"px-0 xs:px-7 mb-10" : "bg-thread"}`}>
        <div className="flex items-start justify-between">
         <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
           <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
            <Image src={author.imageurl}
             alt={author.username}
             fill
             className="cursor-pointer rounded-full"/>
           </Link>
           <div className="thread-card_bar" />
          </div>
          <div className="flex flex-col w-full">
          <Link href={`/profile/${author.id}`} className="w-fit">
           <h4 className="cursor-pointer text-base-semibold text-subtitle">
            {author.username}
           </h4>
          </Link>
          <p className="mt-2 text-small-regular text-light-2">
            {content}
          </p>
          <div className={`${isComment ? "mb-4" : ""} mt-4 flex flex-col gap-3`}>
           <div className="flex gap-3.5">
            <Image src="/heart.svg"   alt="heart" width={40} height={40} className="cursor-pointer object-contain"/>
            <Link href={`thread/${id}`} >
             <Image src="/comment.svg" alt="reply" width={38} height={38} 
             className="cursor-pointer object-contain "/>
            </Link>
            <Image src="/repost.svg" alt="repost" width={40} height={40} className="cursor-pointer object-contain"/>
            <Image src="/share.svg" alt="share"   width={40} height={40} className="cursor-pointer object-contain"/>
            </div>
            {isComment && comments.length > 0 && (
              <Link href={`/threads/${id}`}>
               <p className="mt-2 text-subtle-medium text-gray-1">{comments.length} replies</p>
              </Link>
            )}
          </div>
          </div>
         </div>
         {/* TODO: DeleteThread */}
         {/* TODO: Show comment Logos */}
         {!isComment && community && (
           <Link href={`/community/${community.id}`} className="mt-4 flex items-center">
            <p className="text-subtitle text-subtle-medium">
              {formatDateString(createdAt)} - {community.communityname}
            </p>
            <Image
             src={community.imageurl}
             alt={community.communityname}
             width={14}
             height={14}
             className="ml-1 rounded-full object-cover"
             />
           </Link>
         )}
        </div>
     
    </article>
  )
}
