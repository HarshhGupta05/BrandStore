"use client"

import * as React from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

// ... (imports remain)

const heroSlides = [
  {
    id: 1,
    title: "Wear Your Pride",
    description: "Exclusive IEM branded apparel for students and faculty. Show your spirit with style.",
    cta: "Shop Apparel",
    link: "/categories?category=Clothing",
    bgClass: "bg-gradient-to-br from-primary via-slate-900 to-black",
    image: "/tshirt-white.jpg" // Changed from iem-tshirt.png to existing white tshirt
  },
  {
    id: 2,
    title: "Campus Essentials",
    description: "Mugs, notebooks, and gear to keep you powered through the semester.",
    cta: "Explore Accessories",
    link: "/categories?category=Accessories",
    bgClass: "bg-gradient-to-br from-slate-900 via-slate-800 to-primary/80",
    image: "/iem-mug.jpeg"
  },
  {
    id: 3,
    title: "IEM Spirit Collection",
    description: "Celebrate your journey with our premium university merchandise. Perfect for gifting.",
    cta: "View Collection",
    link: "/categories?category=Stationary",
    bgClass: "bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-800",
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
    <div className="relative w-full max-w-[1400px] mx-auto mb-16 overflow-hidden md:rounded-3xl shadow-2xl border border-white/10 ring-1 ring-black/5">
      <Carousel setApi={setApi} className="w-full" opts={{ loop: true }}>
        <CarouselContent>
          {heroSlides.map((slide) => (
            <CarouselItem key={slide.id}>
              <div className={`relative min-h-[550px] grid md:grid-cols-2 ${slide.bgClass} text-white overflow-hidden`}>

                {/* Subtle Grain/Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay pointer-events-none"></div>

                {/* Abstract Geometric Overlay */}
                <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none"></div>

                {/* Left Content */}
                <div className="relative z-10 flex flex-col justify-center p-8 md:pl-24 space-y-8 order-2 md:order-1 items-center text-center md:items-start md:text-left">
                  <div className="animate-in fade-in slide-in-from-left-8 duration-700 delay-100 max-w-2xl">
                    <div className="inline-block px-3 py-1 mb-6 rounded-full bg-white/10 backdrop-blur-md border border-white/10">
                      <span className="text-xs font-semibold tracking-widest uppercase text-white/80">Premium Collection 2025</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance drop-shadow-lg leading-[1.1]">
                      {slide.title}
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-white/80 font-light max-w-lg leading-relaxed mx-auto md:mx-0">
                      {slide.description}
                    </p>
                    <div className="pt-8 md:pt-10 w-full flex justify-center md:justify-start gap-4">
                      <Link href={slide.link}>
                        <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold px-8 py-7 text-base rounded-md shadow-xl transition-all hover:translate-y-[-2px]">
                          {slide.cta} <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Right Image */}
                <div className="relative z-10 flex items-center justify-center h-full order-1 md:order-2 p-8 md:p-12">
                  <div className="relative w-full h-full flex items-center justify-center animate-in fade-in zoom-in-95 duration-1000">
                    {/* Professional Glow */}
                    <div className="absolute inset-0 bg-white/10 blur-[100px] rounded-full transform scale-75 opacity-30"></div>
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="relative w-full h-full max-h-[450px] object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>

              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block">
          <CarouselPrevious className="left-8 h-12 w-12 bg-white/5 hover:bg-white/20 border-white/10 text-white backdrop-blur-md transition-all hover:scale-110" />
          <CarouselNext className="right-8 h-12 w-12 bg-white/5 hover:bg-white/20 border-white/10 text-white backdrop-blur-md transition-all hover:scale-110" />
        </div>
      </Carousel>

      {/* Modern Dots Indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 rounded-full transition-all duration-500 ${index === current ? "bg-white w-8 delay-100" : "bg-white/30 w-1.5 hover:bg-white/50"
              }`}
            onClick={() => api?.scrollTo(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
