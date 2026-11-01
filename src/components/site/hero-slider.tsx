"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"
import { Autoplay, Navigation, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"

import { Button } from "@/components/ui/button"

const SLIDES = [
  {
    image: "/studios/hero.jpg",
    eyebrow: "Photo studios",
    title: "Book the space. Skip the search.",
    text: "Find cyc walls, daylit lofts and styled sets, then reserve the exact hours you need.",
  },
  {
    image: "/studios/studio-3.jpg",
    eyebrow: "Film stages & sound rooms",
    title: "Stages built for your next production.",
    text: "Compare capacity, amenities and hourly rates from verified hosts before you book.",
  },
  {
    image: "/studios/cat-recording.jpg",
    eyebrow: "Music suites & podcast lounges",
    title: "Record in a room that sounds right.",
    text: "Treated rooms, pro gear and transparent pricing. Show up and press record.",
  },
]

export function HeroSlider() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-6 pb-12 sm:px-6 sm:pt-10">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        navigation
        className="h-[460px] overflow-hidden rounded-2xl sm:h-[540px] lg:h-[600px]"
        style={
          {
            "--swiper-pagination-color": "#ffffff",
            "--swiper-pagination-bullet-inactive-color": "#ffffff",
            "--swiper-navigation-color": "#ffffff",
            "--swiper-navigation-size": "22px",
          } as React.CSSProperties
        }
      >
        {SLIDES.map((slide, index) => (
          <SwiperSlide key={slide.title}>
            <div className="relative size-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0}
                sizes="(min-width: 1280px) 1216px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-black/10" />

              <div className="absolute inset-0 flex items-center px-6 pb-8 sm:px-14">
                <div className="flex max-w-xl flex-col items-start gap-4 text-white">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
                    {slide.eyebrow}
                  </span>
                  <h1 className="text-4xl leading-tight font-semibold tracking-tight sm:text-5xl">
                    {slide.title}
                  </h1>
                  <p className="text-base leading-7 text-white/80 sm:text-lg">
                    {slide.text}
                  </p>
                  <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                    <Button
                      size="lg"
                      className="bg-white text-black hover:bg-white/90"
                      render={<Link href="/studios" />}
                    >
                      Explore Studios
                      <ArrowRightIcon data-icon="inline-end" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/40 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                      render={<Link href="/add-studio" />}
                    >
                      Host Your Space
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}