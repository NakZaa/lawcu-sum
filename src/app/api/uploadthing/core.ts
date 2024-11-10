import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { createUploadthing, FileRouter } from 'uploadthing/next'
import { UploadThingError, UTApi } from 'uploadthing/server'

const f = createUploadthing()

export const fileRouter = {
  //   avatar: f({ image: { maxFileSize: '512KB' } })
  //     .middleware(async () => {
  //       const user = await currentUser()

  //       if (!user) throw new UploadThingError('Unauthorized')

  //       return { user }
  //     })
  //     .onUploadComplete(async ({ metadata, file }) => {
  //       //   const oldAvatarUrl = metadata.user.image

  //       //   if (oldAvatarUrl) {
  //       //     const key = oldAvatarUrl.split('')[1]

  //       //     await new UTApi().deleteFiles(key)
  //       //   }

  //       const newAvatarUrl = file.url
  //       await db.user.update({
  //         where: { id: metadata.user.id },
  //         data: { image: file.url }
  //       })
  //       console.log('Upload complete for userId:', metadata.user.id)
  //       console.log('file url', file.url)

  //       return { image: file.url }
  //     })
  attachment: f({
    image: { maxFileSize: '4MB', maxFileCount: 5 },
    video: { maxFileSize: '64MB', maxFileCount: 5 }
  })
    .middleware(async () => {
      const user = await currentUser()

      if (!user) throw new UploadThingError('Unauthorized')

      return {}
    })
    .onUploadComplete(async ({ file }) => {
      const media = await db.media.create({
        data: {
          url: file.url,
          type: file.type.startsWith('image') ? 'IMAGE' : 'VIDEO'
        }
      })

      return { mediaId: media.id }
    })
} satisfies FileRouter

export type AppFileRouter = typeof fileRouter
