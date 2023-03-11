import { useSelector, useDispatch } from "react-redux"
import tw, { styled } from "twin.macro"
import { IoMdClose } from "react-icons/io"
import logo from "../assets/yard_full_logo.svg"
import AuthForm from "./AuthForm"
import AuthMessage from "./AuthMessage"
import { closeAuthModal } from "../features/user/userSlice"

const AuthFormModal = () => {
  const { isModalMessageShow, messageType } = useSelector((store) => store.user)
  const dispatch = useDispatch()

  return (
    <Wrapper>
      <div className="backdrop">
        <div className="header">
          <img src={logo} alt="logo" />
          <IoMdClose
            className="close-btn"
            onClick={() => dispatch(closeAuthModal())}
          />
        </div>
        {isModalMessageShow ? <AuthMessage type={messageType} /> : <AuthForm />}
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  ${tw`
    min-h-screen w-full bg-black/50 fixed z-50 
    grid place-content-center 
  `}

  &>* {
    ${tw`w-[43rem] bg-white`}

    .header {
      ${tw`
        p-2 flex items-center justify-between 
        text-white text-3xl bg-secondary 
      `}
      img {
        ${tw`w-[12rem] brightness-0 invert`}
      }

      .close-btn {
        ${tw`cursor-pointer`}
      }
    }
  }
`
export default AuthFormModal
