import { useSelector } from "react-redux"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper"
import "swiper/css"
import "swiper/css/navigation"
import { isDesktop } from "../utils/helpers"
import { RxImage } from "react-icons/rx"

const SingleListingSlider = () => {
  const { listing } = useSelector((store) => store.singleListing)
  const { photos } = listing

  return (
    <div className="select-none relative">
      <Swiper
        modules={[Navigation]}
        loop={true}
        navigation={true}
        spaceBetween={10}
        slidesPerView={isDesktop() ? 3 : 1}
      >
        {photos.map(({ url, publicId }) => (
          <SwiperSlide
            key={publicId}
            className="max-w-[400px] h-[25rem] lg:h-[40rem] rounded-xl overflow-hidden"
          >
            <img
              src={url}
              alt={`product photo`}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className="
          flex items-center gap-0.5 p-0.5 px-1 
          lg:(p-1 gap-1)
          text-sm bg-white/50
          absolute right-0.5 bottom-0.5 z-20
          rounded-xl border border-slate-300 shadow-sm
          "
      >
        <RxImage className="text-md" />
        <span>{photos.length} images</span>
      </div>
    </div>
  )
}

export default SingleListingSlider
