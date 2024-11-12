import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import submitComment, { deleteComment } from './actions'
import { CommentsPage } from '@/types/types'
import { toast } from 'sonner'

export function useSubmitCommentMutation(postId: string) {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: submitComment,
    onSuccess: async newComment => {
      const queryKey: QueryKey = ['comments', postId]

      await queryClient.cancelQueries({ queryKey })

      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        oldData => {
          const firstPage = oldData?.pages[0]

          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  previousCursor: firstPage.previousCursor,
                  comments: [...firstPage.comments, newComment]
                },
                ...oldData.pages.slice(1)
              ]
            } as InfiniteData<CommentsPage, string | null>
          }
        }
      )

      queryClient.invalidateQueries({
        queryKey,
        predicate(query) {
          return !query.state.data
        }
      })

      toast.success('Commented created')
    },
    onError(error) {
      console.error(error)
      toast.error('Failed to submit comments.')
    }
  })

  return mutation
}

export function useDeleteCommentMutation() {
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async deletedComment => {
      if ('error' in deletedComment) return

      const queryKey: QueryKey = ['comments', deletedComment.postId]

      await queryClient.cancelQueries({ queryKey })

      queryClient.setQueryData<InfiniteData<CommentsPage, string | null>>(
        queryKey,
        oldData => {
          if (!oldData || 'error' in deletedComment) return

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map(page => ({
              previousCursor: page.previousCursor,
              comments: page.comments.filter(c => c.id !== deletedComment.id)
            }))
          }
        }
      )

      toast.info('Comment deleted')
    },
    onError(error) {
      console.error(error)
      toast.error('Failed to delete comment. Please try again.')
    }
  })

  return mutation
}
