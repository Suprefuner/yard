import tw, { styled } from "twin.macro"
import { BiHomeAlt } from "react-icons/bi"
import { BsPersonFill } from "react-icons/bs"
import { HiPlus } from "react-icons/hi"
import { Link } from "react-router-dom"
import { useSelector } from "react-redux"

const BottomNavbarMobile = () => {
  const { user } = useSelector((store) => store.user)

  return (
    <Wrapper>
      <div className="container">
        <button>
          <Link to="/">
            <BiHomeAlt className="icon" />
          </Link>
        </button>
        <button className="btn-mobile-main">
          <Link to="/create-listing">
            <HiPlus className="icon" />
          </Link>
        </button>
        <button>
          <Link to={user?._id ? "/profile" : "/auth"}>
            <BsPersonFill className="icon" />
          </Link>
        </button>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`
    lg:hidden fixed bottom-0 z-40 w-screen h-4.5 py-1 
    bg-secondary text-white
  `}

  .container {
    ${tw`flex items-center justify-center gap-x-[12rem]`}
  }

  .icon {
    ${tw`text-xl`}
  }

  .btn-mobile-main {
    ${tw`box-content bg-primary p-1.5 rounded-full absolute bottom-1 
    shadow-xl`}

    .icon {
      ${tw`text-3xl`}
    }
  }
`
export default BottomNavbarMobile
