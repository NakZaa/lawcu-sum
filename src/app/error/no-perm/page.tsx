import { CardWrapper } from '@/components/auth/card-wrapper'
import { FaCircleExclamation } from 'react-icons/fa6'

const PermErrorPage = () => {
  return (
    <CardWrapper
      headerLabel="Oops! Something went wrong!"
      backButtonHref="/home"
      backButtonLabel="Back to home"
    >
      <div className="w-full flex flex-col justify-center items-center text-center">
        <h1 className="flex pb-3 gap-1">
          You are not an
          <span className="text-[#D95F8C] font-bold"> &quot;ADMIN&quot;</span>
        </h1>
        <FaCircleExclamation className="w-8 h-8 text-destructive" />
      </div>
    </CardWrapper>
  )
}

export default PermErrorPage
