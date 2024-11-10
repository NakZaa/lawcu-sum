import { useUploadThing } from '@/lib/uploadthing'
import { updateUserProfileSchema, updateUserProfileValues } from '@/schemas'
import {
  InfiniteData,
  QueryFilters,
  useMutation,
  useQueryClient
} from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { UpdateUserProfile } from './action'
import { PostsPage } from '@/types/types'
import { toast } from 'sonner'

export function useUpdateProfileMutation() {
  const router = useRouter()

  const queryClient = useQueryClient()

  // const { startUpload: startAvatarUpload } = useUploadThing('avatar')

  const mutation = useMutation({
    mutationFn: async ({
      values
      // avatar
    }: {
      values: updateUserProfileValues
      // avatar?: File
    }) => {
      return Promise.all([
        UpdateUserProfile(values)
        // avatar && startAvatarUpload([avatar])
      ])
    },
    onSuccess: async ([updatedUser]) => {
      // const newAvatarUrl = uploadResult?.[0].serverData.image

      const queryFilters: QueryFilters = {
        queryKey: ['post-feed']
      }

      await queryClient.cancelQueries(queryFilters)

      queryClient.setQueriesData<InfiniteData<PostsPage, string | null>>(
        queryFilters,
        oldData => {
          if (!oldData) return

          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map(page => ({
              nextCursor: page.nextCursor,
              posts: page.posts.map(post => {
                if (post.user.id === updatedUser.id) {
                  return {
                    ...post,
                    user: {
                      ...updatedUser
                      // image: newAvatarUrl || updatedUser.image
                    }
                  }
                }
                return post
              })
            }))
          }
        }
      )

      router.refresh()

      toast.success('Profile updated')
    },
    onError(error) {
      console.error(error)
      toast.error('Failed to update profile')
    }
  })

  return mutation
}
