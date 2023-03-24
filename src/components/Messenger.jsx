import Chat from "./Chat"
import UserInfoMessenger from "./UserInfoMessenger"
import ListingInfoMessenger from "./ListingInfoMessenger"

const Messenger = ({ socket, listingInfoRef }) => {
  return (
    // <div className="h-full flex flex-col bg-white bg-purple-300">
    <div className="grid grid-rows-[min-content_min-content_1fr_min-content] bg-white">
      <UserInfoMessenger />
      <ListingInfoMessenger socket={socket} listingInfoRef={listingInfoRef} />
      <Chat socket={socket} listingInfoRef={listingInfoRef} />
    </div>
  )
}
export default Messenger
