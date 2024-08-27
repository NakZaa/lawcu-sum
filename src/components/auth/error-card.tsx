import { ExclamationTriangleIcon } from '@radix-ui/react-icons'
import { CardWrapper } from './card-wrapper'
import { FaCircleExclamation } from 'react-icons/fa6'

export const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong!"
      backButtonHref="/auth/login"
      backButtonLabel="Back to login"
    >
      <div className="w-full flex flex-col justify-center items-center text-center">
        <h1 className="flex flex-col pb-3">
          Please make sure you are using an
          <span className="text-[#D95F8C] font-bold">
            &quot;@student.chula.ac.th&quot;
          </span>
          email address
        </h1>
        <FaCircleExclamation className="w-10 h-10 text-destructive" />
      </div>
    </CardWrapper>
  )
}
