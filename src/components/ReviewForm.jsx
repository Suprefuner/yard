import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import tw, { styled } from "twin.macro"
import FormRow from "./FormRow"
import RatingStars from "./RatingStars"
import {
  updateCurrentReview,
  createReview,
} from "../features/review/reviewSlice"

const ReviewForm = () => {
  const { currentReview } = useSelector((store) => store.review)
  const { content } = currentReview
  const dispatch = useDispatch()
  const { id: listingId } = useParams()

  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(createReview(listingId))
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    dispatch(updateCurrentReview({ name, value }))
  }

  return (
    <Wrapper>
      <div className="body">
        <form onSubmit={handleSubmit}>
          <h2>How was your experience</h2>
          <div className="group">
            <h3>rate the buyer</h3>
            <RatingStars />
          </div>
          <div className="group">
            <h3>write a review</h3>
            <FormRow
              type="textarea"
              name="content"
              value={content}
              handleChange={handleChange}
            />
          </div>

          <button className="btn btn-primary">submit review</button>
        </form>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.main`
  ${tw`p-2 pb-3`}

  h2 {
    ${tw`uppercase font-semibold text-xl mb-2`}
  }

  form {
    ${tw`space-y-2`}

    .group {
      ${tw`grid gap-0.5`}
    }

    .stars {
      ${tw`flex gap-0.5 text-primary text-3xl`}

      &>* {
        ${tw`cursor-pointer`}
      }
    }

    & > button {
      ${tw`block mt-0.5 ml-auto py-1`}
    }
  }
`

export default ReviewForm
