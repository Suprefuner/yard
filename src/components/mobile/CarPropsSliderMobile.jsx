import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import { categoryPropsList } from "../../utils/links"
import CategoryProp from "../CategoryProp"

const CarPropsSliderMobile = () => {
  return (
    <Swiper spaceBetween={10} slidesPerView={3.5}>
      {categoryPropsList.car.map((link, i) => (
        <SwiperSlide key={i}>
          <CategoryProp {...link} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default CarPropsSliderMobile
