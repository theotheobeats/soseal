import { Prisma } from "@prisma/client";

export function getUserDataSelect(loggedInUserId: string): Prisma.UserSelect {
  return {
    id: true,
    username: true,
    displayName: true,
    avatarUrl: true,
    followers: {
      where: {
        followerId: loggedInUserId,
      },
      select: {
        followerId: true,
      },
    },
    _count: {
      select: {
        followers: true,
      },
    },
  } satisfies Prisma.UserSelect;
}

export function getPostDataInclude(loggedInUserId: string) {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
  } satisfies Prisma.PostInclude;
}

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}

export interface followerInfo {
  followers: number;
  isFollowedByUser: boolean;
}
