'use client'

import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useCurrentUser } from '@/hooks/use-current-user'
import { FaUser } from 'react-icons/fa6'
import { Button } from '@/components/ui/button'
import './styles.css'
import { useSubmitPostMutation } from './mutations'
import LoadingButton from '@/components/LoadingButton'
import useMediaUpload, { Attachment } from './useMediaUpload'
import { ClipboardEvent, useRef } from 'react'
import { ImageIcon, Loader2, XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useDropzone } from '@uploadthing/react'

export default function PostEditor() {
  const user = useCurrentUser()

  const mutation = useSubmitPostMutation()

  const {
    startUpload,
    attachments,
    isUploading,
    uploadProgress,
    removeAttachment,
    reset: resetMediaUploads
  } = useMediaUpload()

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload
  })

  const { onClick, ...rootProps } = getRootProps()

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false
      }),
      Placeholder.configure({
        placeholder: 'What is your question?'
      })
    ]
  })

  const input =
    editor?.getText({
      blockSeparator: '\n'
    }) || ''

  //   async function onSubmit() {
  //     await submitPost(input)
  //     editor?.commands.clearContent()
  //   }

  function onSubmit() {
    mutation.mutate(
      {
        content: input,
        mediaIds: attachments.map(a => a.mediaId).filter(Boolean) as string[]
      },
      {
        onSuccess() {
          editor?.commands.clearContent()
          resetMediaUploads()
          // toast.success('Posted successfully!')
        }
      }
    )
  }

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    const files = Array.from(e.clipboardData.items)
      .filter(item => item.kind === 'file')
      .map(item => item.getAsFile()) as File[]
    startUpload(files)
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card shadow-sm p-5">
      <div className="flex gap-5 justify-center">
        <Avatar>
          <AvatarImage
            src={user?.image || ''}
            referrerPolicy="no-referrer"
            alt="profile-picture"
          />
          <AvatarFallback className="bg-[#D95F8C]">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
        <div {...rootProps} className="w-full">
          <EditorContent
            editor={editor}
            className={cn(
              'w-full max-h-[20rem] overflow-y-auto bg-input rounded-2xl px-5 py-3',
              isDragActive && 'outline-dashed'
            )}
            onPaste={onPaste}
          />
          <input {...getInputProps()} />
        </div>
      </div>
      {!!attachments.length && (
        <AttachmentPreviews
          attachments={attachments}
          removeAttachment={removeAttachment}
        />
      )}
      <div className="flex justify-end gap-3 items-center">
        {isUploading && (
          <>
            <span className="text-sm">{uploadProgress ?? 0}%</span>
            <Loader2 className="size-5 animate-spin text-primary" />
          </>
        )}
        <AddAttachmentsButton
          onFilesSelected={startUpload}
          disabled={isUploading || attachments.length >= 5}
        />
        <LoadingButton
          onClick={onSubmit}
          loading={mutation.isPending}
          disabled={!input.trim() || isUploading}
          className="min-w-20"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  )
}

interface AddAttachmentsButtonProps {
  onFilesSelected: (files: File[]) => void
  disabled: boolean
}

function AddAttachmentsButton({
  onFilesSelected,
  disabled
}: AddAttachmentsButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="hover:text-primary text-primary"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={20} />
      </Button>
      <input
        type="file"
        accept="image/*, video/*"
        multiple
        ref={fileInputRef}
        className="hidden sr-only"
        onChange={e => {
          const files = Array.from(e.target.files || [])
          if (files.length) {
            onFilesSelected(files)
            e.target.value = ''
          }
        }}
      />
    </>
  )
}

interface AttachmentPreviewsProps {
  attachments: Attachment[]
  removeAttachment: (fileName: string) => void
}

function AttachmentPreviews({
  attachments,
  removeAttachment
}: AttachmentPreviewsProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        attachments.length > 1 && 'sm:grid sm:grid-cols-2'
      )}
    >
      {attachments.map(attachment => (
        <AttachmentPreview
          key={attachment.file.name}
          attachment={attachment}
          onRemoveClick={() => removeAttachment(attachment.file.name)}
        />
      ))}
    </div>
  )
}

interface AttachmentsPreviewProps {
  attachment: Attachment
  onRemoveClick: () => void
}

function AttachmentPreview({
  attachment: { file, mediaId, isUploading },
  onRemoveClick
}: AttachmentsPreviewProps) {
  const src = URL.createObjectURL(file)

  return (
    <div
      className={cn('relative mx-auto size-fit', isUploading && 'opacity-50')}
    >
      {file.type.startsWith('image') ? (
        <Image
          src={src}
          alt="Attachment preview"
          width={500}
          height={500}
          className="size-fit max-h-[30rem] rounded-2xl"
        />
      ) : (
        <video controls className="size-fit max-h-[30rem] rounded-2xl">
          <source src={src} type={file.type} />
        </video>
      )}
      {isUploading && (
        <button
          onClick={onRemoveClick}
          className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
        >
          <XIcon size={20} />
        </button>
      )}
    </div>
  )
}
