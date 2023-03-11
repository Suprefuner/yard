import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, useLocation } from "react-router-dom"
import tw, { styled } from "twin.macro"
import { ListingCard, Loading } from "../components"
import { ListingCardMobile } from "../components/mobile"
import { getAllMyListing } from "../features/listing/listingSlice"
import { turnOffCreateSuccess } from "../features/singleListing/singleListingSlice"
import { updateSearchboxInView } from "../features/general/generalSlice"
import { isDesktop } from "../utils/helpers"

const ProfileListingPage = () => {
  const { isLoading, listings } = useSelector((store) => store.listing)
  const { user } = useSelector((store) => store.user)
  const { userId } = useParams()
  const dispatch = useDispatch()
  const location = useLocation()

  useEffect(() => {
    dispatch(turnOffCreateSuccess())
    dispatch(updateSearchboxInView(true))
  }, [])

  useEffect(() => {
    dispatch(getAllMyListing(userId || user._id))
  }, [location])

  if (isLoading) {
    return <Loading />
  }

  return (
    <Wrapper>
      {listings.length === 0 ? (
        <h1>Go create some listing</h1>
      ) : (
        listings.map((item) =>
          isDesktop() ? (
            <ListingCard key={item._id} {...item} />
          ) : (
            <ListingCardMobile key={item._id} {...item} />
          )
        )
      )}
    </Wrapper>
  )
}

const Wrapper = styled.main`
  ${tw`grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1.5 py-3`}
`
export default ProfileListingPage
