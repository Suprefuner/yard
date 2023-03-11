import { useDispatch } from "react-redux"
import { Link, useParams } from "react-router-dom"
import tw, { styled } from "twin.macro"
import { isDesktop } from "../utils/helpers"
import { clearSearchField } from "../features/filter/filterSlice"

const CategoryProp = ({ icon, text, photo, type }) => {
  const { category } = useParams()
  const dispatch = useDispatch()

  return (
    <Wrapper>
      {/* prettier-ignore */}
      <Link to={
      type === "home" 
      ? `/category/${text}` 
      : category==='car'
      ? `/listing?category=${category}&brand=${text}`
      : `/listing?category=${text}`}
      >
      {/* prettier-ignore */}
        <div className={`icon-container ${ type === "home" &&  "icon-container-home" }`}>
          {
          type === "home" 
          ? (<div className="icon">{icon}</div>)
          : (<div className="image-container">
              <img src={photo} alt={`${text} photo`} className='front' />
              <img src={photo} alt={`${text} photo`} className='back'/>
            </div>
          )}
        </div>
        {isDesktop() && <h3>{text}</h3>}
      </Link>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`text-center cursor-pointer`}

  .icon-container {
    ${tw`
      aspect-square bg-gray-200 rounded-full 
      flex items-center justify-center mx-auto lg:mb-1
      transition-all duration-200
    `}

    &-home {
      ${tw`bg-secondary hover:bg-trinary`}

      &>* {
        ${tw`text-center grid place-items-center`}
      }
    }

    & img {
      ${tw`transition`}
    }

    & .image-container {
      ${tw`relative grid place-items-center`}

      .front, .back {
        ${tw`absolute`}
      }

      .front {
        ${tw`z-10`}
      }
    }

    &:hover .front {
      ${tw`scale-[1.1]`}
    }

    &:hover .back {
      ${tw`scale-[1.01] brightness-0 blur-md invert-[0.7]`}
    }

    & > * {
      ${tw`
        text-[5rem] md:text-[8rem] xl:text-[11rem] 2xl:text-[14rem]  text-white w-full h-full object-contain
      `}
    }
  }

  h3 {
    ${tw`
      -mb-0.5 text-sm capitalize lg:(text-base font-semibold) 
    `}
  }
`
export default CategoryProp
