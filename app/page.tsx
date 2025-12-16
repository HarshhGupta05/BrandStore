"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { categories } from "@/lib/dummy-data"
import { useStore } from "@/contexts/store-context"
import { ArrowRight } from "lucide-react"

export default function HomePage() {
  const { products } = useStore()
  const featuredProducts = products.filter((p) => p.stock > 0).slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="mb-12 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 p-12 text-center">
        <h1 className="mb-4 text-4xl font-bold text-balance">Welcome to E-Shop</h1>
        <p className="mb-6 text-lg text-muted-foreground text-balance">
          Discover amazing products at unbeatable prices
        </p>
        <Link href="/categories">
          <Button size="lg">
            Shop Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Categories */}
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <Link key={category} href={`/categories?category=${category}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <p className="font-semibold">{category}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="mb-6 text-2xl font-bold">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
                  <p className="text-xl font-bold">${product.price}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
