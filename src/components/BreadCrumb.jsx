import { Link } from "react-router-dom"
import tw, { styled } from "twin.macro"

const BreadCrumb = ({ lastPage, currentPage }) => {
  const { title, url } = lastPage

  return (
    <Wrapper>
      <Link to={url}>{title}</Link> /{" "}
      <span className="current">{currentPage}</span>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`text-sm text-slate-500 capitalize`}

  .current {
    ${tw`font-semibold text-slate-800`}
  }
`
export default BreadCrumb
