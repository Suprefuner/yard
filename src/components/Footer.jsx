import { Link } from "react-router-dom"
import tw, { styled } from "twin.macro"
import logo from "../assets/yard_full_logo.svg"
import { socialMediaIcons, footerLinks, navLinks } from "../utils/links"

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <Wrapper>
      <div className="container">
        <div className="col">
          <div className="logo-container">
            <img src={logo} alt="company logo" />
          </div>
          <div className="social-media-group">
            {socialMediaIcons.map(({ url, icon }, i) => (
              <a href={url} className="icon" key={i + "a"} target="_blank">
                {icon}
              </a>
            ))}
          </div>
        </div>
        <div className="col">
          <ul className="nav-list">
            {footerLinks.map(({ url, text }, i) => (
              <li key={i}>
                <Link to={url}>{text}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col">
          <ul className="nav-list">
            {navLinks.map(({ url, text }, i) => (
              <li key={i}>
                <Link to={`category${url}`}>{text}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="col">
          <span>stay up date on the latest from us</span>
          <form>
            <input type="text" />
            <button className="btn btn-secondary">send</button>
          </form>
        </div>
        <div className="copyright">
          <span>yard</span> &copy; {year} all right reserved
        </div>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.footer`
  ${tw`hidden lg:block`}

  .container {
    ${tw`grid [grid-template-columns: 2fr 1fr 1fr 2fr]  gap-2 border-t-[1px] py-3 text-[14px]`}

    .col {
      &:first-child > * {
        ${tw`mx-auto`}
      }
    }

    ul {
      ${tw`space-y-0.5 capitalize`}
    }

    .logo-container {
      ${tw`w-[150px] mb-1.5`}
    }

    .social-media-group {
      ${tw`flex justify-center gap-2`}

      a {
        ${tw`
          w-5 aspect-square bg-secondary text-white rounded-full
          grid place-items-center text-base
        `}
      }
    }

    form {
      ${tw`space-y-1 mt-1`}
    }

    input {
      ${tw`border-[1px] w-full p-1 outline-offset-4 outline-secondary/50`}
    }

    .copyright {
      ${tw`row-start-2 col-span-6 text-center pt-7 pb-1`}

      span {
        ${tw`text-primary font-semibold`}
      }
    }
  }
`
export default Footer
