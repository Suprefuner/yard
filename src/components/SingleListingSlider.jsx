import { useEffect, useState } from "react"
import tw, { styled } from "twin.macro"

import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper"
import "swiper/css"
import "swiper/css/navigation"

import { RxImage } from "react-icons/rx"
import Loading from "./Loading"
import { isDesktop } from "../utils/helpers"

const SingleListingSlider = ({ photos }) => {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const swiperBufferTimeout = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(swiperBufferTimeout)
  }, [])

  if (isLoading) {
    return <Loading />
  }

  return (
    <Wrapper>
      <Swiper
        loop={true}
        slidesPerView={isDesktop() ? 3 : 1}
        modules={[Navigation]}
        navigation={true}
        spaceBetween={10}
      >
        {photos.map((photo, i) => (
          <SwiperSlide
            key={i}
            className="max-w-[30rem] h-[25rem] lg:h-[30rem] overflow-hidden rounded-xl"
          >
            <img src={photo.url} alt={`product photo`} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div
        className="
          flex items-center gap-0.5 p-0.5 px-1 
          lg:(p-1 gap-1) text-sm bg-white/50
          absolute right-1 bottom-1 z-20
          rounded-xl border border-slate-300 shadow-sm
          "
      >
        <RxImage className="text-md" />
        <span>{photos.length} images</span>
      </div>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  ${tw`select-none relative`}

  &>* {
    ${tw`first:(hidden lg:block shadow-inner p-1.5 rounded-2xl bg-gray-100)`}

    img {
      ${tw`w-full h-full object-cover`}
    }
  }

  .swiper-button-prev {
    ${tw`left-0`}
  }

  .swiper-button-next {
    ${tw`left-4`}
  }
`

export default SingleListingSlider
