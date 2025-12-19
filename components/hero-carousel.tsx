"use client"

import * as React from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

const heroSlides = [
  {
    id: 1,
    title: "Elevate Your Corporate Identity",
    description: "Premium merchandise for the modern professional. Showcase your brand with style.",
    cta: "Shop Collections",
    link: "/categories?category=Clothing",
    bgClass: "bg-gradient-to-r from-primary to-primary/80",
    image: "/cotton-tshirt.png"
  },
  {
    id: 2,
    title: "Executive Accessories",
    description: "Refined tools for your daily workflow. Enhance productivity with elegance.",
    cta: "Explore Accessories",
    link: "/categories?category=Accessories",
    bgClass: "bg-gradient-to-r from-slate-800 to-slate-900",
    image: "/black-leather-jacket.png"
  },
  {
    id: 3,
    title: "Signature Gift Sets",
    description: "The perfect way to say thank you to your team. Memorable gifts for every occasion.",
    cta: "View Gifts",
    link: "/categories?category=Stationary",
    bgClass: "bg-gradient-to-r from-blue-900 to-indigo-900",
    image: "/iem-giftware.jpeg"
  },
]

export function HeroCarousel() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  React.useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])

  // Autoplay effect
  React.useEffect(() => {
    if (!api) return
    const interval = setInterval(() => {
      api.scrollNext()
    }, 5000)
    return () => clearInterval(interval)
  }, [api])

  return (
    <div className="relative w-full max-w-7xl mx-auto mb-12 overflow-hidden rounded-2xl shadow-2xl">
      <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
        <CarouselContent>
          {heroSlides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className={`relative min-h-[500px] grid md:grid-cols-2 ${slide.bgClass} text-white`}>

                {/* Abstract Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none"></div>

                {/* Left Content */}
                <div className="relative z-10 flex flex-col justify-center p-12 md:pl-20 space-y-6 order-2 md:order-1">
                  <div className="animate-in fade-in slide-in-from-left-8 duration-700 delay-100">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance drop-shadow-md leading-tight">
                      {slide.title}
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-white/90 font-light max-w-lg leading-relaxed">
                      {slide.description}
                    </p>
                    <div className="pt-8">
                      <Link href={slide.link}>
                        <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-6 text-lg rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95">
                          {slide.cta} <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right Image */}
                <div className="relative z-10 flex items-center justify-center p-8 md:p-12 order-1 md:order-2">
                  <div className="relative w-full h-full max-h-[400px] flex items-center justify-center animate-in fade-in zoom-in-95 duration-1000">
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full transform scale-75 opacity-50"></div>
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="relative max-h-full max-w-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-500 rounded-xl"
                    />
                  </div>
                </div>

              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="left-4 bg-white/10 hover:bg-white/30 border-none text-white backdrop-blur-sm" />
          <CarouselNext className="right-4 bg-white/10 hover:bg-white/30 border-none text-white backdrop-blur-sm" />
        </div>
      </Carousel>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 shadow-sm ${index === current ? "bg-white scale-125 w-8" : "bg-white/40 hover:bg-white/60"
              }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
