import { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"
import tw, { styled } from "twin.macro"
import Lottie from "lottie-react"
import typingAnimation from "../assets/animation/3759-typing.json"
import { ChatCard, Messenger } from "../components"
import {
  updateSearchboxInView,
  toggleFooter,
} from "../features/general/generalSlice"
import {
  setCurrentChat,
  getChatMessages,
  readUnreadMessage,
  getAllMyChat,
  addNewChat,
  updateChatLastMsgAndStatus,
  updateChatOfferStatus,
} from "../features/chat/chatSlice"
import { updateNumOfUnreadMessage } from "../features/user/userSlice"

const ChatPage = ({ socket }) => {
  const { chatList, currentChat, messages } = useSelector((store) => store.chat)
  const dispatch = useDispatch()
  const chatListRenderCounter = useRef(0)
  const listingInfoRef = useRef()
  const [searchParams, setSearchParams] = useSearchParams()
  const listing = searchParams.get("listing")

  useEffect(() => {
    dispatch(updateSearchboxInView(true))
    dispatch(toggleFooter(false))
    dispatch(getAllMyChat())

    return () => dispatch(toggleFooter(true))
  }, [])

  useEffect(() => {
    // PREVENT INITIAL RENDER ERROR
    if (!chatList.length) return
    if (chatListRenderCounter.current !== 0) return

    dispatch(setCurrentChat(chatList[0]?._id))
    dispatch(getChatMessages({ chatId: chatList[0]?._id }))
    chatListRenderCounter.current = 1

    if (chatList.find((chat) => chat.listing._id === listing))
      setSearchParams("")

    const handleGetNewChat = (chat) => dispatch(addNewChat(chat))

    socket?.on("getNewChat", handleGetNewChat)
    return () => socket?.off("getNewChat", handleGetNewChat)
  }, [chatList])

  useEffect(() => {
    const handleGetCancelOffer = ({
      senderId,
      chat,
      type,
      offerType,
      offerPrice,
    }) => {
      dispatch(
        updateChatLastMsgAndStatus({
          chatId: chat,
          msg: {
            message: { text: "" },
            type,
            offerType,
            offerPrice,
            createdAt: Date.now(),
          },
          status: chat === currentChat._id,
        })
      )
      dispatch(updateChatOfferStatus(false))
    }
    socket?.on("getCancelOffer", handleGetCancelOffer)
    return () => socket?.off("getCancelOffer", handleGetCancelOffer)
  }, [chatList, messages])

  useEffect(() => {
    dispatch(updateNumOfUnreadMessage())
  }, [messages?.at(0)?._id])

  const handleClick = (id) => {
    dispatch(setCurrentChat(id))
    dispatch(
      getChatMessages({ chatId: id, userId: currentChat.participants[0]._id })
    )
    dispatch(readUnreadMessage(id))
    setSearchParams("")
  }

  if (!chatList.length && !listing) {
    return (
      <Wrapper>
        <div className="container">
          <div>
            <div className="chat-list"></div>
            <div className="empty-content">
              <h3>Doesn't have chat yet</h3>
              <Lottie
                animationData={typingAnimation}
                loop={true}
                className="animation"
              />
            </div>
          </div>
        </div>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <div className="container">
        <div>
          <div className="chat-list">
            {chatList.map((chat) => (
              <div onClick={() => handleClick(chat._id)} key={chat._id}>
                <ChatCard {...chat} />
              </div>
            ))}
          </div>
          <Messenger socket={socket} listingInfoRef={listingInfoRef} />
        </div>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  ${tw` bg-gray-50 h-screen`}

  .container {
    ${tw`
      pt-[calc(var(--navbar-mobile-size))] px-0 overflow-y-scroll h-screen 
      lg:(pt-[calc(var(--navbar-size))] px-3 overflow-y-auto)
    `}

    &>* {
      ${tw`
        h-full bg-white relative
        lg:(grid grid-cols-[40rem_1fr] border-l border-r) 
      `}

      & > *:last-child {
        ${tw`
          absolute top-0 translate-x-full w-screen 
          lg:(static translate-x-0 flex-1 w-auto)
        `}
      }
    }

    .empty-content {
      ${tw`flex flex-col items-center justify-center gap-2 text-3xl font-semibold`}

      .animation {
        ${tw`w-10 -mt-2`}
      }
    }
    .chat-list {
      ${tw`
        h-full bg-white overflow-y-auto overflow-x-hidden 
        lg:(w-auto border-r) 
      `}
    }
  }
`
export default ChatPage
