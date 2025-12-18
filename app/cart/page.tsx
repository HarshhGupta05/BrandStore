"use client"

import { useStore } from "@/contexts/store-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useStore()

  const total = getCartTotal()

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
        <h1 className="mb-2 text-3xl font-bold">Your Cart is Empty</h1>
        <p className="mb-6 text-muted-foreground">Start shopping to add items to your cart</p>
        <Link href="/categories">
          <Button size="lg">
            Browse Products
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Shopping Cart</h1>
      <p className="mb-8 text-muted-foreground">
        {cart.length} {cart.length === 1 ? "item" : "items"} in your cart
      </p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {cart.map((item) => {
            // Create unique key combining id and size
            const itemKey = item.selectedSize ? `${item.id}-${item.selectedSize}` : item.id

            return (
              <Card key={itemKey}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <img
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      className="h-24 w-24 rounded object-cover"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h3 className="font-semibold line-clamp-1">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                        {item.selectedSize && <p className="text-sm font-medium">Size: {item.selectedSize}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedSize)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center font-semibold">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedSize)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <p className="text-lg font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => removeFromCart(item.id, item.selectedSize)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div>
          <Card className="sticky top-4">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-bold">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({cart.reduce((sum, item) => sum + item.quantity, 0)} items):</span>
                  <span className="font-semibold text-foreground">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping:</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax:</span>
                  <span className="font-semibold text-foreground">₹{(total * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span>₹{(total * 1.1).toFixed(2)}</span>
                </div>
              </div>
              <Link href="/checkout">
                <Button size="lg" className="w-full">
                  Proceed to Checkout
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/categories">
                <Button size="lg" variant="outline" className="w-full bg-transparent">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
