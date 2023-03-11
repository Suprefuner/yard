import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import tw, { styled } from "twin.macro"
import { AiOutlineSearch } from "react-icons/ai"
import { updateFilter } from "../../features/filter/filterSlice"
import { showMobileSidebar } from "../../features/general/generalSlice"

const SearchboxMobile = () => {
  const [searchValue, setSearchValue] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!searchValue) return
    dispatch(showMobileSidebar(false))
    dispatch(updateFilter({ name: "search", value: searchValue }))
    navigate(`/listing?search=${searchValue}`)
  }

  const handleChange = (e) => {
    const { value } = e.target
    setSearchValue(value)
  }

  return (
    <Wrapper>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search something"
          value={searchValue}
          onChange={handleChange}
        />
        <button>
          <AiOutlineSearch />
        </button>
      </form>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  form {
    ${tw`relative`}
  }

  input {
    ${tw`rounded-lg py-0.5 px-1 text-black `}
  }

  button {
    ${tw`
      bg-primary w-2.5 aspect-square
      flex items-center justify-center
      absolute right-0.5 top-[50%] translate-y-[-50%]
      rounded-md
    `}
  }
`
export default SearchboxMobile
