import Image from "next/image";

type ProfileHeaderProps = {
    accountId: string;
    authUserId: string;
    userName: string;
    imageUrl: string;
    bio: string;
}
export const ProfileHeader = ({accountId, authUserId, userName, imageUrl, bio}: ProfileHeaderProps) => {
  return (
    <div className="flex w-full flex-col justify-start">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
         <div className="relative h-20 w-20 object-cover">
          <Image src={imageUrl} alt={userName} fill className="rounded-full object-cover shadow-2xl" />   
         </div>

         <div className="flex-1">
          <h2 className="text-left text-heading3-bold text-subtitle">&nbsp;{userName}</h2>
         </div>
        </div>
      </div>

        {/* TODO: Community */}
        <p className="mt-6 max-w-lg text-base-regular text-subtitle-secondary">{bio}</p>
        <div className="mt-12 h-0.5 w-full bg-slate-600 "/>
    </div>
  )
}
