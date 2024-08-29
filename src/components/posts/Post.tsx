"use client";

import { Comments, Likes, PostData } from "@/lib/types";
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
import { getComments, getIsLiked, getLikes } from "./actions";
import { useSubmitLikeMutation } from "./editor/mutation";
import CommentContainer from "./Comments";

interface PostProps {
  post: PostData;
}

const Post = ({ post }: PostProps) => {
  const { user } = useSession();
  const [totalLike, setTotalLike] = useState<number | null>(null);
  const [isLiked, setIsLiked] = useState<boolean | null>(false);
  const [comments, setComments] = useState<Comments[]>([]);

  const mutation = useSubmitLikeMutation();

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const likeCount = await getLikes(post.id);
        const liked = await getIsLiked(post.id);
        const comments_data = await getComments(post.id);
        setComments(comments_data);
        setIsLiked(liked);
        setTotalLike(likeCount);

        console.log(likeCount);
      } catch (error) {
        console.error("Failed to fetch likes: ", error);
      }
    };

    fetchLikes();
  }, []);

  async function likeSubmit() {
    mutation.mutate(
      { isLiked: !isLiked, postId: post.id },
      {
        onSuccess: (data) => {
          setIsLiked(!isLiked);

          let newTotal: number;
          if (!isLiked) {
            newTotal = (totalLike || 0) + 1;
          } else {
            newTotal = (totalLike || 0) - 1;
          }

          setTotalLike(newTotal);
        },
      },
    );
  }

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
          <ThumbsUp
            size={15}
            className={`bold ${isLiked == true ? "text-purple-600" : ""} cursor-pointer transition-all hover:opacity-50`}
            onClick={likeSubmit}
          />
          {totalLike ? (
            <span className="text-sm">
              {totalLike} {totalLike === 1 ? "Like" : "Likes"}
            </span>
          ) : (
            <span className="text-sm">be the first to like this post!</span>
          )}
        </div>

        <div className="flex items-center gap-1 text-sm">
          <MessageCircle size={15} />0
        </div>
      </div>
      {comments.map((data) => (
        <div key={data.id}>
          <CommentContainer
            avatarUrl={user?.avatarUrl || ""}
            postId={data.postId}
            text={data.text}
            userId={data.userId}
          />
        </div>
      ))}
      {/* <div className="flex gap-2 rounded-xl p-2">
        <div className="flex">
          <UserAvatar avatarUrl={user.avatarUrl} size={36} />
        </div>
        <div className="flex-col">
          <div className="flex items-center gap-2">
            <div className="text-sm font-medium">Mark Zuckebrog</div>
            <div className="text-xs text-slate-400">2min ago</div>
          </div>
          <p>Bjirr sedap kali</p>
        </div>
      </div> */}

      <CommentEditor postId={post.id} />
    </article>
  );
};

export default Post;
