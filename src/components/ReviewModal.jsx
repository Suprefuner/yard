import { useDispatch, useSelector } from "react-redux"
import tw, { styled } from "twin.macro"
import { IoMdClose } from "react-icons/io"
import logo from "../assets/yard_full_logo.svg"
import ReviewForm from "./ReviewForm"
import { switchReviewModal } from "../features/review/reviewSlice"

const ReviewModal = () => {
  const dispatch = useDispatch()

  const handleClose = () => {
    dispatch(switchReviewModal(false))
  }

  return (
    <Wrapper>
      <div>
        <div className="header">
          <img src={logo} alt="logo" />
          <IoMdClose className="close-btn" onClick={handleClose} />
        </div>
        <ReviewForm />
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`
    min-h-screen w-full bg-black/50 fixed z-50 
    grid place-content-center 
  `}

  &>* {
    ${tw`w-[clamp(50rem, 70vw, 70rem)] bg-white`}

    .header {
      ${tw`bg-secondary p-2 flex items-center justify-between text-white text-3xl`}

      img {
        ${tw`w-[12rem] brightness-0 invert`}
      }

      .close-btn {
        ${tw`cursor-pointer`}
      }
    }
  }
`
export default ReviewModal
