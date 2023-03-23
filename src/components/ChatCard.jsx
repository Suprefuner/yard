import { useSelector } from "react-redux"
import tw, { styled } from "twin.macro"
import moment from "moment"
import { ImImage } from "react-icons/im"

const ChatCard = ({
  _id,
  listing,
  participants,
  lastMessage,
  offer,
  offerPrice,
  offerStatus,
  status,
  hasUnreadNewMsg,
}) => {
  const { user } = useSelector((store) => store.user)
  const { currentChat, onlineUsers } = useSelector((store) => store.chat)
  const {
    name: listingName,
    photos: listingPhotos,
    createdBy: listingCreatedBy,
  } = listing
  const { username, photo: userPhoto, _id: id } = participants[0]
  const {
    createdAt: messageCreatedAt,
    message,
    offerPrice: lastMessageOfferPrice,
    offerType: lastMessageOfferType,
    type: lastMessageType,
  } = lastMessage

  return (
    <Wrapper className={currentChat?._id === _id && "active"}>
      <div className="photo-container">
        <img src={userPhoto?.url} alt="user photo" className="user-photo" />
        {onlineUsers.some((onlineUser) => onlineUser.id === id) && (
          <div className="user-status"></div>
        )}
      </div>
      <div className="info">
        <div className="row">
          <span>{username}</span>
          <span>{moment(messageCreatedAt).format("DD/MM")}</span>
        </div>
        <div className="row listing-row">
          <div className="text">
            <h3 className="listing-name">{listingName}</h3>
            <span className="last-message">
              {lastMessageType !== "offer" && message?.text && message?.text}
              {lastMessageType !== "offer" && message?.image && (
                <span className="row">
                  <ImImage />
                  attachment
                </span>
              )}
              {lastMessageType === "offer" &&
                `${lastMessageOfferType} ${lastMessageType} HK$${lastMessageOfferPrice}`}
              {hasUnreadNewMsg && <div className="message-status"></div>}
            </span>
          </div>
          <div className="listing-photo">
            <img src={listingPhotos[0]?.url} alt="listing photo" />
          </div>
        </div>
        {offer && (
          <div className="row offer-row">
            <h3>
              {offerStatus === "accepted" && (
                <span className="status accepted">accepted </span>
              )}
              {offerStatus === "denied" && (
                <span className="status denied">denied </span>
              )}
              <span>
                {listingCreatedBy.user === user._id
                  ? `offered you HK${offerPrice}`
                  : `you offered HK${offerPrice}`}
              </span>
            </h3>
          </div>
        )}
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`
    flex gap-2 p-2 border-b cursor-pointer relative
    transition duration-150 hover:(bg-gray-200)
  `}

  &.active {
    ${tw`bg-gray-100  hover:(bg-gray-200)`}
  }

  .photo-container {
    ${tw`h-4 aspect-square rounded-full relative`}

    img {
      ${tw`w-full h-full object-cover rounded-full`}
    }

    .user-status {
      ${tw`absolute -right-0.5 -bottom-[0.25rem] h-1.5 aspect-square rounded-full bg-green-400 z-10 border-2 border-white`}
    }
  }

  .info {
    ${tw`flex-1 space-y-1`}
  }

  .row {
    ${tw`
      flex justify-between items-center
      first:(text-gray-500 font-light text-[1.4rem])
    `}

    &.listing-row {
      ${tw`items-center`}
    }

    &.offer-row {
      ${tw`text-[1.4rem]`}
    }

    .listing-name {
      ${tw`font-semibold`}
    }

    .last-message {
      ${tw`truncate text-gray-600 font-light text-[1.5rem] flex items-center gap-[0.75rem]`}

      .message-status {
        ${tw`h-1 aspect-square bg-green-400 rounded-full`}
      }
    }

    .listing-photo {
      ${tw`h-5 aspect-square`}

      img {
        ${tw`w-full h-full object-cover`}
      }
    }

    .status {
      ${tw`text-green-700 uppercase`}
    }
  }
`
export default ChatCard
