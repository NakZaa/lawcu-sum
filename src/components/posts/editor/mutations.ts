import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import { submitPost } from './actions'
import { PostsPage } from '@/types/types'
import { toast } from 'sonner'
import { useCurrentUser } from '@/hooks/use-current-user'

export function useSubmitPostMutation() {
  const queryClient = useQueryClient()

  const user = useCurrentUser()

  const mutation = useMutation({
    mutationFn: submitPost,
    onSuccess: async newPost => {
      const queryFilter = {
        queryKey: ['post-feed'],
        predicate(query) {
          return (
            query.queryKey.includes('for-you') ||
            (query.queryKey.includes('user-posts') &&
              query.queryKey.includes(user?.id))
          )
        }
      } satisfies QueryFilters

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        oldData => {
          const firstPage = oldData?.pages[0]

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  posts: [newPost, ...firstPage.posts],
                  nextCursor: firstPage.nextCursor
                },
                ...oldData.pages.slice(1)
              ]
            } as InfiniteData<PostsPage, string | null>
          }
        }
      )

      queryClient.invalidateQueries({
        queryKey: queryFilter.queryKey,
        predicate(query) {
          return queryFilter.predicate(query) && !query.state.data
        }
      })

      toast.success('Posted successfully!', {
        duration: 2500
      })
    },
    onError(error) {
      console.error(error)
      toast.error('Failed to get posts.')
    }
  })

  return mutation
}
