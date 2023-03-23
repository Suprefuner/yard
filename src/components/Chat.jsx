import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"
import tw, { styled } from "twin.macro"
import { ImImage } from "react-icons/im"
import Lottie from "lottie-react"
import typingAnimation from "../assets/animation/3759-typing.json"
import Message from "./Message"
import { updateUserNumOfUnreadMessages } from "../features/user/userSlice"
import {
  sendMessage,
  updateMessages,
  updateChatLastMsgAndStatus,
  updateLocalMessagesStatus,
  createChat,
} from "../features/chat/chatSlice"
import { uploadImageToCloudinary } from "../utils/helpers"
import { toast } from "react-toastify"

const Chat = ({ socket }) => {
  const [inputText, setInputText] = useState("")
  const [arrivalMessage, setArrivalMessage] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const { user } = useSelector((store) => store.user)
  const { listing: singleListing } = useSelector((store) => store.singleListing)
  const { chatList, currentChat, messages } = useSelector((store) => store.chat)
  const dispatch = useDispatch()
  const scrollRef = useRef()
  const [searchParams, setSearchParams] = useSearchParams()
  const searchListing = searchParams.get("listing")

  /*
  ===============================================================
  USE-EFFECT
  ===============================================================
  */
  useEffect(() => {
    const handleUpdateMessageStatus = ({ chatId }) => {
      if (currentChat._id !== chatId) return
      dispatch(updateLocalMessagesStatus())
    }

    socket?.on("updateMessageStatus", handleUpdateMessageStatus)
    return () => socket?.off("updateMessageStatus", handleUpdateMessageStatus)
  }, [currentChat])

  // useEffect(() => {
  //   const handleGetMessage = ({ senderId, msg }) => {
  //     const messageObject = {
  //       chat: msg.chat,
  //       createdAt: Date.now(),
  //     }

  //     if (!msg.type) {
  //       messageObject.message = msg.text
  //         ? { text: msg.text }
  //         : { image: msg.image }
  //     }

  //     if (msg.type && msg.type === "offer") {
  //       messageObject.message = { text: "" }
  //       messageObject.type = "offer"
  //       messageObject.offerType = msg.offerType
  //       messageObject.offerPrice = msg.offerPrice
  //     }

  //     // IF THE MESSAGE FROM CURRENT CHAT
  //     if (
  //       senderId === currentChat?.participants[0]._id &&
  //       msg.chat === currentChat?._id
  //     ) {
  //       setArrivalMessage({
  //         ...messageObject,
  //         sender: senderId,
  //         receiver: user._id,
  //       })
  //       dispatch(updateChatLastMsgAndStatus({ ...messageObject }))
  //     }

  //     // IF THE MESSAGE NOT FROM CURRENT CHAT
  //     else {
  //       const chat = chatList.find((chat) => chat._id === msg.chat)
  //       const user = chat?.participants[0]
  //       if (!user) return

  //       dispatch(updateChatLastMsgAndStatus({ ...messageObject, status: true }))
  //       dispatch(updateUserNumOfUnreadMessages())

  //       toast.success(`${user.username} just sent you a new message`, {
  //         toastId: "new message",
  //         hideProgressBar: true,
  //       })
  //     }
  //   }

  //   socket?.on("getMessage", handleGetMessage)
  //   return () => socket?.off("getMessage", handleGetMessage)
  // }, [chatList, currentChat])

  useEffect(() => {
    const handleGetTypingMessage = ({ senderId, isTyping }) => {
      if (senderId === currentChat.participants[0]._id) {
        setIsTyping(isTyping)
      }
    }

    socket?.on("getTypingMessage", handleGetTypingMessage)
    return () => socket?.off("getTypingMessage", handleGetTypingMessage)
  }, [currentChat, socket, user._id])

  useEffect(() => {
    if (!arrivalMessage) return
    dispatch(updateMessages(arrivalMessage))
  }, [arrivalMessage])

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" })

    socket?.emit("readMessage", {
      chatId: currentChat._id,
      userId: currentChat.participants[0]._id,
    })
  }, [messages])

  /*
  ===============================================================
  FUNCTIONS
  ===============================================================
  */

  const handleChange = (e) => {
    setInputText(e.target.value)

    socket?.emit("setTypingMessage", {
      senderId: user._id,
      receiverId: currentChat.participants[0]._id,
      isTyping: Boolean(e.target.value),
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newMessage = {
      chat: currentChat._id,
      receiver: currentChat.participants[0]._id,
    }

    const file = e.target.files
    let result
    if (file) {
      const formData = new FormData()
      formData.append("photo", file[0])
      result = await uploadImageToCloudinary(formData)
      newMessage.image = {
        url: result?.data?.secure_url,
        publicId: result?.data?.public_id,
      }
    } else {
      newMessage.text = inputText
    }

    if (searchListing) {
      dispatch(
        createChat({
          userId: singleListing.createdBy.user._id,
          listing: searchListing,
          text: newMessage.text,
          image: newMessage.image,
        })
      )
    } else {
      socket?.emit("sendMessage", {
        senderId: user._id,
        receiverId: currentChat.participants[0]._id,
        msg: newMessage,
      })

      dispatch(
        updateChatLastMsgAndStatus({
          chatId: currentChat._id,
          msg: newMessage.text
            ? { text: newMessage.text }
            : { image: newMessage.image },
        })
      )

      dispatch(sendMessage(newMessage))
      e.target.focus()
      setInputText("")

      socket?.emit("setTypingMessage", {
        senderId: user._id,
        receiverId: currentChat.participants[0]._id,
        isTyping: false,
      })
    }
  }

  return (
    <Wrapper>
      {/* FIXME DEVELOPMENT */}
      <div
        className="messages"
        style={{
          height: window.innerHeight - 64 - 81 - 81 - 61,
        }}
      >
        {!searchListing &&
          messages.map((msg, i) => {
            if (i !== messages.length - 1) {
              return <Message key={i} {...msg} i={i} />
            } else {
              return <Message key={i} {...msg} i={i} scrollRef={scrollRef} />
            }
          })}
        {!searchListing && isTyping && (
          <div className="message-status-row">
            <span className="message-status">
              {currentChat.participants[0].username} is typing
            </span>
            <Lottie
              animationData={typingAnimation}
              loop={true}
              className="animation"
            />
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Type here..."
          value={inputText}
          onChange={handleChange}
        />
        <div className="button">
          {inputText ? (
            <button>send</button>
          ) : (
            <div className="input">
              <label htmlFor="send-photo">
                <ImImage className="icon" />
              </label>
              <input
                type="file"
                id="send-photo"
                accept="image/*"
                hidden
                onChange={handleSubmit}
              />
            </div>
          )}
        </div>
      </form>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`flex flex-col justify-between h-full`}

  .messages {
    ${tw`overflow-y-scroll py-1 px-2 pb-5 space-y-1 relative`}

    .message-status-row {
      ${tw`flex items-center absolute`}
    }

    .message-status {
      ${tw`text-sm text-gray-500`}
    }

    .animation {
      ${tw`w-5`}
    }
  }

  form {
    ${tw`flex items-center border-t  `}

    input {
      ${tw`flex-1 p-2 pr-4 focus:outline-0`}
    }

    .button {
      ${tw`relative`}

      .icon {
        ${tw`
          absolute right-2 top-1/2 -translate-y-1/2 text-xl text-secondary cursor-pointer
        `}
      }

      button {
        ${tw`p-2`}
      }
    }
  }
`
export default Chat
