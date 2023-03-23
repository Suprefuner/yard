import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import tw, { styled } from "twin.macro"
import moment from "moment"
import { MdReviews } from "react-icons/md"
import Stars from "./Stars"
import Loading from "./Loading"
import { switchReviewModal } from "../features/review/reviewSlice"
import {
  sendMessage,
  updateChatWithOffer,
  createChat,
} from "../features/chat/chatSlice"
import customFetch from "../utils/axios"

const OfferBox = ({ socket }) => {
  const { user } = useSelector((store) => store.user)
  const { chatList } = useSelector((store) => store.chat)
  const { listing, isLoading } = useSelector((store) => store.singleListing)
  const [makeOffer, setMakeOffer] = useState(0)
  const [hasOffer, setHasOffer] = useState(false)
  const dispatch = useDispatch()

  const checkHasOffer = async (listingId) => {
    const chat = await fetchChat(listingId)
    if (!chat || !chat.offer) return
    setHasOffer(true)
  }

  const fetchChat = async (listingId) => {
    const {
      data: { data: chat },
    } = await customFetch("/chat/searchChat", {
      params: { listingId },
    })

    return chat
  }

  useEffect(() => {
    checkHasOffer(listing._id)
  }, [])

  const isParticipant = (userId) =>
    listing.status === "sold" &&
    (listing.createdBy.user === userId || listing.soldTo.user === userId)

  const handleOffer = async (e) => {
    e.preventDefault()
    if (!makeOffer) return

    const chat = await fetchChat(listing._id)

    if (!chat) {
      dispatch(
        createChat({
          userId: listing.createdBy.user._id,
          listing: listing._id,
          type: "offer",
          offerType: "made",
          offerPrice: makeOffer,
        })
      )

      // GIVE MONGODB TIME TO CREATE A NEW CHAT
      setTimeout(() => {
        console.log("emit event")
        socket?.emit("createChat", {
          senderId: user._id,
          receiverId: listing.createdBy.user._id,
          listing: listing,
          type: "offer",
          offerType: "made",
          offerPrice: makeOffer,
        })
      }, 3000)
    } else {
      const message = {
        chat: chat._id,
        receiverId: chat.participants[0]._id,
        type: "offer",
        offerType: "made",
        offerPrice: makeOffer,
      }

      socket?.emit("sendMessage", {
        senderId: user._id,
        receiverId: chat.participants[0]._id,
        msg: message,
      })

      dispatch(sendMessage(message))
    }

    setMakeOffer("")
  }

  const handleChange = (e) => {
    const { value } = e.target

    // LIMIT USER INPUT NUMBER WITHOUT USING <input type="number">
    const re = /^([0-9]+)$/

    // DELETE TO 0 CHANGE TO STRING "" FOR BETTER UX
    if (re.test(value) || value === "") {
      setMakeOffer(() => (value !== "" ? +value : ""))
    }
  }

  useEffect(() => {
    setMakeOffer(listing.price)
  }, [listing.price])

  if (isLoading) {
    return <Loading />
  }

  const { photo, rating, numOfReviews, createdAt, following, follower, _id } =
    listing.createdBy.user

  return (
    <Wrapper>
      <div className="user-detail">
        <div className="photo-container">
          <img src={photo?.url} alt="user photo" className="user-photo" />
        </div>
        <div className="info">
          <div className="row">
            <span>{rating?.toFixed(1)}</span>
            <Stars rating={rating} />
            <span>{numOfReviews} reviews</span>
          </div>
          <span>joined {moment(createdAt, "YYYYMMDD").fromNow()}</span>
          <div className="row">
            <span>{follower} followers</span>
            <span>{following?.length} following</span>
          </div>
        </div>
      </div>
      {listing.status !== "sold" && !hasOffer && (
        <>
          <form onSubmit={handleOffer}>
            <input
              type="text"
              placeholder="$500"
              value={makeOffer}
              onChange={handleChange}
            />
            <button className="btn btn-primary">make offer</button>
          </form>
          <Link
            className="btn btn-primary btn-chat"
            to={`/chat?listing=${listing._id}`}
          >
            {chatList.find((chat) => chat.listing._id === listing._id)
              ? "view chats"
              : "start chat"}
          </Link>
        </>
      )}

      {listing.status !== "sold" && hasOffer && (
        <Link
          className="btn btn-primary btn-chat"
          to={`/chat?listing=${listing._id}`}
        >
          <div>view your chat</div>
        </Link>
      )}

      {listing.status === "sold" && (
        <>
          <Link className="block mt-2" to="/chat">
            <button
              className="btn btn-secondary btn-sold"
              disabled={!isParticipant(user._id)}
            >
              {isParticipant(user._id) ? "sold - view chat" : "sold"}
            </button>
          </Link>
          {/* prettier-ignore */}
          {(_id === user._id && !listing?.createdBy?.review) ||
            (listing?.soldTo?.user === user._id && !listing?.soldTo?.review && (
              <button
                className="btn-outline btn"
                onClick={() => dispatch(switchReviewModal(true))}
              >
                <MdReviews className="icon" />
                <span>Leave a review</span>
              </button>
            ))}
        </>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`border rounded-xl p-2 space-y-2 relative hidden lg:block`}

  .user-detail {
    ${tw`text-sm flex items-center gap-2`}

    .photo-container {
      ${tw`w-7 aspect-square rounded-full overflow-hidden`}

      img {
        ${tw`w-full h-full object-cover`}
      }
    }

    .row {
      ${tw`flex gap-0.5 leading-10`}
    }

    h3 {
      ${tw`text-xl font-semibold`}
    }
  }

  form {
    ${tw`relative`}

    button {
      ${tw`absolute top-0 right-0 h-full rounded-l-none`}
    }
  }

  input {
    ${tw`border py-1 px-2 w-full rounded-lg`}
  }

  .btn-chat {
    ${tw`block`}
  }

  .btn-chat,
  .btn-sold {
    ${tw`w-full py-1`}
  }

  .btn-sold:disabled {
    ${tw`bg-slate-700 text-slate-300 cursor-no-drop`}
  }

  .btn-outline {
    ${tw`w-full flex items-center justify-center gap-0.5 `}
  }

  .btn-delete {
    ${tw`text-red-500 border-red-500 hover:(bg-red-400 text-white)`}
  }
`

export default OfferBox
