"use client"

import { useState, useEffect } from "react"
import { useStore } from "@/contexts/store-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ShoppingCart, Package, Building2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"

export default function ProductDetailPage() {
  const params = useParams()
  const id = params.id as string
  const router = useRouter()
  const { products, addToCart, user } = useStore()
  const product = products.find((p) => p.id === id)

  const [selectedSize, setSelectedSize] = useState<string>("")
  const [showSizeError, setShowSizeError] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [displayImages, setDisplayImages] = useState<string[]>([])

  // Initialize gallery when product loads
  useEffect(() => {
    if (product) {
      const imgs = product.images && product.images.length > 0
        ? product.images
        : [product.image || "/placeholder.svg"]
      setDisplayImages(imgs)
    }
  }, [product])

  const handleThumbnailClick = (index: number) => {
    // Requirements: "Update the image array order so the active image is always at index 0"
    if (index === 0) return

    const newImages = [...displayImages]
    const [clickedImage] = newImages.splice(index, 1)
    newImages.unshift(clickedImage)

    setDisplayImages(newImages)
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-lg text-muted-foreground">Product not found</p>
        <div className="mt-4 text-center">
          <Link href="/categories">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    )
  }

  const isOutOfStock = product.stock === 0

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setShowSizeError(true)
      return
    }

    addToCart(product, selectedSize || undefined)
    setAddedToCart(true)
    setTimeout(() => {
      setAddedToCart(false)
    }, 2000)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/categories">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </Link>

      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Gallery Section */}
        <div className="space-y-4">
          {/* Main Image (Always Index 0) */}
          <div className="aspect-square overflow-hidden rounded-xl border bg-white shadow-sm">
            <img
              src={displayImages[0] || "/placeholder.svg"}
              alt={product.name}
              className="h-full w-full object-contain p-4 transition-all duration-300 ease-in-out"
            />
          </div>

          {/* Thumbnails (Index 1+) */}
          {displayImages.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {displayImages.slice(1).map((img, i) => (
                <button
                  key={i + 1} // using index as key because order changes are intentional visual updates
                  onClick={() => handleThumbnailClick(i + 1)}
                  className="relative aspect-square w-24 flex-shrink-0 overflow-hidden rounded-lg border bg-white hover:ring-2 hover:ring-primary transition-all"
                >
                  <img src={img} alt={`${product.name} view ${i + 2}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="space-y-8">
          <div>
            <div className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary uppercase tracking-wider">
              {product.category}
            </div>
            <h1 className="mb-4 text-4xl font-bold text-foreground tracking-tight">{product.name}</h1>
            <p className="text-3xl font-bold text-primary">₹{product.price.toFixed(2)}</p>
          </div>

          <div className="prose prose-sm text-muted-foreground leading-relaxed">
            <p>{product.description}</p>
          </div>

          {isOutOfStock && <div className="p-4 bg-destructive/10 text-destructive font-semibold rounded-lg">Out of Stock</div>}

          {product.sizes && product.sizes.length > 0 && !isOutOfStock && (
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">
                Select Size <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => {
                      setSelectedSize(size)
                      setShowSizeError(false)
                    }}
                    className={`min-w-[60px] h-12 text-base ${selectedSize === size ? 'shadow-md' : ''}`}
                  >
                    {size}
                  </Button>
                ))}
              </div>
              {showSizeError && <p className="text-sm text-destructive font-medium animate-pulse">Please select a size</p>}
            </div>
          )}

          <div className="flex flex-col gap-4 pt-4 border-t">
            <div className="flex gap-4">
              <Button size="lg" className="flex-1 h-14 text-lg shadow-lg font-bold" onClick={handleAddToCart} disabled={addedToCart || isOutOfStock}>
                <ShoppingCart className="mr-2 h-6 w-6" />
                {isOutOfStock ? "Out of Stock" : addedToCart ? "Added to Cart!" : "Add to Cart"}
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 border-2" onClick={() => router.push("/cart")}>
                View Cart
              </Button>
            </div>
          </div>

          {user?.role === "admin" && (
            <div className="rounded-xl border bg-muted/30 p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Admin Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded-lg shadow-sm">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Stock Level</div>
                    <div className="font-semibold text-sm">{product.stock} units</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-background rounded-lg shadow-sm">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Manufacturer</div>
                    <div className="font-semibold text-sm">{product.manufacturer}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
