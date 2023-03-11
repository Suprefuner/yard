import tw, { styled } from "twin.macro"
import { FaTelegramPlane } from "react-icons/fa"

const AuthMessage = ({ type }) => {
  return (
    <Wrapper>
      <p>
        {type} email sent, please check your email to finishing the registration
      </p>
      <FaTelegramPlane className="icon" />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`grid place-items-center py-2 px-4 h-[20rem] `}

  p {
    ${tw`text-[18px] text-center`}
  }

  .icon {
    ${tw`text-[6rem] translate-y-3 lg:(text-[5rem] translate-y-0)`}
  }
`
export default AuthMessage
