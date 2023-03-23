import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper"
import "swiper/css"
import "swiper/css/pagination"
import { homeBanners } from "../utils/links"

const HomePageSlider = () => {
  return (
    <Swiper
      className="hidden lg:block"
      modules={[Autoplay, Pagination]}
      loop={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      spaceBetween={10}
      slidesPerView={1.5}
    >
      {homeBanners.map((banner, i) => (
        <SwiperSlide key={i} className="overflow-hidden">
          <img src={banner} alt={`banner ${i}`} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default HomePageSlider
