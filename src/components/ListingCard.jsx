import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import tw, { styled } from "twin.macro"
import moment from "moment"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper"
import "swiper/css"
import "swiper/css/navigation"

import { FaHeart, FaRegHeart } from "react-icons/fa"
import {
  openAuthModal,
  // addListingToFavoriteLocally,
} from "../features/user/userSlice"
import { toggleListingToFavoriteLocally } from "../features/favorite/favoriteSlice"

const ListingCard = ({
  _id,
  name,
  condition,
  price,
  numOfFavorite,
  createdAt,
  createdBy,
  photos,
}) => {
  const { favoriteList } = useSelector((store) => store.favorite)
  const { user } = useSelector((store) => store.user)
  const dispatch = useDispatch()

  const handleClickFavorite = () => {
    !user._id
      ? dispatch(openAuthModal("login"))
      : dispatch(
          toggleListingToFavoriteLocally({
            _id,
            name,
            condition,
            price,
            numOfFavorite,
            createdAt,
            createdBy,
            photos,
          })
        )
  }

  /*
  =========================================================
  SKELETON DESIGN
  =========================================================
  const onLoad = useCallback(() => {
    setImgLoaded(true)
  }, [])

  if (!imgLoaded) {
    return (
      <Wrapper>
        <div className="link">
          <div className="card-header">
            <div className="user-photo skeleton"></div>
            <div className="user-info skeleton-group">
              <div className="skeleton skeleton-text skeleton-text-sm"></div>
              <div className="skeleton skeleton-text skeleton-text-sm"></div>
            </div>
          </div>
          <div className="images skeleton">
            <img src={photos.at(-1).url} alt="listing photo" onLoad={onLoad} />
          </div>
          <div className="skeleton-group">
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text skeleton-text-short"></div>
            <div className="skeleton skeleton-text skeleton-text-short"></div>
          </div>
          <div className="favorite">
            <FaRegHeart className="icon" />
            <span>0</span>
          </div>
        </div>
      </Wrapper>
    )
  }
  */

  return (
    <Wrapper>
      <Link to={`/listing/${_id}`} className="link">
        <div className="card-header">
          <div className="user-photo">
            <img src={createdBy?.user?.photo?.url} alt="user photo" />
          </div>
          <div className="user-info">
            <span className="name">{name}</span>
            <span>{moment(createdAt, "YYYYMMDD").fromNow()}</span>
          </div>
        </div>
        <div className="images">
          <Swiper
            loop={true}
            slidesPerView={1}
            modules={[Navigation]}
            navigation={true}
          >
            {photos.map(({ url, _id }, i) => (
              <SwiperSlide key={_id + i}>
                <img src={url} alt="listing photo" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="listing-information">
          <h4>{name}</h4>
          <h3 className="price">HK${price}</h3>
          <div className="text-row">
            <span>{condition}</span>
          </div>
        </div>
      </Link>
      <div className="favorite">
        {favoriteList.map((item) => item._id).includes(_id) ? (
          <FaHeart
            className="icon icon-fullHeart"
            onClick={handleClickFavorite}
          />
        ) : (
          <FaRegHeart className="icon" onClick={handleClickFavorite} />
        )}
        <span>
          {favoriteList.map((item) => item._id).includes(_id)
            ? numOfFavorite + 1
            : numOfFavorite}
        </span>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`
    p-1 border text-[14px] relative
    transition duration-200 cursor-pointer
    hover:(shadow-lg border-secondary/70) 
  `}

  /* 
  =========================================
  SKELETON
  =========================================
  @keyframes skeleton-loading {
    0% {
      ${tw`bg-gray-200`}
    }

    100% {
      ${tw`bg-gray-300`}
    }
  }

  .skeleton {
    ${tw`[animation: skeleton-loading 1s linear infinite alternate]`}

    &-text {
      ${tw`h-2 `}

      &-sm {
        ${tw`h-1.5`}
      }

      &-short {
        ${tw`w-1/2`}
      }
    }
  }
  
  .skeleton-group {
    ${tw`space-y-0.5 w-full`}
  }

  */

  /* 
  =========================================
  LIST CARD
  =========================================
  */
  .link {
    ${tw`space-y-1`}
  }

  .card-header {
    ${tw`flex items-center gap-1.5`}

    .user-photo {
      ${tw`w-4 aspect-square rounded-full`}

      img {
        ${tw`w-full h-full object-cover rounded-full`}
      }
    }

    .user-info {
      ${tw`w-full`}

      span {
        ${tw`block`}
      }

      .name {
        ${tw`truncate w-[90%] `}
      }
    }
  }

  .images {
    ${tw`w-full aspect-square`}

    & > * {
      ${tw`w-full h-full`}

      & > * img {
        ${tw`w-full h-full bg-gray-200 object-cover`}
      }
    }

    .swiper-button-prev,
    .swiper-button-next {
      ${tw`
        w-3 aspect-square bg-black/20 p-2 
        lg:translate-y-[186%]
        xl:translate-y-[155%]
        2xl:translate-y-[211%]
      `}
    }

    .swiper-button-prev {
      ${tw`left-0`}
    }

    .swiper-button-next {
      ${tw`left-4`}
    }
  }

  .price {
    ${tw`font-semibold text-base`}
  }

  .text-row {
    ${tw`flex items-center justify-between`}
  }

  .favorite {
    ${tw`absolute right-1 bottom-1 flex items-center gap-[0.75rem]`}

    .icon {
      ${tw`text-md transition duration-150 hover:scale-110 `}
    }
    .icon-fullHeart {
      ${tw`text-red-500`}
    }
  }
`

export default ListingCard
