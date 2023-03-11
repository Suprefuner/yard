import { BsStarFill, BsStar, BsStarHalf } from "react-icons/bs"

const Stars = ({ rating }) => {
  const starArr = Array.from({ length: 5 }, (_, i) => i + 1)

  return (
    <div className="flex items-center">
      {starArr.map((star, i) => {
        if (star - rating >= 1) return <BsStar key={i} />
        if (star - rating >= 0.5) return <BsStarHalf key={i} />
        return <BsStarFill key={i} />
      })}
    </div>
  )
}

export default Stars
