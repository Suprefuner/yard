import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import tw, { styled } from "twin.macro"
import { BsChevronDoubleDown } from "react-icons/bs"
import { UploadImage, CreateListingForm, ImageList } from "../components"
import { updateSearchboxInView } from "../features/general/generalSlice"

const CreateListingPage = () => {
  // AT LEAST UPLOAD 1 PHOTO TO SHOW THE CREATE LISTING FORM
  const [showForm, setShowForm] = useState(false)
  // STORE IMAGE AS FILE TO UPLOAD TO CLOUDINARY
  const [uploadedPhotos, setUploadedPhotos] = useState([])
  const { createSuccess } = useSelector((store) => store.singleListing)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(updateSearchboxInView(true))
  }, [])

  // upload at least 1 photo to show the form
  useEffect(() => {
    setShowForm(!uploadedPhotos.length > 0)
  }, [uploadedPhotos])

  // REDIRECT TO PROFILE LISTING PAGE AFTER CREATING NEW LISTING
  useEffect(() => {
    if (!createSuccess) return
    navigate("/profile")
  }, [createSuccess])

  return (
    <Wrapper>
      <div className="container">
        <div className={`upload-image`}>
          <UploadImage state={showForm} setUploadedPhotos={setUploadedPhotos} />
          {!showForm && (
            <>
              <ImageList setUploadedPhotos={setUploadedPhotos} />
              <div className="icon-container">
                <BsChevronDoubleDown className="icon" />
              </div>
            </>
          )}
        </div>
        {!showForm && <CreateListingForm uploadedPhotos={uploadedPhotos} />}
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  ${tw`min-h-screen`}

  .container {
    ${tw`
      pt-[calc(var(--navbar-mobile-size))] pb-3 relative
      lg:(pt-[calc(var(--navbar-size) + 3rem)] flex gap-3)
    `}

    .upload-image {
      ${tw`
        mx-auto space-y-2 transition-transform duration-200 
        min-h-[calc(100vh - var(--navbar-mobile-size) - var(--footer-navbar-mobile-size) - 3rem)] 
      `}

      & > .icon-container {
        ${tw`
          absolute left-[calc(50% - 2rem)] top-[calc(73vh)]
          w-4 [aspect-ratio: 1/1.5] text-2xl text-secondary border-2 border-secondary rounded-full 
          grid place-items-center 
          lg:hidden
        `}

        .icon {
          ${tw`animate-bounce mt-1`}
        }
      }
    }
  }
`
export default CreateListingPage
