import tw, { styled } from "twin.macro"
import { FaHeart, FaRegHeart } from "react-icons/fa"
import { Link } from "react-router-dom"

const ListingCardMobile = ({
  _id,
  name,
  condition,
  price,
  numOfFavorite,
  createdBy,
  photos,
}) => {
  return (
    <Wrapper>
      <Link to={`/listing/${_id}`}>
        <div className="images">
          <img src={photos[0]?.url} alt="product cover image" />
        </div>
        <div className="information">
          <div className="text-row">
            <span className="name">{name}</span>
          </div>
          <div className="text-row">
            <span className="price">HK${price}</span>
            <span>{condition}</span>
          </div>
          <div className="text-row">
            <div className="user-photo">
              <img src={createdBy?.user?.photo?.url} alt="user photo" />
            </div>
            <span>{createdBy?.user.username}</span>
            {numOfFavorite > 0 ? (
              <FaHeart className="icon icon-full" />
            ) : (
              <FaRegHeart className="icon" />
            )}
          </div>
        </div>
      </Link>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw` rounded-xl border-[1px] text-sm overflow-hidden`}

  .images {
    ${tw`h-[150px]`}

    img {
      ${tw`w-full h-full object-cover`}
    }
  }

  .information {
    ${tw`p-1 space-y-0.5`}
  }
  .text-row {
    ${tw`flex gap-0.5 items-center`}
    &:first-child {
      ${tw`flex items-center justify-between`}
    }

    .name,
    .price {
      ${tw` font-semibold text-[1.4rem]`}
    }

    .name {
      ${tw`truncate`}
    }

    &:last-child {
      ${tw`flex items-center gap-0.5`}

      .user-photo {
        ${tw`w-2 aspect-square rounded-full`}

        img {
          ${tw`w-full h-full object-cover rounded-full`}
        }
      }

      .icon {
        ${tw`ml-auto text-base`}

        &-full {
          ${tw`text-red-500`}
        }
      }
    }
  }
`
export default ListingCardMobile
