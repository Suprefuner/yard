import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation } from "react-router-dom"
import { useInView } from "react-intersection-observer"
import tw, { styled } from "twin.macro"
import {
  Searchbox,
  HomePageSlider,
  CategoryProp,
  ListingCard,
  Loading,
} from "../components"
import { ListingCardMobile, HomePageSliderMobile } from "../components/mobile"
import { navLinks } from "../utils/links"
import { isDesktop } from "../utils/helpers"
import { getAllListing } from "../features/listing/listingSlice"
import {
  updateSearchboxInView,
  showMobileSidebar,
} from "../features/general/generalSlice"

const HomePage = () => {
  const { listings, isLoading } = useSelector((store) => store.listing)
  const dispatch = useDispatch()
  const location = useLocation()

  /*
  ================================================================
  IMPLEMENT INTERSECTIoN 
  ================================================================
  */
  const { ref, inView } = useInView({
    rootMargin: "-65px",
    threshold: 0,
  })

  useEffect(() => {
    dispatch(updateSearchboxInView(inView))
  }, [inView])

  //================================================================

  useEffect(() => {
    dispatch(showMobileSidebar())
    dispatch(getAllListing({ status: "sold" }))
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <Wrapper inView={inView}>
      <HomePageSliderMobile />
      <div className="container">
        <div ref={ref}>
          <Searchbox />
        </div>
        <HomePageSlider />
        <section className="section-categories">
          <h2>category</h2>
          <div className="categories-row">
            {/* remove "all" link  */}
            {navLinks.slice(0, -1).map((link, i) => (
              <CategoryProp key={i} {...link} type="home" />
            ))}
          </div>
        </section>
        <section className="section-listing">
          <h2>some recommendation</h2>
          <div className="listings">
            {listings.map((listing) =>
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
  ${tw`py-[64px] lg:py-0 relative`}

  .container {
    ${tw`space-y-3 lg:(py-2 pt-[calc(3rem + 75px)])`}

    section {
      ${tw`pb-3`}
    }
  }

  section > h2 {
    ${tw`text-xl font-bold mb-3 capitalize`}
  }

  .section-categories {
    .categories-row {
      ${tw`grid grid-cols-4 gap-1.5 lg:gap-8`}
    }
  }
  .section-listing {
    .listings {
      ${tw`grid grid-cols-2 gap-1 lg:(grid-cols-4 gap-1.5) xl:grid-cols-5`}
    }
  }
`
export default HomePage
