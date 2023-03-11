import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import tw, { styled } from "twin.macro"
import { AuthForm, AuthMessage } from "../components"
import { isDesktop } from "../utils/helpers"

const AuthPage = () => {
  const { user, isModalMessageShow, messageType } = useSelector(
    (store) => store.user
  )
  const navigate = useNavigate()

  useEffect(() => {
    // REDIRECT TO HOME PAGE IF NO AUTH OR ON DESKTOP
    if (user._id || isDesktop()) navigate("/")
  }, [user])

  return (
    <Wrapper>
      {isModalMessageShow ? <AuthMessage type={messageType} /> : <AuthForm />}
    </Wrapper>
  )
}

const Wrapper = styled.main`
  ${tw`
      pt-[calc(var(--navbar-mobile-size) + 5rem)] 
      lg:pt-[calc(var(--navbar-size) + 3rem)] 
      mb-10 space-y-2 lg:space-y-3 relative
    `}
`
export default AuthPage
