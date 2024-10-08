"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";

// TODO: VALIDATE THE USER VIA FRONT END ONCE, JUST THROW THE USER.ID IN HERE

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
  const like = await prisma.like.count({
    where: { postId },
  });

  return like;
}

export async function getIsLiked(postId: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const like = await prisma.like.findFirst({
    where: { postId, userId: user.id },
  });

  if (!like) {
    return false;
  }

  return true;
}

export async function getComments(postId: string) {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const posts = await prisma.comment.findMany({
    where: { postId },
  });

  return posts;
}

export async function getUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user;
}
