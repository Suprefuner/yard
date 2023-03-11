import tw, { styled } from "twin.macro"
import { Stars } from "../components"
import moment from "moment"

const ReviewCard = ({ createdBy, listing, content }) => {
  const { name: listingName, price, photos } = listing
  const listingCoverPhoto = photos[0]
  const {
    photo: userPhoto,
    username,
    rating,
    numOfReviews,
    createdAt,
  } = createdBy

  return (
    <Wrapper>
      <div className="col">
        <div className="photo-container">
          <img src={userPhoto.url} alt="user photo" />
        </div>
      </div>
      <div className="col">
        <div className="user-information">
          <div className="row">
            <h3>{username}</h3>
            <span className="createdBy">
              {moment(createdAt, "YYYYMMDD").fromNow()}
            </span>
          </div>
          <div className="row">
            <span>{+rating.toFixed(1)}</span>
            <Stars rating={rating} />
            <span>{numOfReviews} reviews</span>
          </div>
        </div>
        <div className="comment line-clamp-2">{content}</div>
        <div className="review-listing-information">
          <div className="image">
            <img src={listingCoverPhoto.url} alt="bag" />
          </div>
          <div className="details">
            <h4>{listingName}</h4>
            <h4>
              {price.toLocaleString("zh-HK", {
                style: "currency",
                currency: "HKD",
              })}
            </h4>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`flex border p-1.5 text-sm`}

  .col {
    ${tw`first:(border-r pr-1) last:(px-1.5 grow)`}
  }

  .photo-container {
    ${tw`rounded-full overflow-hidden w-5 lg:w-7`}
  }

  .user-information {
    .row {
      ${tw`flex items-center`}

      &:nth-child(2) {
        ${tw`gap-[0.75rem]`}
      }
    }

    h3 {
      ${tw`text-xl -translate-y-[3px] mr-1`}
    }

    .createdBy {
      ${tw`text-sm -translate-y-[2px]`}
    }
  }

  .comment {
    ${tw` text-[14px] mt-1 mb-0.5`}
  }

  .review-listing-information {
    ${tw`bg-gray-200 flex p-1 gap-1.5 items-center text-sm`}

    .image {
      ${tw`w-10 h-8 border-2 overflow-hidden`}

      img {
        ${tw`w-full h-full object-cover`}
      }
    }
  }
`

export default ReviewCard
