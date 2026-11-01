"use client"

import { Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

export function StudioGallery({
  images,
  title,
}: {
  images: string[]
  title: string
}) {
  const slides = images.filter(Boolean)

  return (
    <Swiper
      modules={[Navigation, Pagination]}
      navigation={slides.length > 1}
      pagination={slides.length > 1 ? { clickable: true } : false}
      className="aspect-[16/9] w-full overflow-hidden rounded-xl border border-border"
      style={
        {
          "--swiper-pagination-color": "#ffffff",
          "--swiper-pagination-bullet-inactive-color": "#ffffff",
          "--swiper-navigation-color": "#ffffff",
          "--swiper-navigation-size": "22px",
        } as React.CSSProperties
      }
    >
      {slides.map((src, index) => (
        <SwiperSlide key={`${src}-${index}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={`${title} - photo ${index + 1}`}
            className="size-full object-cover"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}