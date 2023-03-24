import { useSelector } from "react-redux"
import tw, { styled } from "twin.macro"
import moment from "moment"
import { BsCheckAll, BsCheck } from "react-icons/bs"

const Message = ({
  message,
  sender,
  createdAt,
  status,
  i,
  scrollRef,
  type,
  offerType,
  offerPrice,
}) => {
  const { user } = useSelector((store) => store.user)
  const { messages, currentChat } = useSelector((store) => store.chat)

  if (type === "offer") {
    return (
      <Wrapper className={`${sender === user._id ? "from-me" : "from-other"}`}>
        {sender !== user._id &&
          (messages[i + 1]?.sender === user._id ||
            messages[i + 1]?.sender === undefined) && (
            <div className="photo-container">
              <img
                src={currentChat?.participants[0]?.photo?.url}
                alt="user photo"
                className="user-photo"
              />
            </div>
          )}
        <div className="message-container" ref={scrollRef ? scrollRef : null}>
          <div className="message">
            <h4>{offerType} offer</h4>
            <h2 className="offer">HK${offerPrice}</h2>
          </div>
          <span className="msg-time">
            {moment(createdAt).fromNow()}{" "}
            {user._id === sender ? (
              status === "seen" ? (
                <BsCheckAll className="icon icon-seen" />
              ) : (
                <BsCheckAll className="icon" />
              )
            ) : null}
          </span>
        </div>
      </Wrapper>
    )
  }

  return (
    <Wrapper className={`${sender === user._id ? "from-me" : "from-other"}`}>
      {sender !== user._id &&
        (messages[i + 1]?.sender === user._id ||
          messages[i + 1]?.sender === undefined) && (
          <div className="photo-container">
            <img
              src={currentChat?.participants[0]?.photo?.url}
              alt="user photo"
              className="user-photo"
            />
          </div>
        )}
      <div className="message-container" ref={scrollRef ? scrollRef : null}>
        {message?.text ? (
          <div className="message">{message?.text}</div>
        ) : (
          <img
            src={message?.image?.url || "#"}
            alt="photo"
            className="image-msg"
          />
        )}
        <span className="msg-time">
          {moment(createdAt).fromNow()}{" "}
          {user._id === sender ? (
            status === "seen" ? (
              <BsCheckAll className="icon icon-seen" />
            ) : (
              <BsCheckAll className="icon" />
            )
          ) : null}
        </span>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`
      flex items-center gap-1.5 relative
      [&.from-other]:justify-start
      [&.from-me]:(justify-end)
      [&.from-other .message]:(ml-5 bg-gray-200)
      [&.from-me .message]:(bg-trinary text-white)
      [&.from-other .message-container]:(items-start)
      [&.from-other .message-container img]:(ml-5)
      [&.from-other .message-container span]:(pl-5.5)
      [&.from-me .message-container]:(items-end)
      [&.from-me .message-container span]:(pr-0.5)
    `}

  .photo-container {
    ${tw`h-3.5 aspect-square rounded-full overflow-hidden absolute`}

    img {
      ${tw`w-full h-full object-cover`}
    }
  }

  .message-container {
    ${tw`flex flex-col gap-[0.25rem]`}
  }

  .message {
    ${tw`
      px-1.5 py-[0.75rem] rounded-2xl w-max max-w-[50vw] lg:(max-w-[20rem])
    `}
  }

  .offer {
    ${tw`text-2xl font-semibold`}
  }

  .image-msg {
    ${tw`max-w-[20rem] aspect-auto rounded-xl`}
  }

  .msg-time {
    ${tw`text-sm text-gray-500 flex items-center gap-0.5`}

    .icon {
      ${tw`text-[1.4rem]`}
    }

    .icon-seen {
      ${tw`text-blue-400`}
    }
  }
`
export default Message
