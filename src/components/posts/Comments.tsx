import React, { useEffect, useState } from "react";
import UserAvatar from "../UserAvatar";
import { getUser } from "./actions";
import { User } from "@prisma/client";


interface CommentProps {
  avatarUrl: string;
  postId: string;
  text: string;
  userId: string;
}

const CommentContainer = ({ avatarUrl, text, userId }: CommentProps) => {
  const [user, setUser] = useState<User | null>(null); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUser(userId);
        setUser(userData);
      } catch (error) {
        console.error("Failed to fetch user: ", error);
      }
    };

    fetchUser();
  }, []); 

  return (
    <div className="flex gap-2 rounded-xl p-2">
      <div className="flex">
        <UserAvatar avatarUrl={avatarUrl} size={36} />
      </div>
      <div className="flex-col">
        <div className="flex items-center gap-2">
          <div className="text-sm font-medium">
            {user?.displayName || "Loading..."}
          </div>
          <div className="text-xs text-slate-400">2min ago</div>
        </div>
        <p>{text}</p>
      </div>
    </div>
  );
};

export default CommentContainer;
