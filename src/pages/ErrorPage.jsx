import tw, { styled } from "twin.macro"
import image from "../assets/error-page-illustration.png"
import { Link } from "react-router-dom"
import { navLinks } from "../utils/links"

const ErrorPage = () => {
  return (
    <Wrapper>
      <div className="container">
        <div>
          <img src={image} alt="not found this page illustration" />
          <div>
            <div className="text">
              <h2>oops!</h2>
              <p>Can't find the page you're looking for</p>
              <p>Here are some helpful links instead</p>
            </div>
            <ul>
              {navLinks.map(({ id, text, url }) => (
                <li key={id}>
                  <Link to={url} className="btn btn-trinary">
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  .container {
    ${tw`
      pt-[calc(var(--navbar-mobile-size))] pb-10 space-y-2 
      lg:(pt-[calc(var(--navbar-size) + 5rem)] grid place-content-center space-y-3)
    `}

    &>* {
      ${tw`relative`}
    }

    & > * > *:last-child {
      ${tw`lg:(absolute left-10 top-1/2 -translate-y-1/2)`}
    }

    .text {
      ${tw`mb-2 text-center lg:text-left`}

      h2 {
        ${tw`text-5xl uppercase font-semibold`}
      }

      p {
        ${tw`text-[1.8rem] lg:text-xl`}
      }
    }

    img {
      ${tw`border-2 -translate-x-3 lg:translate-x-[14rem]`}
    }

    ul {
      ${tw`grid grid-cols-2 gap-2`}

      .btn {
        ${tw`inline-block w-full py-[1.3rem]`}
      }
    }
  }
`
export default ErrorPage
