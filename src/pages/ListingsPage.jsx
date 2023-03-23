import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"
import tw, { styled } from "twin.macro"
import { FaFilter } from "react-icons/fa"
import {
  ListingCard,
  SelectInput,
  PriceFilterInput,
  Loading,
} from "../components"
import { ListingCardMobile } from "../components/mobile"
import { updateFilter, clearFilter } from "../features/filter/filterSlice"

import { getAllListing, loadMore } from "../features/listing/listingSlice"
import { updateSearchboxInView } from "../features/general/generalSlice"
import { addLocalFavoriteListingToServer } from "../features/favorite/favoriteSlice"
import { navLinks, sortList, conditionList } from "../utils/links"
import { isDesktop } from "../utils/helpers"

const ListingsPage = () => {
  const [isMobileFiltersShow, setIsMobileFiltersShow] = useState(false)
  const [localLoading, setLocalLoading] = useState(true)
  const { listings, page, pages, isLoading } = useSelector(
    (store) => store.listing
  )

  const { favoriteList } = useSelector((store) => store.favorite)
  const { filters } = useSelector((store) => store.filter)
  const dispatch = useDispatch()

  const [searchParams, setSearchParams] = useSearchParams()
  const search = searchParams.get("search")
  const brand = searchParams.get("brand")

  // get() ONLY GET PARTIAL VALUE IF THERE IS SPACE IN THE CATEGORY NAME (e.g computer & tech) SO CHANGED TO toString()
  let category = searchParams.get("category")?.includes("car")
    ? searchParams.get("category").split("&")[0]
    : searchParams.toString("category").split("=")[1]?.replaceAll("+", " ")

  const counter = useRef(0)

  const listingsPerLoad = 20

  useEffect(() => {
    dispatch(clearFilter())
    dispatch(updateSearchboxInView(false))
    dispatch(addLocalFavoriteListingToServer(favoriteList))

    if (search) {
      dispatch(getAllListing({ search, limit: listingsPerLoad }))
      setSearchParams("")
      return
    }

    if (category) {
      dispatch(updateFilter({ name: "category", value: category }))

      if (category === "car" && brand) {
        dispatch(updateFilter({ name: "brand", value: brand }))
        dispatch(
          getAllListing({
            category,
            brand,
            limit: listingsPerLoad,
          })
        )
        setSearchParams("")
        return
      }

      dispatch(getAllListing({ category, limit: listingsPerLoad }))
      setSearchParams("")
      return
    }

    dispatch(getAllListing({ limit: listingsPerLoad }))
    setSearchParams("")
  }, [])

  useEffect(() => {
    if (searchParams.get("category")) return

    const queryObject = {}

    Object.entries(filters).forEach((item) => {
      if (item[0] === "price") {
        return Object.entries(item[1]).forEach((item) => {
          queryObject[item[0]] = item[1]
        })
      }
      return (queryObject[item[0]] = item[1])
    })

    dispatch(
      getAllListing({ ...queryObject, limit: listingsPerLoad, type: "all" })
    )
  }, [filters])

  /*
  =====================================================
  INCREASE MORE LOADING TIME FOR THE IMAGES
  =====================================================
  */
  useEffect(() => {
    if (isLoading) {
      return setLocalLoading(true)
    }
    const loadingTimer = setTimeout(() => {
      setLocalLoading(false)
    }, 1000)

    return () => loadingTimer
  }, [isLoading])

  //=====================================================

  const handleChange = (e) => {
    const { name, value } = e.target
    dispatch(updateFilter({ name, value }))
  }

  const toggleMobileFilter = (state) => {
    setIsMobileFiltersShow(state)
  }

  const loadMoreListing = () => {
    counter.current += 1
    dispatch(
      loadMore({
        page: page + 1,
        limit: listingsPerLoad,
      })
    )
  }

  const handleClearFilter = () => {
    dispatch(clearFilter("all"))
  }

  return (
    <Wrapper>
      <div className="container">
        <div className="row">
          <h2>Listings</h2>
          {!isDesktop() && (
            <FaFilter
              className="icon"
              onClick={() => toggleMobileFilter(true)}
            />
          )}
        </div>

        <div
          className={`filters ${
            !isDesktop() && !isMobileFiltersShow && "hide"
          }`}
        >
          <SelectInput
            name="category"
            handleChange={handleChange}
            links={navLinks}
          />
          <SelectInput
            name="sort"
            handleChange={handleChange}
            links={sortList}
          />
          <SelectInput
            name="condition"
            handleChange={handleChange}
            links={conditionList}
          />
          <PriceFilterInput name="price" />
          <button className="btn btn-outline" onClick={handleClearFilter}>
            clear all
          </button>
          {!isDesktop() && (
            <button
              className="btn btn-outline"
              onClick={() => toggleMobileFilter(false)}
            >
              close filter
            </button>
          )}
        </div>
        <main className="content">
          {localLoading && counter.current === 0 ? (
            <Loading />
          ) : listings.length ? (
            <>
              <div className="listings">
                {listings.map((listing) =>
                  isDesktop() ? (
                    <ListingCard key={listing._id} {...listing} />
                  ) : (
                    <ListingCardMobile key={listing._id} {...listing} />
                  )
                )}
              </div>
              {page !== pages ? (
                <button
                  className="btn btn-primary btn-load"
                  onClick={loadMoreListing}
                >
                  load more
                </button>
              ) : (
                <span className="finish-text">that's all 📦</span>
              )}
            </>
          ) : (
            <h1 className="empty-msg">
              Sorry, we can't find stuff match your search, you may clear out
              the filter and try again!
            </h1>
          )}
        </main>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  .container {
    ${tw`
      mb-3 space-y-3 overflow-scroll relative
      pt-[calc(var(--navbar-mobile-size) + 3rem)] 
      lg:(pt-[calc(var(--navbar-size) + 3rem + 6.4rem)] overflow-auto)
    `}

    .row {
      ${tw`flex items-center justify-between`}

      .icon {
        ${tw`text-secondary text-[2rem]`}
      }
    }

    .filters {
      ${tw`
        absolute top-[calc(var(--navbar-mobile-size) - 3rem)] left-0 right-0
        flex flex-col gap-1 bg-gray-200 p-3 translate-y-0 transition shadow-md 
        lg:(relative top-0 flex-row border-b pb-2 bg-transparent p-0 shadow-none z-40)
      `}

      &.hide {
        ${tw`-translate-y-full shadow-none lg:translate-y-0`}
      }
    }

    h2 {
      ${tw`font-semibold text-3xl`}
    }

    .empty-msg {
      ${tw`h-[calc(100vh - var(--navbar-size) - 6.4rem - 45rem)] text-center pt-3`}
    }

    .listings {
      ${tw`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-1.5`}
    }

    .btn-load {
      ${tw`block mx-auto mt-3`}
    }

    .finish-text {
      ${tw`block mt-3 text-secondary text-md text-center capitalize font-medium`}
    }
  }
`
export default ListingsPage
