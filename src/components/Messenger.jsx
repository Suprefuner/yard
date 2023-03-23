import Chat from "./Chat"
import UserInfoMessenger from "./UserInfoMessenger"
import ListingInfoMessenger from "./ListingInfoMessenger"

const Messenger = ({ socket }) => {
  return (
    // <div className="h-full flex flex-col bg-white bg-purple-300">
    <div className="grid grid-rows-[min-content_min-content_1fr_min-content] bg-white">
      <UserInfoMessenger />
      <ListingInfoMessenger socket={socket} />
      <Chat socket={socket} />
    </div>
  )
}
export default Messenger
