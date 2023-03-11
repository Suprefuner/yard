import { BsStarFill, BsStar } from "react-icons/bs"
import { useDispatch, useSelector } from "react-redux"
import { updateCurrentReview } from "../features/review/reviewSlice"

const RatingStars = () => {
  const { currentReview } = useSelector((store) => store.review)
  const { rating, isLock } = currentReview
  const dispatch = useDispatch()

  const starArr = Array.from({ length: 5 })

  const handleMouseOver = (rating) => {
    if (isLock) return
    dispatch(updateCurrentReview({ name: "rating", value: rating }))
  }

  const handleClick = () => {
    dispatch(updateCurrentReview({ name: "isLock", value: !isLock }))
  }

  return (
    <div className="stars">
      {starArr.map((_, i) =>
        i + 1 <= rating ? (
          <BsStarFill
            className="icon"
            key={i}
            onMouseOver={() => handleMouseOver(i + 1)}
            onClick={handleClick}
          />
        ) : (
          <BsStar
            className="icon"
            key={i}
            onMouseOver={() => handleMouseOver(i + 1)}
            onClick={handleClick}
          />
        )
      )}
    </div>
  )
}
export default RatingStars
