import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import tw, { styled } from "twin.macro"
import { BiChevronDown } from "react-icons/bi"
import { updateFilter, showOptions } from "../features/filter/filterSlice"
import { isDesktop } from "../utils/helpers"

const initialPriceRange = {
  minPrice: "",
  maxPrice: "",
}

const PriceFilterInput = ({ name }) => {
  const [priceRange, setPriceRange] = useState(initialPriceRange)
  const { filters, filtersOptionsShow } = useSelector((store) => store.filter)
  const { price: priceFilter } = filters
  const { price: priceOptionShow } = filtersOptionsShow
  const dispatch = useDispatch()

  useEffect(() => {
    setPriceRange(priceFilter)
  }, [priceFilter])

  const handleClick = () => dispatch(showOptions(name))

  const handleClear = () => {
    setPriceRange(initialPriceRange)
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    // LIMIT USER INPUT NUMBER WIHTOUT USING <input type="number">
    const re = /^([0-9]+)$/

    // DELETE TO 0 CHANGE TO STRING "" FOR BETTER UX
    if (re.test(value) || value === "") {
      setPriceRange((prev) => ({ ...prev, [name]: value !== "" ? +value : "" }))
    }
  }

  const handlePriceFilter = () => {
    dispatch(updateFilter({ name: "price", value: priceRange }))
  }

  return (
    <Wrapper>
      <div className="select" onClick={handleClick} onChange={handleChange}>
        {name}
      </div>
      <BiChevronDown className={`icon ${priceOptionShow && "down"}`} />
      {priceOptionShow && (
        <div className="price-filter-option">
          <form>
            <div className="price-row row">
              <input
                type="text"
                name="minPrice"
                id="minPrice"
                placeholder={`${isDesktop() ? "minimum" : "min"}`}
                value={priceRange.minPrice || ""}
                onChange={handleChange}
              />
              <span>-</span>
              <input
                type="text"
                name="maxPrice"
                id="maxPrice"
                placeholder={`${isDesktop() ? "maximum" : "max"}`}
                value={priceRange.maxPrice || ""}
                onChange={handleChange}
              />
            </div>
            <div className="buttons row">
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleClear}
              >
                clear
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handlePriceFilter}
              >
                apply
              </button>
            </div>
          </form>
        </div>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`relative w-full lg:w-min`}

  .select {
    ${tw`
      w-full py-1 px-2 pr-5 border border-trinary rounded-lg
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

  .price-filter-option {
    ${tw`
      w-full lg:w-auto p-2.5 border border-trinary/50 rounded-lg
      absolute z-20 bottom-0 bg-white translate-y-[calc(100% + 2rem)]
    `}
  }

  .row {
    ${tw`flex gap-1.5`}
  }

  .price-row {
    ${tw`items-center`}
  }

  input {
    ${tw`w-1/2 lg:w-[15rem] py-1 px-2 border focus:outline-0`}
  }

  .buttons {
    ${tw`mt-2 justify-start lg:justify-end `}

    &>* {
      ${tw`w-full`}
    }
  }
`
export default PriceFilterInput
