"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

export async function deletePost(id: string) {
  const { user } = await validateRequest();

  if (!user) throw new Error("Unauthorized");

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) throw new Error("Post not found");
  if (post.userId !== user.id) throw new Error("Unauthorized");

  const deletedPost = await prisma.post.delete({
    where: { id },
  });

  return deletedPost;
}

export async function getLikes(postId: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const like = await prisma.like.count({
    where: { postId },
  });

  return like;
}

export async function isLiked(id: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const like = await prisma.like.findUnique({
    where: { id, userId: user.id },
  });

  if (!like) {
    throw new Error("Post not found!");
  }
  
  return isLiked;
}
