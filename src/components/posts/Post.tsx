"use client";

import { Likes, PostData } from "@/lib/types";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import UserAvatar from "../UserAvatar";
import { formatRelativeDate } from "@/lib/utils";
import { useSession } from "@/app/(main)/SessionProvider";
import PostMoreButton from "./PostMoreButton";
import Linkify from "../Linkify";
import UserToolTip from "../UserToolTip";
import { MessageCircle, ThumbsUp } from "lucide-react";
import CommentEditor from "./editor/CommentEditor";
import { getLikes } from "./actions";

interface PostProps {
  post: PostData;
}

const Post = ({ post }: PostProps) => {
  const { user } = useSession();
  const [totalLike, setTotalLike] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState<boolean | null>(true);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const likeCount = await getLikes(post.id);
        setTotalLike(likeCount);
      } catch (error) {
        console.error("Failed to fetch likes: ", error);
      }
    };

    fetchLikes();
  }, [post.id]);

  return (
    <article className="group/post space-y-3 rounded-3xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserToolTip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <UserAvatar avatarUrl={post.user.avatarUrl} />
            </Link>
          </UserToolTip>

          <div>
            <UserToolTip user={post.user}>
              <Link
                href={`/users/${post.user.username}`}
                className="block font-medium hover:underline"
              >
                {post.user.displayName}
              </Link>
            </UserToolTip>

            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {post.user.id === user.id && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity group-hover/post:opacity-100"
          />
        )}
      </div>
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>
      <div className="flex gap-4">
        <div className="flex items-center gap-1">
          <ThumbsUp size={15} className="bold text-purple-600" />
          {totalLike !== 0 ? (
            <span>
              {totalLike} {totalLike === 1 ? "Like" : "Likes"}
            </span>
          ) : (
            <span>be the first to like this post!</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <MessageCircle size={15} />
          105
        </div>
      </div>
      <CommentEditor />
    </article>
  );
};

export default Post;
