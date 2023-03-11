import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper"
import "swiper/css"
import "swiper/css/pagination"
import { homeBanners } from "../../utils/links"
import tw, { styled } from "twin.macro"

const HomePageSliderMobile = () => {
  return (
    <Swiper
      className="lg:hidden"
      modules={[Autoplay, Pagination]}
      loop={true}
      autoplay={{
        delay: 5000,
        disableOnInteraction: false,
      }}
      pagination={{ clickable: true }}
      spaceBetween={50}
      slidesPerView={1}
    >
      {homeBanners.map((banner, i) => (
        <SwiperSlide key={i}>
          <img src={banner} alt={`banner ${i}`} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default HomePageSliderMobile
