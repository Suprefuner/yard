import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import tw, { styled } from "twin.macro"
import { ListingCard, Loading } from "../components"
import { ListingCardMobile } from "../components/mobile"
import { addLocalFavoriteListingToServer } from "../features/favorite/favoriteSlice"
import { isDesktop } from "../utils/helpers"
import { Link } from "react-router-dom"

const FavoritePage = () => {
  const { favoriteList, isLoading } = useSelector((store) => store.favorite)
  const dispatch = useDispatch()

  // SAVE FAVORITE BY REDUX PERSIST UPLOAD TO DB WHENEVER NEED TO LOAD PAGE
  useEffect(() => {
    dispatch(addLocalFavoriteListingToServer(favoriteList))
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <Wrapper>
      <div className="container">
        <h2>My Favorite</h2>
        {favoriteList.length === 0 ? (
          <div className="empty-container">
            <h3>Go find your favorite</h3>
            <div className="emojis">🤖🚗💅🏿👚🕶️</div>
            <Link to="/listing">
              <button className="btn btn-primary">explore</button>
            </Link>
          </div>
        ) : (
          <div className="listings">
            {favoriteList?.map((item) =>
              isDesktop() ? (
                <ListingCard key={item._id} {...item} />
              ) : (
                <ListingCardMobile key={item._id} {...item} />
              )
            )}
          </div>
        )}
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  .container {
    ${tw`
      pt-[calc(var(--navbar-mobile-size) + 5rem)] mb-3
      lg:pt-[calc(var(--navbar-size) + 3rem + 6.4rem)] 
    `}

    .empty-container {
      ${tw`
        min-h-[calc(100vh - var(--navbar-size) - var(--footer-size))]
        flex flex-col items-center gap-2 pt-7
      `}

      *:not(button) {
        ${tw`text-3xl`}
      }

      button {
        ${tw`mt-3 py-1 px-3 text-xl relative`}
      }
    }

    h2 {
      ${tw`font-semibold text-3xl mb-2 pb-2 border-b`}
    }

    .listings {
      ${tw`grid gap-1.5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 `}
    }
  }
`
export default FavoritePage
