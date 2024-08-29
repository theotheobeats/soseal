import { useToast } from "@/components/ui/use-toast";
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { submitComment, submitLike, submitPost } from "./actions";
import { PostsPage } from "@/lib/types";
import { useSession } from "@/app/(main)/SessionProvider";

export function useSubmitPostMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { user } = useSession();

  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: async (newPost) => {
      const queryFilter = {
        queryKey: ["post-feed", "for-you"],
        predicate(query) {
          return (
            query.queryKey.includes("for-you") ||
            (query.queryKey.includes("user-posts") &&
              query.queryKey.includes(user.id))
          );
        },
      } satisfies QueryFilters;

      await queryClient.cancelQueries(queryFilter);

      // complex practice but way faster
      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        (oldData) => {
          const firstPage = oldData?.pages[0];

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  posts: [newPost, ...firstPage.posts],
                  nextCursor: firstPage.nextCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data;
        },
      });

      // its a simple practice but slower:
      //   queryClient.invalidateQueries(queryFilter);

      toast({
        description: "Post created!",
      });
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to post. Please try again.",
      });
    },
  });

  return mutation;
}

export function useSubmitLikeMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient();

  const { user } = useSession();

  const mutation = useMutation({
    mutationFn: (variables: { isLiked: boolean; postId: string }) =>
      submitLike(variables.isLiked, variables.postId),
    onSuccess: async () => {
      const queryFilter = {
        queryKey: ["post-feed", "for-you"],
        predicate(query) {
          return (
            query.queryKey.includes("for-you") ||
            (query.queryKey.includes("user-posts") &&
              query.queryKey.includes(user.id))
          );
        },
      } satisfies QueryFilters;

      await queryClient.cancelQueries(queryFilter);

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data;
        },
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to like the post. Please try again.",
      });
    },
  });

  return mutation;
}

export function useSubmitCommentMutation() {
  const { toast } = useToast();

  const queryClient = useQueryClient();
  const { user } = useSession();
  const mutation = useMutation({
    mutationFn: (variables: { text: string; postId: string }) =>
      submitComment(variables.text, variables.postId),
    onSuccess: async (newPost) => {
      const queryFilter = {
        queryKey: ["post-feed", "for-you"],
        predicate(query) {
          return (
            query.queryKey.includes("for-you") ||
            (query.queryKey.includes("user-posts") &&
              query.queryKey.includes(user.id))
          );
        },
      } satisfies QueryFilters;

      await queryClient.cancelQueries(queryFilter);

      queryClient.invalidateQueries(queryFilter);
    },
    onError(error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to like the post. Please try again later.",
      });
    },
  });

  return mutation;
}
