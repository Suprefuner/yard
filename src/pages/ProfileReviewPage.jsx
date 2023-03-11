import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import tw, { styled } from "twin.macro"
import { Stars, ReviewCard, Loading } from "../components"
import { getAllMyReviews } from "../features/review/reviewSlice"

const ProfileReviewPage = () => {
  const { user, isLoading } = useSelector((store) => store.user)
  const { reviews } = useSelector((store) => store.review)
  const dispatch = useDispatch()
  const { userId } = useParams()

  console.log(userId)

  useEffect(() => {
    dispatch(getAllMyReviews(userId || user._id))
  }, [])

  if (isLoading) {
    return <Loading />
  }

  const sortOptions = ["latest", "oldest", "a-z", "z-a"]

  return (
    <Wrapper>
      <div className="row filter-row">
        <div className="btn btn-outline active">all</div>
        <div className="btn btn-outline">from buyer</div>
        <div className="btn btn-outline">from seller</div>
      </div>
      <div className="row">
        <div className="rating">{user?.rating?.toFixed(1)}</div>
        <div>
          <Stars />
          <span>
            {user?.numOfReviews} {user?.numOfReviews > 1 ? "reviews" : "review"}
          </span>
        </div>
        <div className="form-row">
          <label htmlFor="sort">sort by</label>
          <select name="sort" id="sort">
            {sortOptions.map((option) => (
              <option value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="reviews">
        {reviews.length ? (
          <h1>Don't have any review yet, let's explore!</h1>
        ) : (
          reviews.map((review) => <ReviewCard key={review._id} {...review} />)
        )}
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  ${tw`grid space-y-2 mb-3 mt-3 lg:mt-0`}

  .rating {
    ${tw`text-5xl border-r-[1px] pr-2 my-0 lg:my-2`}
  }

  .row {
    ${tw`flex items-center gap-1`}

    &:nth-child(2) {
      ${tw`lg:-order-1`}
    }

    .form-row {
      ${tw`ml-auto`}
    }

    label {
      ${tw`hidden lg:block`}
    }
  }

  .reviews {
    ${tw`space-y-2`}
  }
`
export default ProfileReviewPage
