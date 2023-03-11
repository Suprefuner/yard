import tw, { styled } from "twin.macro"
import { useEffect, useState } from "react"
import { RiImageAddFill } from "react-icons/ri"
import { useSelector, useDispatch } from "react-redux"
import {
  uploadPhoto,
  clearSingleListing,
} from "../features/singleListing/singleListingSlice"
import { openAuthModal } from "../features/user/userSlice"
import { showImage } from "../utils/helpers"

const UploadImage = ({ state, setUploadedPhotos, photos, setPhotos }) => {
  const { user } = useSelector((store) => store.user)
  const [isDragOver, setIsDragOver] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(clearSingleListing())
  }, [])

  // UPDATE REDUX SINGLE LISTING WITH DATA URL
  useEffect(() => {
    dispatch(uploadPhoto(photos))
  }, [photos])

  /*
  ==================================================
  HANDLE DRAG AND DROP FUNCTION
  ==================================================
  */
  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    // NEED TO LOGIN TO CREATE LISTING
    if (!user._id) return dispatch(openAuthModal("login"))

    const files = [...e.dataTransfer.files]
    setUploadedPhotos((prev) => {
      let tempList = [...prev]

      files.forEach((file) => {
        tempList = [...tempList, file]
      })

      return tempList
    })

    setIsDragOver(false)
    // showImage(files, useDispatch().bind(uploadPhoto))
    showImage(files, setPhotos)
  }
  //==================================================
  const handleChange = (e) => {
    // NEED TO LOGIN TO CREATE LISTING
    if (!user._id) return dispatch(openAuthModal("login"))

    const files = [...e.target.files]

    setUploadedPhotos((prev) => {
      let tempList = [...prev]

      files.forEach((file) => {
        tempList = [...tempList, file]
      })

      return tempList
    })

    showImage(files, setPhotos)
    // MAKE ME CAN UPLOAD THE SAME PHOTO
    e.target.closest("form").reset()
  }

  return (
    <Wrapper className={state && "w-full transition"}>
      <form>
        <label htmlFor="upload-image">
          <div
            className={`
            drop-area 
            ${isDragOver && "active"} 
            ${state && "full"}
          `}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
          >
            <RiImageAddFill className="icon" />
            <div className="btn btn-secondary">select photos</div>
            <div className="text">
              <p>
                {isDragOver ? "release to upload image" : "or drag photos here"}
              </p>
              <span>(up to 10 photos)</span>
            </div>
            <input
              type="file"
              id="upload-image"
              multiple
              hidden
              onChange={handleChange}
            />
          </div>
        </label>
      </form>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`pt-3`}

  label {
    ${tw`block w-min mx-auto`}
  }

  .drop-area {
    ${tw`
        flex flex-col justify-center items-center gap-1
        transition-colors duration-300
        w-[calc(100vw - 4rem)] h-[20rem]
        lg:w-[var(--upload-image-container-width)] 
        bg-trinarylight/30 hover:bg-trinarylight/50 text-center
        border border-dashed border-secondary 
        rounded-xl relative cursor-pointer
      `}

    &.full {
      ${tw`lg:(w-[70vw] h-[40rem]) mx-auto`}
    }

    &.active {
      ${tw`border-2 border-secondary border-solid `}
    }

    .icon {
      ${tw`text-5xl`}
    }

    .btn {
      ${tw`w-max py-1`}
    }

    span {
      ${tw`text-sm text-gray-500`}
    }
  }
`

export default UploadImage
