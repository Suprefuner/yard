import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link, useSearchParams } from "react-router-dom"
import tw, { styled } from "twin.macro"
import { IoMdClose } from "react-icons/io"
import {
  sendMessage,
  updateChatWithOffer,
  createChat,
} from "../features/chat/chatSlice"
import { updateListingStatus } from "../features/singleListing/singleListingSlice"
import { isDesktop } from "../utils/helpers"

const ListingInfoMessenger = ({ socket, listingInfoRef }) => {
  const [showOfferBox, setShowOfferBox] = useState(false)
  const [makeOffer, setMakeOffer] = useState("")
  const [currentListing, setCurrentListing] = useState({
    photos: [{ url: "" }],
    createdBy: { user: "" },
  })
  const { user } = useSelector((store) => store.user)
  const { listing: singleListing } = useSelector((store) => store.singleListing)
  const { currentChat, chatList } = useSelector((store) => store.chat)
  const { offer, offerStatus, offerPrice } = currentChat
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchListing = searchParams.get("listing")

  useEffect(() => {
    setCurrentListing(() =>
      searchListing ? { ...singleListing } : { ...currentChat.listing }
    )
  }, [currentChat])

  useEffect(() => {
    if (!singleListing.createdBy.user._id) return
    // BECAUSE IT TAKES TIME TO CREATE A NEW CHAT SO CAN'T EMIT RIGHT AFTER THE ACTION
    socket?.emit("createChat", {
      senderId: user._id,
      receiverId: singleListing.createdBy.user._id,
      listing: singleListing,
      type: "offer",
      offerType: "made",
      offerPrice: makeOffer,
    })
  }, [chatList.length])

  const handleOffer = (e) => {
    e.preventDefault()
    if (!showOfferBox) {
      setShowOfferBox(true)
      setMakeOffer("")
      return
    }

    if (!makeOffer) return
    if (searchListing) {
      dispatch(
        createChat({
          userId: singleListing.createdBy.user._id,
          listing: singleListing._id,
          type: "offer",
          offerType: "made",
          offerPrice: makeOffer,
        })
      )

      setSearchParams("")
    } else {
      const message = {
        chat: currentChat._id,
        receiverId: currentChat.participants[0]._id,
        type: "offer",
        offerType: "made",
        offerPrice: makeOffer,
      }

      socket?.emit("sendMessage", {
        senderId: user._id,
        receiverId: currentChat.participants[0]._id,
        msg: message,
      })

      dispatch(sendMessage(message))
    }

    setMakeOffer("")
    setShowOfferBox(false)
  }

  const handleCancelOffer = () => {
    dispatch(
      sendMessage({
        chat: currentChat._id,
        receiver: currentChat.participants[0]._id,
        type: "offer",
        offerType: "cancelled",
        offerPrice: currentChat.offerPrice,
      })
    )
    dispatch(
      updateChatWithOffer({
        chatId: currentChat._id,
        offer: false,
        offerStatus: undefined,
        offerPrice: undefined,
      })
    )

    socket?.emit("sendMessage", {
      senderId: user._id,
      receiverId: currentChat.participants[0]._id,
      msg: {
        chat: currentChat._id,
        receiverId: currentChat.participants[0]._id,
        type: "offer",
        offerType: "cancelled",
        offerPrice: currentChat.offerPrice,
      },
    })
  }

  // const handleAcceptOffer = () => {
  //   dispatch(
  //     updateListingStatus({
  //       id: currentChat?.listing._id,
  //       status: "sold",
  //       soldTo: currentChat?.participants[0]._id,
  //       offerPrice: currentChat?.offerPrice,
  //     })
  //   )
  // }

  const handleAcceptOffer = (e) => {
    e.preventDefault()

    const message = {
      chat: currentChat._id,
      receiverId: currentChat.participants[0]._id,
      type: "offer",
      offerType: "accepted",
      offerPrice: currentChat.offerPrice,
    }

    socket?.emit("sendMessage", {
      senderId: user._id,
      receiverId: currentChat.participants[0]._id,
      msg: message,
    })

    dispatch(sendMessage(message))

    dispatch(
      updateListingStatus({
        id: currentChat?.listing._id,
        status: "sold",
        soldTo: currentChat?.participants[0]._id,
        offerPrice: currentChat?.offerPrice,
      })
    )

    dispatch(
      updateChatWithOffer({
        chatId: currentChat._id,
        offer: true,
        offerStatus: "accepted",
        offerPrice: currentChat?.offerPrice,
      })
    )
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

  return (
    <Wrapper ref={listingInfoRef}>
      <div className="listing-detail">
        <Link to={`/listing/${currentListing?._id}`} className="listing-link">
          <div className="photo-container">
            <img
              src={currentListing?.photos[0].url}
              alt="user photo"
              className="user-photo"
            />
          </div>
          <div className="detail">
            <div className="text">
              <h3 className="listing-name">{currentListing?.name}</h3>
              <div className={isDesktop() ? "row" : ""}>
                <h4 className="price">HK${currentListing?.price}</h4>
                {!searchListing && offer && (
                  <h3>
                    {offerStatus === "accepted" && (
                      <span className="status">Accepted</span>
                    )}
                    <span>
                      {" "}
                      {currentListing?.createdBy.user._id === user._id
                        ? "Offered you"
                        : "You Offered"}{" "}
                      HK${offerPrice}
                    </span>
                  </h3>
                )}
              </div>
            </div>
          </div>
        </Link>
        {currentListing?.createdBy.user !== user._id && (
          <form className="row" onSubmit={handleOffer}>
            {showOfferBox && (
              <div className="input">
                <input
                  type="text"
                  placeholder="HK$"
                  className="offerbox"
                  value={makeOffer}
                  onChange={handleChange}
                />
                <IoMdClose
                  className="icon"
                  onClick={() => setShowOfferBox(false)}
                />
              </div>
            )}
            {currentChat.offerStatus !== "accepted" ? (
              searchListing || !currentChat.offer ? (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleOffer}
                >
                  make offer
                </button>
              ) : (
                (!searchListing || currentChat.offer) && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={handleCancelOffer}
                  >
                    cancel offer
                  </button>
                )
              )
            ) : (
              <div className="btn btn-sold">sold</div>
            )}
          </form>
        )}
        {currentListing?.createdBy.user === user._id &&
          currentChat?.listing.status !== "sold" &&
          (currentChat.offer ? (
            <button className="btn btn-primary" onClick={handleAcceptOffer}>
              accept offer
            </button>
          ) : (
            <span className="offer-msg">waiting for offer</span>
          ))}
        {currentListing?.createdBy.user === user._id &&
          currentChat?.listing.status === "sold" && (
            <div className="btn btn-sold">sold</div>
          )}
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`grid gap-2 px-2 py-1.5 border-b`}

  .listing-detail {
    ${tw`flex gap-2 items-center`}
  }

  .listing-link {
    ${tw`flex gap-2 flex-1 items-center lg:(items-start)`}
  }

  .photo-container {
    ${tw`h-5 aspect-square rounded-xl overflow-hidden`}

    img {
      ${tw`w-full h-full object-cover`}
    }
  }

  .detail {
    ${tw`flex justify-between flex-1`}

    span {
      ${tw`font-light text-gray-700 text-sm lg:text-[1.4rem]`}
    }
  }

  .offerbox {
    ${tw`border p-1 rounded-xl`}
  }

  .row {
    ${tw`flex gap-2 items-center`}

    .input {
      ${tw`relative`}
    }

    input {
      ${tw`pr-3.5  max-w-[18rem]`}
    }

    .icon {
      ${tw`absolute right-1 top-1/2 -translate-y-1/2 text-xl cursor-pointer`}
    }
  }

  .offer-msg {
    ${tw`font-light text-gray-700 text-[1.4rem]`}
  }

  .price {
    ${tw`font-semibold`}
  }

  .btn {
    ${tw`py-1`}

    &.btn-sold {
      ${tw`bg-green-400`}
    }
  }
`
export default ListingInfoMessenger
