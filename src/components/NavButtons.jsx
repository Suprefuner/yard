import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import tw, { styled } from "twin.macro"
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaRegCommentDots,
} from "react-icons/fa"
import { openAuthModal } from "../features/user/userSlice"
import { logoutUser } from "../features/user/userSlice"

const NavButtons = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const { favoriteList } = useSelector((store) => store.favorite)
  const { user } = useSelector((store) => store.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (!showProfileMenu) return

    // CLICK ANYWHERE ELSE TO HIDE THE PROFILE MENU
    const handleClick = (e) => {
      if (!e.target.closest("ul")) setShowProfileMenu(false)
    }

    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [showProfileMenu])

  return (
    <Wrapper>
      {user?._id ? (
        <>
          <li
            className="profile"
            onClick={() => setShowProfileMenu((prev) => !prev)}
          >
            <div>
              <div className="user-photo-container">
                <img
                  src={user?.photo?.url}
                  alt="user profile picture"
                  className="user-photo"
                />
              </div>
              <span>Hello, {user?.username}</span>
            </div>
            {showProfileMenu && (
              <ul>
                <li>
                  <Link to="/profile">profile</Link>
                </li>
                <li>
                  <Link to="/profile/edit">setting</Link>
                </li>
                <li
                  onClick={() => {
                    dispatch(logoutUser())
                    navigate("/")
                  }}
                >
                  logout
                </li>
              </ul>
            )}
          </li>
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
              {/* FIXME FIX AFTER IMPLEMENT CHAT ROOM */}
              <span className="notification">5</span>
              {/* <FaRegCommentDots /> */}
            </Link>
          </li>
        </>
      ) : (
        <>
          <li onClick={() => dispatch(openAuthModal("register"))}>Register</li>
          <li onClick={() => dispatch(openAuthModal("login"))}>Login</li>
        </>
      )}

      <li>
        <Link to="/create-listing">
          <button className="btn btn-primary">sell</button>
        </Link>
      </li>
    </Wrapper>
  )
}

const Wrapper = styled.ul`
  ${tw`text-white  space-x-2`}

  li {
    ${tw`relative cursor-pointer`}

    &:first-child > * {
      ${tw`first:flex items-center gap-1`}
    }
  }

  .profile {
    & > ul {
      ${tw`
        bg-white text-center text-black  border rounded-xl overflow-hidden
        absolute bottom-0 left-1/2 translate-y-[calc(100% + 1rem)] -translate-x-1/2 shadow-md shadow-black/5
      `}

      li {
        ${tw`hover:bg-gray-200 transition duration-200 capitalize`}

        &:last-child, &>* {
          ${tw`w-full inline-block py-1 px-4 `}
        }
      }
    }
  }

  .user-photo-container {
    ${tw`w-3.5 aspect-square rounded-full border-2 border-green-400`}

    .user-photo {
      ${tw`w-full h-full object-cover rounded-full`}
    }
  }

  .icon {
    ${tw`text-[2.3rem]`}
  }

  .notification {
    ${tw`
      absolute -right-1 -top-1.5 bg-red-500 inline-block w-2.5 aspect-square rounded-full text-center leading-[2.5rem]
    `}
  }
`

export default NavButtons
