import { useRef } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import tw, { styled } from "twin.macro"
import { AiOutlineSearch } from "react-icons/ai"
import { updateFilter } from "../features/filter/filterSlice"

const Searchbox = ({ outline }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const searchRef = useRef("")

  const handleSubmit = (e) => {
    e.preventDefault()
    const { value } = searchRef.current
    dispatch(updateFilter({ name: "search", value }))
    navigate(`/listing?search=${value}`)
  }

  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        <AiOutlineSearch className="icon" />
        <input
          type="text"
          placeholder="Search something"
          className={`${outline === "none" && "focus:outline-none"}`}
          ref={searchRef}
        />
        <button className="btn btn-trinary">Search</button>
      </form>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`hidden lg:block`}

  form {
    ${tw`relative`}
  }

  .icon {
    ${tw`absolute left-1 top-1/2 -translate-y-1/2 text-trinary text-2xl`}
  }

  input {
    ${tw`rounded-lg py-1 pl-5 bg-gray-100 w-full focus:outline-offset-4 outline-trinary/50`}
  }

  button {
    ${tw`absolute right-[0.75rem] top-1/2 -translate-y-1/2`}
  }
`
export default Searchbox
