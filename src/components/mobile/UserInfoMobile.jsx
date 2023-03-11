import { useDispatch, useSelector } from "react-redux"
import tw, { styled } from "twin.macro"
import Stars from "../Stars"
import moment from "moment"
import { TbLogout } from "react-icons/tb"
import { logoutUser } from "../../features/user/userSlice"
import { useNavigate } from "react-router-dom"

const UserInfoMobile = () => {
  const { user, isLoading } = useSelector((store) => store.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate("/")
  }

  if (isLoading) {
    return <h1>Loading...</h1>
  }

  const {
    username,
    rating,
    numOfReviews,
    createdAt,
    follower,
    following,
    photo,
  } = user

  return (
    <Wrapper>
      <div className="header">
        <h3>{username}</h3>
      </div>
      <div className="container">
        <div className="photo-container">
          <img src={photo.url} alt="user photo" className="user-photo" />
          <div className="icon-container">
            <TbLogout className="icon" onClick={handleLogout} />
          </div>
        </div>
        <div className="user-detail">
          <div className="row">
            <span>{rating?.toFixed(1)}</span>
            <Stars />
            <span>
              {numOfReviews} {numOfReviews > 1 ? "reviews" : "review"}
            </span>
          </div>
          {/* <span>joined 5 years ago</span> */}
          <span>joined {moment(createdAt, "YYYYMMDD").fromNow()}</span>
          <div className="row">
            <span>
              {follower} {follower > 1 ? "followers" : "follower"}
            </span>
            <span>{following?.length} following</span>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  --navbar-height: 64px;
  ${tw`pt-[var(--navbar-height)]`}

  .header {
    ${tw`
      bg-secondary/90 py-3 text-white font-semibold text-2xl text-center tracking-wider uppercase
    `}
  }

  .container {
    ${tw`flex items-center gap-2`}
  }

  .photo-container {
    ${tw`w-[13rem] aspect-square rounded-full -mt-4 border-4 border-white bg-white relative`}

    &>img {
      ${tw`w-full h-full object-cover rounded-full`}
    }

    .icon-container {
      ${tw`w-4 aspect-square bg-green-400 rounded-full grid place-items-center text-md absolute -bottom-0.5 -right-0.5 text-secondary border-4 border-white`}
    }
  }

  .user-detail {
    ${tw`text-sm `}

    .row {
      ${tw`flex gap-0.5 leading-10`}
    }

    h3 {
      ${tw`text-xl font-semibold`}
    }
  }
`
export default UserInfoMobile
