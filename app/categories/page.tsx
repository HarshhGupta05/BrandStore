"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { categories } from "@/lib/dummy-data"
import { useStore } from "@/contexts/store-context"
import { ShoppingCart } from "lucide-react"

export default function CategoriesPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryFromUrl = searchParams.get("category")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryFromUrl)
  const { products, addToCart, user } = useStore()
  const [addedToCart, setAddedToCart] = useState<string | null>(null)

  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl)
    }
  }, [categoryFromUrl])

  const availableProducts = products.filter((p) => p.stock > 0)
  const filteredProducts = selectedCategory
    ? availableProducts.filter((p) => p.category === selectedCategory)
    : availableProducts

  const handleAddToCart = (product: (typeof products)[0]) => {
    // Only allow direct add to cart for products without sizes
    if (product.sizes && product.sizes.length > 0) {
      // Redirect to product page for size selection
      router.push(`/products/${product.id}`)
      return
    }
    addToCart(product)
    setAddedToCart(product.id)
    setTimeout(() => setAddedToCart(null), 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Browse Products</h1>
      <p className="mb-6 text-muted-foreground">Discover our wide selection of quality products</p>

      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <Button variant={selectedCategory === null ? "default" : "outline"} onClick={() => setSelectedCategory(null)}>
          All Products
        </Button>
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <Link href={`/products/${product.id}`}>
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="h-48 w-full cursor-pointer object-cover transition-transform hover:scale-105"
              />
            </Link>
            <CardContent className="p-4">
              <div className="mb-1 text-xs font-medium text-muted-foreground uppercase">{product.category}</div>
              <Link href={`/products/${product.id}`}>
                <h3 className="mb-2 cursor-pointer font-semibold hover:text-primary line-clamp-1">{product.name}</h3>
              </Link>
              <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xl font-bold">₹{product.price.toFixed(2)}</span>
                {user?.role === "admin" && (
                  <span className="text-xs text-muted-foreground">{product.stock} in stock</span>
                )}
              </div>
              <Button className="w-full" onClick={() => handleAddToCart(product)} disabled={addedToCart === product.id}>
                {addedToCart === product.id ? (
                  "Added!"
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {product.sizes && product.sizes.length > 0 ? "Select Size" : "Add to Cart"}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
