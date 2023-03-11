import { Link } from "react-router-dom"
import tw, { styled } from "twin.macro"
import logo from "../assets/yard_full_logo.svg"
import { navLinks } from "../utils/links"
import NavButtons from "./NavButtons"

const Navbar = () => {
  return (
    <Wrapper>
      <div className="container">
        <Link to="/" className="logo-container">
          <img src={logo} alt="company logo" className="logo" />
        </Link>
        <ul className="nav-list">
          {navLinks.map(({ text, url }, i) => (
            <li className="nav-item" key={i}>
              <Link
                to={`${text === "all" ? "" : "/category"}${url}`}
                className="nav-link"
              >
                {text}
              </Link>
            </li>
          ))}
        </ul>
        <NavButtons />
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.nav`
  ${tw`
    grid w-screen h-[var(--navbar-size)] bg-secondary fixed z-50
  `}

  .container {
    ${tw`flex gap-3`}

    & > * {
      ${tw`flex items-center`}
    }

    .logo-container {
      ${tw`w-9`}

      img {
        ${tw`w-full`}
      }
    }

    .nav-list {
      ${tw`mr-auto md:flex text-white capitalize`}

      li {
        ${tw`px-2`}
      }
    }
  }
`

export default Navbar
