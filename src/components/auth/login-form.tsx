import Image from 'next/image'
import { CardWrapper } from './card-wrapper'

export const LoginForm = () => {
  return (
    <CardWrapper
      headerLabel="Welcome Back!"
      backButtonLabel="Back to home"
      backButtonHref="/"
      showSocial
    >
      <div className="flex justify-center items-center">
        <Image src={'/black_duck.gif'} width={124} height={124} alt={'duck'} />
      </div>
    </CardWrapper>
  )
}
