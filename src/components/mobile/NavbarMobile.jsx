import tw, { styled } from "twin.macro"
import { HiMenuAlt2 } from "react-icons/hi"
import { FaHeart, FaRegHeart, FaRegComment } from "react-icons/fa"
import SearchboxMobile from "./SearchboxMobile"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { showMobileSidebar } from "../../features/general/generalSlice"

const NavbarMobile = () => {
  const { user } = useSelector((store) => store.user)
  const { favoriteList } = useSelector((store) => store.favorite)
  const dispatch = useDispatch()

  const toggleSidebar = () => dispatch(showMobileSidebar())

  return (
    <Wrapper>
      <div className="container">
        <div className="menu-btn">
          <HiMenuAlt2 className="icon" onClick={toggleSidebar} />
        </div>
        <SearchboxMobile />
        <ul className="feature-list">
          <li>
            <Link to="/favorite">
              {favoriteList.length === 0 ? (
                <FaRegHeart className="icon" />
              ) : (
                <FaHeart className="icon" />
              )}
            </Link>
          </li>
          <li>
            <Link to="/chat">
              <FaRegComment className="icon" />
              {user?.numOfUnreadMessages !== 0 && (
                <span className="notification">
                  {user?.numOfUnreadMessages}
                </span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.nav`
  ${tw`
    lg:hidden py-1.5 
    bg-secondary text-white 
    fixed top-0 z-50 w-screen
  `}

  .container {
    ${tw`flex items-center justify-between px-2`}
  }

  .icon {
    ${tw`text-2xl`}
  }

  .user-photo-container {
    ${tw`w-3.5 rounded-full border-2 border-green-400`}

    .user-photo {
      ${tw` rounded-full`}
    }
  }

  .feature-list {
    ${tw`flex items-center space-x-1`}

    li {
      position: relative;
    }

    .notification {
      ${tw`
          absolute -right-1 -top-1.5 bg-red-500 inline-block w-2.5 aspect-square rounded-full
          text-center leading-[2.5rem]
        `}
    }
  }
`
export default NavbarMobile
