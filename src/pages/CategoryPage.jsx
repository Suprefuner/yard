import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import { useInView } from "react-intersection-observer"
import tw, { styled } from "twin.macro"
import { CategoryProp, Searchbox, ListingCard, Loading } from "../components"
import { ListingCardMobile } from "../components/mobile"
import { categoryPropsList, categoryBanners } from "../utils/links"
import { isDesktop } from "../utils/helpers"
import {
  getRecentlyListing,
  getPopularListing,
} from "../features/listing/listingSlice"
import { updateSearchboxInView } from "../features/general/generalSlice"

const CategoryPage = () => {
  const { recentListings, popularListings, isLoading } = useSelector(
    (store) => store.listing
  )
  const { category } = useParams()
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()

  /*
  =====================================================
  IMPLEMENT INTERSEC-TION OBSERVER
  =====================================================
  */
  const { ref, inView } = useInView({
    rootMargin: "-65px",
    threshold: 0,
  })

  useEffect(() => {
    dispatch(updateSearchboxInView(inView))
  }, [inView])

  //=====================================================
  useEffect(() => {
    dispatch(getRecentlyListing({ category }))
    dispatch(getPopularListing({ category, sort: "favorite" }))
  }, [location])

  const handleExploreMore = () => {
    navigate(`/listing?category=${category}`)
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <Wrapper inView={inView}>
      {!isDesktop() && (
        <div
          className="header header-mobile"
          style={{
            backgroundImage: `url(${categoryBanners[category]})`,
          }}
        >
          <div className="bg-image"></div>
          <h2>some slogan</h2>
        </div>
      )}
      <div className="container">
        {isDesktop() && (
          <header
            className="header"
            style={{
              backgroundImage: `url(${categoryBanners[category]})`,
            }}
          >
            <div ref={ref}>
              <Searchbox />
            </div>
          </header>
        )}
        <section className="popular">
          <h2>{category === "car" ? "popular brands" : "shop by category"}</h2>
          <div className={`links ${category === "car" && "links-car"}`}>
            {categoryPropsList[category]?.map((link, i) => (
              <CategoryProp key={i} {...link} />
            ))}
          </div>
        </section>

        <section className="recent-listed">
          <div className="header">
            <h2>recently listed</h2>
            <div className="btn btn-secondary" onClick={handleExploreMore}>
              explore more
            </div>
          </div>

          <div className="listings">
            {recentListings.map((listing) =>
              isDesktop() ? (
                <ListingCard key={listing._id} {...listing} />
              ) : (
                <ListingCardMobile key={listing._id} {...listing} />
              )
            )}
          </div>
        </section>

        <section className="popular-listed">
          <div className="header">
            <h2>popular listed</h2>
            <div className="btn btn-secondary" onClick={handleExploreMore}>
              explore more
            </div>
          </div>
          <div className="listings">
            {popularListings.map((listing) =>
              isDesktop() ? (
                <ListingCard key={listing._id} {...listing} />
              ) : (
                <ListingCardMobile key={listing._id} {...listing} />
              )
            )}
          </div>
        </section>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  --navbar-size: 7.5rem;
  --navbar-mobile-size: 6.4rem;

  .header-mobile {
    --height: 25rem;

    ${tw`
      h-[var(--height)] mt-[var(--navbar-mobile-size)] mb-5 
      bg-cover relative after:(absolute inset-0 bg-black/30)
    `}

    h2 {
      ${tw`text-4xl text-white font-semibold text-center leading-[var(--height)] uppercase relative z-10`}
    }
  }

  .container {
    ${tw`
      space-y-5 mb-5 lg:(pt-[calc(var(--navbar-size) + 3rem)] space-y-8)
    `}

    & > .header {
      ${tw`
        h-[40rem] bg-[center] bg-cover filter relative
        grid place-items-center px-3
        after:(inset-0 absolute bg-black/30)
      `}

      &> * {
        ${tw`w-full z-20`}
      }
    }
  }

  section h2 {
    ${tw`text-xl font-bold capitalize`}
  }

  .popular {
    ${tw`lg:my-0`}

    h2 {
      ${tw`mb-2`}
    }
  }

  .links {
    ${tw`flex justify-center gap-2 lg:gap-5`}

    & > * {
      ${tw`w-[25rem]`}
    }

    &.links-car {
      ${tw`grid gap-0 grid-cols-9`}

      & > * {
        ${tw`w-10 justify-self-center`}
      }
    }
  }

  .recent-listed,
  .popular-listed {
    .header {
      ${tw`flex items-center justify-between mb-2 lg:justify-start`}

      h2 {
        ${tw`mr-2`}
      }
    }

    & .listings {
      ${tw`grid grid-cols-2 lg:grid-cols-5 gap-1.5`}
    }
  }
`
export default CategoryPage
