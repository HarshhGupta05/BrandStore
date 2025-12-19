"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { categories } from "@/lib/dummy-data"
import { useStore } from "@/contexts/store-context"
import { ArrowRight, ShoppingBag } from "lucide-react"
import { HeroCarousel } from "@/components/hero-carousel"
import { ProductCarousel } from "@/components/product-carousel"

export default function HomePage() {
  const { products } = useStore()
  // Filter for featured products (e.g., in stock)
  const featuredProducts = products.filter((p) => p.stock > 0)

  return (
    <div className="min-h-screen">

      {/* Hero Section with Carousel */}
      <section className="pt-8 pb-4 px-4 md:px-6">
        <HeroCarousel />
      </section>

      <div className="container mx-auto px-4 pb-20 space-y-16">

        {/* Categories Section - Classy Cards with Glass Effect */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-primary">Curated Collections</h2>
              <p className="text-muted-foreground mt-1">Explore our range of premium branded merchandise.</p>
            </div>
            <Link href="/categories" className="hidden md:flex items-center text-primary font-medium hover:underline">
              View All Categories <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link key={category} href={`/categories?category=${category}`} className="group">
                <Card className="h-full border-none shadow-sm hover:shadow-xl transition-all duration-500 bg-white/40 backdrop-blur-md overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="p-10 flex flex-col items-center justify-center text-center space-y-4">
                    <div className="p-4 bg-white rounded-full shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                      <ShoppingBag className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-2xl text-foreground group-hover:text-primary transition-colors">{category}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Browse Collection</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
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
