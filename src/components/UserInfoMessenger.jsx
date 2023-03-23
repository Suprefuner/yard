import { useSelector } from "react-redux"
import { Link, useSearchParams } from "react-router-dom"
import tw, { styled } from "twin.macro"
import moment from "moment"

const UserInfoMessenger = () => {
  const { currentChat, onlineUsers } = useSelector((store) => store.chat)
  const { listing } = useSelector((store) => store.singleListing)
  const [searchParams, setSearchParams] = useSearchParams()
  const searchListing = searchParams.get("listing")

  let user

  if (searchListing) {
    const {
      createdBy: { user: listingOwner },
    } = listing
    user = { ...listingOwner }
  } else {
    const currentChatUser = currentChat?.participants[0]
    user = { ...currentChatUser }
  }

  const { _id, photo, username, lastOnline } = user

  const isUserOnline = (userId) =>
    onlineUsers.some((onlineUser) => onlineUser.id === userId)

  return (
    <Wrapper to={`/profile/${_id}`}>
      <div className="photo-container online">
        <img src={photo.url} alt="user photo" className="user-photo" />
        {isUserOnline(_id) && <div className="user-status"></div>}
      </div>
      <div className="detail">
        <h3 className="username">{username}</h3>
        <span>
          {isUserOnline(_id)
            ? "online"
            : `online ${moment(lastOnline).fromNow()}`}
        </span>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled(Link)`
  ${tw`flex items-center gap-2 px-2 py-1.5 border-b cursor-pointer`}

  .photo-container {
    ${tw`
      h-5 aspect-square rounded-full relative
    `}

    img {
      ${tw`w-full h-full object-cover rounded-full`}
    }

    .user-status {
      ${tw`absolute -right-0.5 -bottom-0.5 h-[40%] aspect-square rounded-full bg-green-400 z-10 border-4 border-white`}
    }
  }

  span {
    ${tw`font-light text-gray-700 text-[1.4rem]`}
  }
`
export default UserInfoMessenger
