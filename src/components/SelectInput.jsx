import { useState } from "react"
import tw, { styled } from "twin.macro"
import { BiChevronDown } from "react-icons/bi"
import { showOptions } from "../features/filter/filterSlice"
import { useDispatch, useSelector } from "react-redux"

// SHARE USE WITH CREATE LISTING FORM SO ADDED TYPE PARAMS
const SelectInput = ({
  name,
  category,
  handleChange,
  links,
  type = "filter",
}) => {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false)
  // CONNECT OPTION AND LI VALUE =============================
  const [options, setOptions] = useState([])
  const [selectedOption, setSelectedOption] = useState(category)
  // ========================================================
  const { filters, filtersOptionsShow } = useSelector((store) => store.filter)
  const dispatch = useDispatch()

  const workingLinks =
    // DON'T PUT "ALL" TO SORT OPTION LIST
    type === "filter" && name !== "sort" ? ["all", ...links] : [...links]

  const handleSelectOption = () => {}

  return (
    <Wrapper>
      <div className="select-container">
        <select
          name={name}
          id={name}
          // OPTIONS SHOW ON MOUSEDOWN EVENT
          onMouseDown={(e) => {
            e.preventDefault()
            setOptions([...e.target.children].map((item) => item.value))
            type === "filter"
              ? dispatch(showOptions(name))
              : setShowCategoryMenu((prev) => !prev)
          }}
          value={type === "filter" ? filters[name] : selectedOption}
          // JUST FOR REMOVE THE WARNING, DOESN'T AFFECT FUNCTION
          onChange={() => {}}
        >
          {/* OPTIONS ARE HIDDEN */}
          {workingLinks
            .flatMap((link) => link.subLinks || link)
            .filter((link) => typeof link === "string")
            .map((link, i) => {
              return (
                <option value={link} key={i}>
                  {link}
                </option>
              )
            })}
        </select>
        <BiChevronDown className={`icon ${showCategoryMenu && "down"}`} />
        {((type === "filter" && filtersOptionsShow[name]) ||
          (type !== "filter" && showCategoryMenu)) && (
          <ul>
            {options.map((option, i) => (
              <li
                key={i}
                onClick={() => {
                  setShowCategoryMenu(false)
                  setSelectedOption(option)
                  handleChange({ target: { name, value: option } })
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  .select-container {
    ${tw`relative inline-block w-full `}
  }
  select {
    ${tw`
      w-full py-1 px-2 lg:(pl-2 pr-5) border border-trinary rounded-lg 
      transition duration-200 hover:bg-gray-100
      appearance-none cursor-pointer 
    `}
  }

  .icon {
    ${tw`
      absolute top-1/2 right-2 -translate-y-1/2 pointer-events-none 
      transition-transform duration-200
    `}

    &.down {
      ${tw`-rotate-180`}
    }
  }

  ul {
    ${tw`
      w-full py-1 bg-white border border-trinary/50 rounded-lg
      absolute z-20 bottom-0 translate-y-[calc(100% + 2rem)]
    `}

    li {
      ${tw`
        px-2 py-1 cursor-pointer
        transition duration-150 hover:bg-gray-100
      `}
    }
  }
`
export default SelectInput
