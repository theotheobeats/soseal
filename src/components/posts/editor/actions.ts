"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { createPostSchema } from "@/lib/validation";
import { text } from "stream/consumers";

export async function submitPost(input: string) {
  const { user } = await validateRequest();

  if (!user) throw Error("Unauthorized");

  const { content } = createPostSchema.parse({ content: input });

  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
    include: getPostDataInclude(user.id),
  });

  return newPost;
}

export async function submitLike(isLiked: boolean, postId: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  if (isLiked) {
    const like = await prisma.like.create({
      data: { postId, userId: user.id },
    });
    return { success: true, like };
  } else {
    const like = await prisma.like.deleteMany({
      where: {
        postId,
        userId: user.id,
      },
    });
    return { success: true, like };
  }
}

export async function submitComment(text: string, postId: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const newComment = await prisma.comment.create({
    data: { postId, userId: user.id, text },
  });

  return newComment;
}
