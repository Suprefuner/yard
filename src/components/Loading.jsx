import tw, { styled } from "twin.macro"
import logo from "../assets/yard_small-logo.svg"

const Loading = () => {
  return (
    <Wrapper>
      <div className="loading-container">
        <div className="loading"></div>
        <img src={logo} alt="company logo" />
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`w-full h-screen relative`}

  .loading-container {
    ${tw`w-8 aspect-square mx-auto translate-y-[clamp(10rem, 30vh, 30rem)] relative`}
  }

  .loading {
    ${tw`w-full h-full rounded-full border-[6px] border-r-primary animate-spin`}
  }

  img {
    ${tw`w-3.5 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%]`}
  }
`
export default Loading
