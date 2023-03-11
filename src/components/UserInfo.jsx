import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import tw, { styled } from "twin.macro"
import { BiEditAlt } from "react-icons/bi"
import { TiTick, TiTimes } from "react-icons/ti"
import moment from "moment"
import Stars from "./Stars"
import { updateProfilePhoto, followUser } from "../features/user/userSlice"
import { showImage } from "../utils/helpers"

const defaultPhoto =
  "https://res.cloudinary.com/dytia9net/image/upload/v1676530550/user-photo/default-user_gtlhqu.jpg"

const UserInfo = ({
  _id,
  username,
  rating,
  numOfReviews,
  createdAt,
  photo,
  following,
  follower,
}) => {
  const [photoInDataURL, setPhotoInDataURL] = useState(defaultPhoto)
  // STORE IMAGE IN <FILE> FORMAT
  const [updatePhoto, setUpdatePhoto] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  const { user, canEdit } = useSelector((store) => store.user)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!updatePhoto) return setIsEdit(false)
    setIsEdit(true)
  }, [updatePhoto])

  const confirmChange = (e) => {
    e.preventDefault()
    let formDate = new FormData()
    formDate.set("photo", updatePhoto)
    dispatch(updateProfilePhoto(formDate))

    // delay for upload image to cloudinary, prevent showing the old image
    setTimeout(() => {
      setIsEdit(false)
    }, 1000)
  }

  const cancelChange = () => {
    setPhotoInDataURL(photo?.url)
    setIsEdit(false)
  }

  const handleChange = (e) => {
    const file = e.target.files[0]
    setUpdatePhoto(file)
    showImage(file, setPhotoInDataURL)
    e.target.parentNode.reset()
  }

  const isFollowing = () => {
    return user?.following?.includes(_id)
  }

  const handleFollowUser = () => {
    isFollowing()
      ? dispatch(followUser({ id: _id }))
      : dispatch(followUser({ id: _id, type: "follow" }))
  }

  return (
    <Wrapper className="user-information">
      <Link to={`/profile/${_id}`}>
        <div className="photo-container">
          <img
            src={isEdit ? photoInDataURL.url : photo?.url}
            alt="user photo"
            className="user-photo"
          />
          {canEdit && (
            <form onSubmit={confirmChange}>
              <label htmlFor="upload-photo" className="edit-btn">
                <BiEditAlt />
              </label>
              <input
                type="file"
                id="upload-photo"
                hidden
                onChange={handleChange}
                multiple
                accept="image/*"
              />
              <button className={`confirm-btn icon-holder ${isEdit && "show"}`}>
                <TiTick />
              </button>
              <button
                type="button"
                className={`cancel-btn icon-holder ${isEdit && "show"}`}
                onClick={cancelChange}
              >
                <TiTimes />
              </button>
            </form>
          )}
        </div>
        <div className="user-detail">
          <h3>{username}</h3>
          <div className="row">
            <span>{rating?.toFixed(1)}</span>
            <Stars rating={rating} />
            <span>{numOfReviews} reviews</span>
          </div>
          <span>{moment(createdAt, "YYYYMMDD").fromNow()}</span>
          <div className="row follower-row">
            <span>{follower || 0} followers</span>
            <span>{following?.length || 0} following</span>
          </div>
        </div>
      </Link>
      {_id !== user._id && (
        <div
          className={`btn btn-secondary btn-follow ${
            user?.following?.includes(_id) && "following"
          }`}
          onClick={handleFollowUser}
        >
          {!user?.following?.includes(_id) ? "follow" : "following"}
        </div>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`hidden lg:block`}

  .photo-container {
    ${tw`w-[200px] aspect-square rounded-full relative`}

    img {
      ${tw`w-full h-full object-cover rounded-full`}
    }

    .edit-btn,
    .icon-holder {
      ${tw`
        flex justify-center items-center 
        aspect-square text-white
        transition-all duration-200 rounded-full 
        absolute cursor-pointer
      `}
    }

    .edit-btn {
      ${tw`
        w-5 text-2xl bg-slate-800 hover:bg-teal-600
        border-4  border-white
        right-0 bottom-1 z-10
      `}
    }

    .icon-holder {
      ${tw` w-2.5 text-md `}

      &.confirm-btn {
        ${tw`bg-green-500 hover:bg-green-700 right-1 bottom-1.5 `}

        &.show {
          ${tw` -right-1.5 bottom-5.5 `}
        }
      }

      &.cancel-btn {
        ${tw`bg-red-500 hover:bg-red-700 right-1 bottom-1.5 `}
        &.show {
          ${tw` -right-3 bottom-3 `}
        }
      }
    }
  }

  .user-detail {
    ${tw`text-sm mt-2 grid place-content-center`}

    .row {
      ${tw`flex items-center gap-0.5 leading-10`}
    }

    .follower-row {
      ${tw`mt-3`}
    }

    .btn {
      ${tw`mt-1 text-base relative z-30`}
    }

    h3 {
      ${tw`text-xl font-semibold`}
    }
  }

  .btn-follow {
    ${tw`mt-0.5 mx-2`}

    &.following {
      ${tw`bg-green-400 text-secondary`}
    }
  }
`
export default UserInfo
