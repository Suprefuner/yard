import { useState } from "react"
import tw, { styled } from "twin.macro"
import { BiChevronDown } from "react-icons/bi"
import { useNavigate } from "react-router-dom"
import { updateFilter } from "../../features/filter/filterSlice"
import { showMobileSidebar } from "../../features/general/generalSlice"
import { useDispatch } from "react-redux"

const SidebarItemMobile = ({ url, text, subLinks }) => {
  const [subMenuShow, setSubMenuShow] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleShowSubMenu = () => {
    setSubMenuShow((prev) => !prev)
  }

  const resetMenu = () => {
    dispatch(showMobileSidebar())
    setSubMenuShow(false)
  }

  const navigateToCategoryPage = () => {
    resetMenu()
    text === "all" ? navigate(`/listing`) : navigate(`/category${url}`)
  }

  const searchForCategoryListing = (link) => {
    resetMenu()
    navigate(`/listing?category=${link}`)
  }

  return (
    <Wrapper>
      <div className="main-link">
        <h3 onClick={navigateToCategoryPage}>{text}</h3>
        <div
          className={`icon-container ${
            (text === "all" || text === "car") && "hide"
          }`}
          onClick={handleShowSubMenu}
        >
          <BiChevronDown className={subMenuShow ? "icon up" : "icon"} />
        </div>
      </div>
      {subLinks && (
        <ul className={`sublinks ${subMenuShow && "show"}`}>
          {subLinks.map((link, i) => (
            <li
              key={i}
              onClick={() => searchForCategoryListing(link)}
              className={!subMenuShow ? "pointer-events-none" : ""}
            >
              {link}
            </li>
          ))}
        </ul>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.li`
  .main-link {
    ${tw`flex items-center justify-between pl-2.5 relative z-20`}
    h3 {
      ${tw`w-full h-full p-1`}
    }
  }

  .icon-container {
    ${tw`p-1.5 relative z-10`}

    &.hide {
      ${tw`text-transparent select-none pointer-events-none`}
    }

    & > * {
      ${tw`transition duration-150`}

      &.up {
        ${tw`-rotate-180`}
      }
    }
  }

  .sublinks {
    ${tw`
      max-h-0 pl-2.5 text-[1.4rem] 
      opacity-0 bg-slate-200 border-t border-t-transparent
      transition-[max-height] duration-150 
    `}

    &.show {
      ${tw`max-h-[200px] opacity-100 border-t-gray-300`}
    }

    li {
      ${tw`p-1 py-1.5`}
    }
  }
`
export default SidebarItemMobile
