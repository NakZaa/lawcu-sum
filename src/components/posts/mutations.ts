import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import { usePathname, useRouter } from 'next/navigation'
import { deletePost } from './actions'
import { toast } from 'sonner'
import { PostsPage } from '@/types/types'

export function useDeletePostMutation() {
  const queryClient = useQueryClient()

  const router = useRouter()
  const pathname = usePathname()

  const mutation = useMutation({
    mutationFn: deletePost,
    onSuccess: async deletedPost => {
      const queryFilter: QueryFilters = { queryKey: ['post-feed'] }

      await queryClient.cancelQueries(queryFilter)

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilter,
        oldData => {
          if (!oldData || 'error' in deletedPost) return

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map(page => ({
              nextCursor: page.nextCursor,
              posts: page.posts.filter(p => p.id !== deletedPost.id)
            }))
          }
        }
      )

      toast.info('Post deleted successfully.')

      if (!('error' in deletedPost) && pathname === `/posts/${deletedPost.id}`) {
        router.push(`/users/${deletedPost.user.username}`)
      }
    },
    onError(error) {
      console.error(error)
      toast.error('Failed to delete post. Please try again.')
    }
  })

  return mutation
}
