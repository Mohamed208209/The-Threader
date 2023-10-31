"use client";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

type UserCardProps = {
  id: string;
  userName: string;
  imageUrl: string;
  type: "User";
}
export const UserCard = ({id, userName, imageUrl, type}: UserCardProps) => {
  const router = useRouter()
  return (
    <article className="user-card">
      <div className="user-card_avatar">
       <Image src={imageUrl} alt={userName} width={50} height={50} className="rounded-full" />
       <div className="flex-1 text-ellipsis">
        <h4 className="text-base-semibold text-subtitle">{userName}</h4>
       </div>
      </div>
      <Button className="user-card_btn" onClick={()=>router.push(`/profile/${id}`)}>
        View
      </Button>
    </article>
  )
}
