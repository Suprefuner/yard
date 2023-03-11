import { useDispatch, useSelector } from "react-redux"
import tw, { styled } from "twin.macro"
import moment from "moment"
import { MdReviews } from "react-icons/md"
import Stars from "./Stars"
import Loading from "./Loading"
import { buyListing } from "../features/singleListing/singleListingSlice"
import { switchReviewModal } from "../features/review/reviewSlice"

const OfferBox = () => {
  const { user } = useSelector((store) => store.user)
  const { listing, isLoading } = useSelector((store) => store.singleListing)
  const dispatch = useDispatch()

  const handleBuyListing = () => {
    dispatch(buyListing(user._id))
  }

  const isParticipant = (userId) =>
    listing.status === "sold" &&
    (listing.createdBy.user === userId || listing.soldTo === userId)

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
          {/* <span>joined 5 years ago</span> */}
          <div className="row">
            <span>{follower} followers</span>
            <span>{following?.length} following</span>
          </div>
        </div>
      </div>
      {listing.status !== "sold" ? (
        <>
          <form>
            <input type="text" placeholder="$500" />
            <button className="btn btn-primary">make offer</button>
          </form>
          <button
            className="btn btn-primary btn-buy"
            onClick={handleBuyListing}
          >
            buy now
          </button>
        </>
      ) : (
        <>
          <button
            className="btn btn-secondary btn-sold"
            disabled={!isParticipant(user._id)}
          >
            {isParticipant(user._id) ? "sold - view chat" : "sold"}
          </button>
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
  ${tw`border-[1px] rounded-xl p-2 space-y-2 relative hidden lg:block`}

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
    ${tw`border-[1px] py-1 px-2 w-full rounded-lg`}
  }

  .btn-buy,
  .btn-sold {
    ${tw`w-full`}
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
