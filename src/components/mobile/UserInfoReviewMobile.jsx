import { useSelector } from "react-redux"
import tw, { styled } from "twin.macro"
import Stars from "../Stars"
import moment from "moment"

const UserInfoReviewMobile = ({
  rating,
  numOfReviews,
  createdAt,
  photo,
  follower,
  following,
}) => {
  return (
    <Wrapper>
      <div className="photo-container">
        <img src={photo?.url} alt="user photo" className="user-photo" />
      </div>
      <div className="user-detail">
        <div className="row">
          <span>{rating?.toFixed(1)}</span>
          <Stars />
          <span>
            {numOfReviews} {numOfReviews > 1 ? "reviews" : "review"}
          </span>
        </div>
        <span>joined {moment(createdAt, "YYYYMMDD").fromNow()}</span>
        <div className="row">
          <span>
            {follower} {follower > 1 ? "followers" : "follower"}
          </span>
          <span>{following?.length} following</span>
        </div>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`flex items-center gap-2`}

  .photo-container {
    ${tw`w-[8rem] aspect-square rounded-full border-white bg-white`}

    &>* {
      ${tw`w-full h-full object-cover rounded-full`}
    }
  }

  .user-detail {
    ${tw`text-sm `}

    .row {
      ${tw`flex gap-0.5 leading-10`}
    }
  }
`
export default UserInfoReviewMobile
