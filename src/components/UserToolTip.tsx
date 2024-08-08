"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import { followerInfo, UserData } from "@/lib/types";
import { PropsWithChildren } from "react";
import { TooltipProvider } from "./ui/tooltip";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import Link from "next/link";
import UserAvatar from "./UserAvatar";
import FollowButton from "./FollowButton";
import Linkify from "./Linkify";
import FollowerCount from "./FollowerCount";

interface UserToolTipProps extends PropsWithChildren {
  user: UserData;
}

const UserToolTip = ({ children, user }: UserToolTipProps) => {
  const { user: loggedInUser } = useSession();

  const followerState: followerInfo = {
    followers: user._count.followers,
    isFollowedByUser: !!user.followers.some(
      ({ followerId }) => followerId === loggedInUser.id,
    ),
  };
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <div className="flex max-w-80 flex-col gap-3 break-words rounded-sm bg-white p-4 shadow-lg md:min-w-52">
            <div className="flex items-center justify-between gap-2">
              <Link href={`/users/${user.username}`}>
                <UserAvatar size={70} avatarUrl={user.avatarUrl} />
              </Link>
              {loggedInUser.id !== user.id && (
                <FollowButton userId={user.id} initialState={followerState} />
              )}
            </div>
            <div>
              <Link href={`/users/${user.username}`}>
                <div className="text-lg font-semibold hover:underline">
                  {user.displayName}
                </div>
                <div className="text-muted-foreground">@{user.username}</div>
                {user.bio && (
                  <Linkify>
                    <div className="line-clamp-4 whitespace-pre-line">
                      {user.bio}
                    </div>
                  </Linkify>
                )}
                <FollowerCount userId={user.id} initialState={followerState} />
              </Link>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UserToolTip;
