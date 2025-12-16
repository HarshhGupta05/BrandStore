"use client"

import { useState } from "react"
import { useStore } from "@/contexts/store-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, ShoppingCart, Package, Building2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { products, addToCart, user } = useStore()
  const product = products.find((p) => p.id === id)

  const [selectedSize, setSelectedSize] = useState<string>("")
  const [showSizeError, setShowSizeError] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)

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
    // Validate size selection for products with sizes
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

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full rounded-lg shadow-lg" />
        </div>

        <div className="space-y-6">
          <div>
            <div className="mb-2 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              {product.category}
            </div>
            <h1 className="mb-4 text-3xl font-bold text-balance">{product.name}</h1>
            <p className="mb-4 text-4xl font-bold text-primary">${product.price.toFixed(2)}</p>
            {isOutOfStock && <p className="mb-2 text-destructive font-semibold">Out of Stock</p>}
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {product.sizes && product.sizes.length > 0 && !isOutOfStock && (
            <div>
              <label className="mb-2 block text-sm font-semibold">
                Select Size <span className="text-destructive">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    onClick={() => {
                      setSelectedSize(size)
                      setShowSizeError(false)
                    }}
                    className="min-w-[60px]"
                  >
                    {size}
                  </Button>
                ))}
              </div>
              {showSizeError && <p className="mt-2 text-sm text-destructive">Please select a size</p>}
            </div>
          )}

          {user?.role === "admin" && (
            <Card>
              <CardContent className="grid grid-cols-2 gap-4 p-6">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Stock</div>
                    <div className="font-semibold">{product.stock} units</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-xs text-muted-foreground">Manufacturer</div>
                    <div className="font-semibold">{product.manufacturer}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-3">
            <Button size="lg" className="flex-1" onClick={handleAddToCart} disabled={addedToCart || isOutOfStock}>
              <ShoppingCart className="mr-2 h-5 w-5" />
              {isOutOfStock ? "Out of Stock" : addedToCart ? "Added to Cart!" : "Add to Cart"}
            </Button>
            <Button size="lg" variant="outline" onClick={() => router.push("/cart")}>
              View Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
