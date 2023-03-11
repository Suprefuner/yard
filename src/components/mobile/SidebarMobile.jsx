import { useSelector } from "react-redux"
import tw, { styled } from "twin.macro"
import { navLinks } from "../../utils/links"
import SidebarItemMobile from "./SidebarItemMobile"

const SidebarMobile = () => {
  const { isMobileSidebarShow } = useSelector((store) => store.general)

  return (
    // <Wrapper className="">
    <Wrapper className={!isMobileSidebarShow ? "hide" : ""}>
      <h2>categories</h2>
      <ul className="nav-list">
        {navLinks.map((link, i) => (
          <SidebarItemMobile key={i} {...link} />
        ))}
      </ul>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`
    h-[calc(100vh - 65px - 44px)] w-[70%] bg-slate-100  z-30 
    overflow-scroll lg:hidden
    fixed top-[64px] left-0
    transition duration-200 
  `}

  &.hide {
    ${tw`-translate-x-full`}
  }

  h2 {
    ${tw`px-2.5 pt-2 pb-1.5 font-bold capitalize`}
  }

  .nav-list {
    ${tw`divide-y divide-slate-200`}
  }
`

export default SidebarMobile
