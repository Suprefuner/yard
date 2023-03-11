import { useSelector, useDispatch } from "react-redux"
import tw, { styled } from "twin.macro"
import { FiTrash } from "react-icons/fi"
import { removePhoto } from "../features/singleListing/singleListingSlice"
import { removeListingPhotoAtCloudinary } from "../features/singleListing/singleListingSlice"

// SUB-COMPONENT
const Image = ({ url, publicId, number, setUploadedPhotos }) => {
  const dispatch = useDispatch()

  const removePhotoFileAndState = (url, number) => {
    setUploadedPhotos((prev) => {
      // NUMBER - 1 = INDEX
      prev.splice(number - 1, 1)
      return prev
    })
    dispatch(removePhoto(url))
  }

  return (
    <ImageWrapper className="image-holder">
      <div
        className="tag"
        onClick={() => {
          // IF EDIT EXISTING LISTING, I NEED TO REMOVE THE PHOTO FROM CLOUDINARY TOO
          !url.startsWith("https")
            ? removePhotoFileAndState(url, number)
            : dispatch(removeListingPhotoAtCloudinary(publicId))
        }}
      >
        <span>{number}</span>
        <FiTrash className="icon" />
      </div>
      <img src={url} alt="listing photo" />
    </ImageWrapper>
  )
}

// MAIN-COMPONENT
const ImageList = ({ setUploadedPhotos }) => {
  const { listing } = useSelector((store) => store.singleListing)
  const { photos } = listing

  return (
    <Wrapper>
      {/* COVER PHOTO OR OTHER PHOTO */}
      {photos.map((photo, i) =>
        i === 0 ? (
          <div className="image-container" key={photo?.publicId}>
            <h4>cover</h4>
            <Image
              number={i + 1}
              url={photo?.url}
              publicId={photo?.publicId}
              setUploadedPhotos={setUploadedPhotos}
            />
          </div>
        ) : (
          <Image
            number={i + 1}
            key={i}
            url={photo?.url}
            publicId={photo?.publicId}
            setUploadedPhotos={setUploadedPhotos}
          />
        )
      )}
    </Wrapper>
  )
}

const ImageWrapper = styled.div`
  ${tw`relative rounded-md overflow-hidden`}

  .tag {
    ${tw`
        absolute top-0.5 left-0.5 w-3 aspect-square rounded-full
        text-white text-center [line-height: 3rem] bg-black/40  
        cursor-pointer
      `}

    &:hover span {
      ${tw`opacity-0`}
    }

    &:hover .icon {
      ${tw`opacity-100`}
    }

    .icon {
      ${tw`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0`}
    }
  }
`

const Wrapper = styled.div`
  ${tw`
    grid grid-cols-4 items-end gap-1 max-w-[calc(100vw - 4rem)]
    lg:(grid-cols-3 max-w-[var(--upload-image-container-width)]) 
    select-none
  `}

  .image-container {
    ${tw`p-0.5 bg-trinary rounded-lg`}

    h4 {
      ${tw`text-white text-center mb-0.5`}
    }

    .image-holder {
      ${tw`relative rounded-md overflow-hidden`}
    }
  }

  .image-holder {
    ${tw`aspect-square`}

    img {
      ${tw`object-cover w-full h-full`}
    }
  }
`

export default ImageList
