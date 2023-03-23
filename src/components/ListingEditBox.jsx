import { useSelector, useDispatch } from "react-redux"
import { useParams, Link } from "react-router-dom"
import tw, { styled } from "twin.macro"
import Stars from "./Stars"
import {
  BiEditAlt,
  BiMessageSquareCheck,
  BiCool,
  BiTrashAlt,
} from "react-icons/bi"
import {
  updateListingStatus,
  deleteListing,
} from "../features/singleListing/singleListingSlice"

const ListingEditBox = () => {
  const { listing } = useSelector((store) => store.singleListing)
  const { status, numOfChats } = listing

  const { user } = useSelector((store) => store.user)
  const { username, photo, rating, numOfReviews } = user

  const { id: listingId } = useParams()
  const dispatch = useDispatch()

  return (
    <Wrapper>
      <div className="user-detail">
        <div className="photo-container">
          <img src={photo.url} alt="user photo" className="user-photo" />
        </div>
        <div className="info">
          <div className="row">
            <h3>{username}</h3>
          </div>
          <div className="row">
            <span>{rating.toFixed(1)}</span>
            <Stars rating={rating} />
            <span>
              {numOfReviews} {numOfReviews > 1 ? "reviews" : "review"}
            </span>
          </div>
        </div>
      </div>
      {/* FIXME FIX WHEN IMPLEMENT CHAT ROOM */}
      <Link to="/chat">
        <div className="btn btn-secondary">
          {numOfChats
            ? `view ${numOfChats} ${numOfChats > 1 ? "chats" : "chat"}`
            : `view all chats`}
        </div>
      </Link>
      <ul>
        {status !== "sold" && (
          <>
            <Link to={`/listing/${listingId}/edit`}>
              <li>
                <BiEditAlt className="icon" />
                <span>Edit Listing</span>
              </li>
            </Link>
            <li
              onClick={() =>
                dispatch(
                  updateListingStatus({
                    id: listingId,
                    status: status === "reserved" ? "sell" : "reserved",
                  })
                )
              }
            >
              <BiMessageSquareCheck className="icon" />
              <span>
                {status === "reserved"
                  ? "Mark as Unreserve"
                  : "Mark as reserved"}
              </span>
            </li>
            <li
              onClick={() =>
                dispatch(updateListingStatus({ id: listingId, status: "sold" }))
              }
            >
              <BiCool className="icon" />
              <span>Mark as Sold</span>
            </li>
          </>
        )}

        <li onClick={() => dispatch(deleteListing(listingId))}>
          <BiTrashAlt className="icon" />
          <span>Delete</span>
        </li>
      </ul>
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

  .btn {
    ${tw`hover:bg-primary mt-2`}
  }

  ul {
    ${tw`pt-1`}
    li {
      ${tw`
        flex gap-1 items-center px-1 py-0.5 
        transition duration-200 hover:bg-gray-200 cursor-pointer
      `}
    }

    & > li:last-child {
      ${tw`text-red-500`}
    }
  }
`

export default ListingEditBox
