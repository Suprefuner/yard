import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Outlet, useParams, NavLink } from "react-router-dom"
import tw, { styled } from "twin.macro"
import { UserInfo } from "../components"
import { UserInfoMobile } from "../components/mobile"
import { updateSearchboxInView } from "../features/general/generalSlice"
import { getUser } from "../features/user/userSlice"
import { isDesktop } from "../utils/helpers"

const ProfilePageShareLayout = () => {
  const { user, otherUser } = useSelector((store) => store.user)
  const { userId } = useParams()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(updateSearchboxInView(true))
    // if userId exist means we trying to get other user's data
    if (!userId) return
    dispatch(getUser(userId))
  }, [])

  return (
    <Wrapper>
      {!isDesktop() && <UserInfoMobile />}
      <div className="container">
        {userId ? <UserInfo {...otherUser} /> : <UserInfo {...user} />}
        <main className="content">
          <div className="header">
            <NavLink
              to={`/profile${userId ? `/${userId}` : ""}`}
              end
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <div className="link">listing</div>
            </NavLink>
            <NavLink
              to={`/profile/reviews${userId ? `/${userId}` : ""}`}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <div className="link">reviews</div>
            </NavLink>
            {!userId && (
              <NavLink
                to="/profile/edit"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <div className="link">edit</div>
              </NavLink>
            )}
          </div>
          <Outlet />
        </main>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`min-h-screen`}

  .container {
    ${tw`lg:(pt-[calc(75px + 3rem)] flex gap-10)`}
    /* 
      =========================================
      CONTENT
      =========================================
    */
    .content {
      ${tw`pt-3 w-full`}

      & > .header {
        ${tw`
          grid grid-cols-3 relative border-b -mx-2
          lg:(flex text-xl mx-0  border-secondary)
          `}

        & > * {
          ${tw`
            py-1 text-center relative lg:px-3 transition-all duration-150
            after:(bg-secondary text-white absolute inset-0 -z-10 max-h-0)
          `}

          &.active {
            ${tw`
              text-white after:(max-h-[100%])
              `}
          }
        }

        .navlink {
          ${tw`bg-trinary h-1 w-5 rounded-full absolute -bottom-0.5 left-0`}
        }
      }
    }
  }
`
export default ProfilePageShareLayout
