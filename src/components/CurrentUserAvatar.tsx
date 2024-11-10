import { FaUser } from 'react-icons/fa6'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { useCurrentUser } from '@/hooks/use-current-user'

export const CurrentUserAvatar = () => {
  const user = useCurrentUser()
  
  return (
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
  )
}
