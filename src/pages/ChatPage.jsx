// WILL IMPLEMENT CHAT ROOM FUNCTION LATER
import tw, { styled } from "twin.macro"

const ChatPage = () => {
  return (
    <Wrapper>
      <div className="container">ChatPage</div>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  .container {
    ${tw`
      pt-[calc(var(--navbar-mobile-size) + 5rem)] 
      lg:pt-[calc(var(--navbar-size) + 3rem)] 
    `}
  }
`
export default ChatPage
