import { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { useParams, useNavigate, Link } from "react-router-dom"
import tw, { styled } from "twin.macro"
// REACT-ICON =============================================
import { FaHeart, FaRegHeart } from "react-icons/fa"
import { MdEmojiPeople, MdLocationPin } from "react-icons/md"
import { BsStars } from "react-icons/bs"
import { TiTick } from "react-icons/ti"
// ========================================================
import {
  UserInfo,
  ReviewCard,
  OfferBox,
  ListingEditBox,
  SingleListingSlider,
  ReviewModal,
  BreadCrumb,
  Loading,
} from "../components"
import { UserInfoReviewMobile } from "../components/mobile"
import { getSingleListing } from "../features/singleListing/singleListingSlice"
import { toggleListingToFavoriteLocally } from "../features/favorite/favoriteSlice"
import { getAllMyReviews } from "../features/review/reviewSlice"
import { isDesktop } from "../utils/helpers"

const SingleListingPage = () => {
  const [localLoading, setLocalLoading] = useState(true)
  const { user } = useSelector((store) => store.user)
  const { favoriteList } = useSelector((store) => store.favorite)
  const { listing, isLoading, isDelete } = useSelector(
    (store) => store.singleListing
  )
  const { isModalOpen, reviews } = useSelector((store) => store.review)
  const { id: listingId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(getSingleListing(listingId))
    dispatch(getAllMyReviews(listing?.createdBy?.user))
  }, [])

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

  /*
  =====================================================
  REDIRECT AFTER DELETE LISTING
  =====================================================
  */
  useEffect(() => {
    if (!isDelete) return
    navigate("/")
  }, [isDelete])

  if (localLoading) {
    return <Loading />
  }

  const handleClickFavorite = () => {
    !user._id
      ? dispatch(openAuthModal("login"))
      : dispatch(toggleListingToFavoriteLocally(listing))
  }

  const {
    condition,
    createdBy,
    dealMethod,
    description,
    meetUpLocation,
    name,
    numOfFavorite,
    photos,
    price,
  } = listing

  let tradeMethod = []
  // DESTRUCT DEAL METHOD OBJECT TO ARRAY
  // if dealMethod.meetup = true ===> ["meetup"]
  Object.entries(dealMethod).forEach((method) => {
    if (!method[1]) return
    tradeMethod = [...tradeMethod, method[0]]
  })

  return (
    <Wrapper>
      {isModalOpen && <ReviewModal />}
      <div className="container">
        <BreadCrumb
          lastPage={{
            title: `${createdBy === user?._id ? "my" : "user"} listings`,
            url: `/profile/${
              createdBy === user?._id ? "" : `${createdBy.user._id}`
            }`,
          }}
          currentPage={name}
        />
        <SingleListingSlider photos={photos} />
        <section className="listing-information">
          <div className="details">
            <div className="row mobile-chat-row">
              <div className="btn btn-secondary">chat</div>
              {/* FIXME OPEN CREATE CHAT MESSAGE */}
              <form>
                <input type="text" placeholder="$500" />
                <button className="btn btn-primary">make offer</button>
              </form>
            </div>
            <div className="row">
              <h3 className="name">{name}</h3>
              <div className="favorite">
                {!favoriteList?.map((item) => item._id)?.includes(listingId) ? (
                  <FaRegHeart className="icon" onClick={handleClickFavorite} />
                ) : (
                  <FaHeart
                    className="icon filled"
                    onClick={handleClickFavorite}
                  />
                )}
                <span>
                  {!favoriteList?.map((item) => item._id)?.includes(listingId)
                    ? numOfFavorite
                    : numOfFavorite + 1}
                </span>
              </div>
            </div>
            <h2 className="price">HK${price.toFixed(2)}</h2>

            <div className="row pt-3">
              <div className="label">
                <BsStars className="icon" /> condition:
              </div>{" "}
              {condition}
            </div>
            <div className="row">
              <div className="label">
                <MdEmojiPeople className="icon" />
                trade method:
              </div>{" "}
              {tradeMethod}
            </div>
            <div className="row">
              <div className="label">
                <MdLocationPin className="icon" />
                location:
              </div>{" "}
              {meetUpLocation}
            </div>
          </div>
          {createdBy.user._id === user?._id ? <ListingEditBox /> : <OfferBox />}
        </section>
        <section className="section-description">
          <h2 className="title">Description</h2>
          <article>{description}</article>
        </section>
        <section className="section-review">
          <div className="col">
            {/* <Link to={`/profile/${createdBy.user._id}`}> */}
            <UserInfo {...createdBy?.user} canEdit={false} />
            {/* </Link> */}
          </div>
          <div className="col">
            <h2 className="title">reviews for @{createdBy?.user?.username}</h2>
            {!isDesktop() && <UserInfoReviewMobile {...createdBy.user} />}
            <div className="reviews">
              {reviews.length === 0 ? (
                <p className="empty-msg">
                  {createdBy.user.username} doesn't have any review yet🤓
                </p>
              ) : (
                reviews?.map((review) => <ReviewCard {...review} />)
              )}
            </div>
          </div>
        </section>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  .container {
    ${tw`
      pt-[calc(var(--navbar-mobile-size) + 2rem)] mb-10 space-y-2 
      lg:(pt-[calc(var(--navbar-size) + 3rem + 6.4rem)] space-y-3)
    `}

    .bread-crumb {
      ${tw`text-sm text-slate-500`}
    }
    section:not(:last-child) {
      ${tw`border-b-[1px] pb-3`}
    }

    .listing-information {
      ${tw`lg:(flex justify-between)`}

      .details {
        ${tw`space-y-1`}

        & > * {
          ${tw`block`}
        }

        .name,
        .price {
          ${tw`font-semibold text-xl`}
        }

        .row,
        .favorite {
          ${tw`flex items-center`}
        }

        .row {
          ${tw`gap-1`}
        }

        .label {
          ${tw`flex items-center gap-1 capitalize`}
          .icon {
            ${tw`text-xl text-trinary`}
          }
        }

        .favorite {
          ${tw`ml-1 gap-0.5`}

          .icon {
            ${tw`text-md cursor-pointer transition hover:scale-110`}

            &.filled {
              ${tw`text-red-500`}
            }
          }

          span {
            ${tw`translate-y-[1px]`}
          }
        }

        .mobile-chat-row {
          ${tw`lg:hidden mb-3 shadow-inner py-2 -mx-2 px-2 `}

          &>.btn {
            ${tw`flex-1`}
          }

          form {
            ${tw`relative`}
          }

          input {
            ${tw`border-[1px] py-0.5 px-1 w-full rounded-lg`}
          }

          button {
            ${tw`absolute top-0 right-0 h-full rounded-l-none`}
          }
        }
      }
    }

    .title {
      ${tw`font-semibold text-2xl mb-1.5`}
    }

    .section-review {
      ${tw`flex lg:gap-5`}

      .empty-msg {
        ${tw`text-[1.8rem] bg-gray-200 p-2`}
      }

      & > *:last-child {
        ${tw`lg:grow`}
      }

      .reviews {
        ${tw`space-y-3 mt-2 lg:mt-0`}
      }
    }
  }
`

export default SingleListingPage
