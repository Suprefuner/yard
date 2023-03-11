import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import tw, { styled } from "twin.macro"
import { BsChevronDoubleDown } from "react-icons/bs"
import { UploadImage, ImageList, CreateListingForm } from "../components"
import { turnOffIsUpdate } from "../features/singleListing/singleListingSlice"

const EditListingPage = () => {
  // STORE IMAGE AS FILE TO UPLOAD TO CLOUDINARY
  const [uploadedPhotos, setUploadedPhotos] = useState([])
  const { listing, isUpdate } = useSelector((store) => store.singleListing)
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isUpdate) return
    dispatch(turnOffIsUpdate())
    navigate(`/listing/${id}`)
  }, [listing])

  // useEffect(() => {
  //   if (!isUpdate) return
  //   navigate("/profile")
  // }, [isUpdate])

  return (
    <Wrapper>
      <div className="container">
        <div className={`upload-image`}>
          <UploadImage setUploadedPhotos={setUploadedPhotos} />
          <ImageList setUploadedPhotos={setUploadedPhotos} />
          <div className="icon-container">
            <BsChevronDoubleDown className="icon" />
          </div>
        </div>
        <CreateListingForm uploadedPhotos={uploadedPhotos} />
      </div>
    </Wrapper>
  )
}
const Wrapper = styled.div`
  ${tw`min-h-screen`}

  .container {
    ${tw`
      pt-[calc(var(--navbar-mobile-size))] pb-3 relative
      lg:(pt-[calc(var(--navbar-size) + 3rem)] flex gap-3 )
    `}

    .upload-image {
      ${tw`
        mx-auto space-y-2 transition-transform duration-200 
        min-h-[calc(100vh - var(--navbar-mobile-size) - var(--footer-navbar-mobile-size) - 3rem)] 
      `}

      button {
        ${tw`
          lg:hidden py-1 px-3 w-full mt-3
        `}
      }

      & > .icon-container {
        ${tw`
          lg:hidden absolute left-[calc(50% - 2rem)] top-[calc(73vh)]
          w-4 [aspect-ratio: 1/1.5] text-2xl text-secondary border-2 border-secondary rounded-full 
          grid place-items-center 
        `}

        .icon {
          ${tw`animate-bounce mt-1`}
        }
      }
    }
  }
`

export default EditListingPage
