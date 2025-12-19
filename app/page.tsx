"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { categories } from "@/lib/dummy-data"
import { categories as dummyCategories } from "@/lib/dummy-data" // Renamed to avoid conflict
import { useStore } from "@/contexts/store-context"
import { ArrowRight, ShoppingBag } from "lucide-react"
import { HeroCarousel } from "@/components/hero-carousel"
import { ProductCarousel } from "@/components/product-carousel"

export default function HomePage() {
  const { products, categories } = useStore()
  const featuredProducts = products.filter((p) => p.stock > 0).slice(0, 4) // Show 4 products for better grid
  const bestSellers = products.filter((p) => p.stock > 0).slice(4, 9)

  return (
    <div className="min-h-screen">

      {/* Hero Section with Carousel */}
      <section className="pt-8 pb-12 px-4 md:px-6">
        <HeroCarousel />
      </section>

      {/* Curated Collections / Categories */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center tracking-tight">Curated Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => {
              // Cycle through 3 distinct gradients
              const gradients = [
                "from-pink-100 to-pink-50",
                "from-blue-100 to-blue-50",
                "from-green-100 to-green-50",
                "from-purple-100 to-purple-50",
                "from-orange-100 to-orange-50",
                "from-teal-100 to-teal-50"
              ]
              const currentGradient = gradients[index % gradients.length]

              return (
                <Link key={category.id} href={`/categories?category=${category.name}`} className="group cursor-pointer">
                  <div className="relative h-64 overflow-hidden rounded-2xl mb-4 shadow-lg bg-white/40 backdrop-blur-md">
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${currentGradient} transition-transform duration-500 group-hover:scale-110`} />

                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                      <div className="p-4 bg-white/80 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                        <ShoppingBag className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold text-foreground/90 group-hover:text-primary transition-colors">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Browse Collection</p>
                    </div>
                  </div>
                </Link>
              )
            })}
            {categories.length === 0 && (
              <div className="col-span-3 text-center text-muted-foreground">Loading collections...</div>
            )}
          </div>
        </div>
      </section>

      {/* Featured Products - Now using Swiper/Carousel */}
      <section>
        <ProductCarousel products={featuredProducts} title="Featured Arrivals" />
      </section>

      {/* Best Sellers Section - Another Carousel */}
      <section>
        <ProductCarousel products={featuredProducts.slice().reverse()} title="Best Sellers" />
      </section>

      {/* Trust/Business Features Banner */}
      <section className="rounded-2xl bg-primary text-primary-foreground p-12 overflow-hidden relative shadow-2xl">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 mix-blend-overlay"></div>
        <div className="relative z-10 grid md:grid-cols-3 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <ShieldCheckIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Premium Quality</h3>
              <p className="text-primary-foreground/80 mt-1">Certified materials and craftsmanship.</p>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <TruckIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Fast Delivery</h3>
              <p className="text-primary-foreground/80 mt-1">Priority shipping for corporate orders.</p>
            </div>
          </div>
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <HeadphonesIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Dedicated Support</h3>
              <p className="text-primary-foreground/80 mt-1">24/7 service for your branding needs.</p>
            </div>
          </div>
        </div>
      </section>
    </div>

  )
}

function ShieldCheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function TruckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
      <path d="M15 18H9" />
      <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
      <circle cx="17" cy="18" r="2" />
      <circle cx="7" cy="18" r="2" />
    </svg>
  )
}

function HeadphonesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2Z" />
      <path d="M15 14v3a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2Z" />
      <path d="M4 14v-3a8 8 0 1 1 16 0v3" />
    </svg>
  )
}
