"use client"

import type React from "react"
import { useState } from "react"
import { useStore } from "@/contexts/store-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"
import { ShoppingBag, Package, CreditCard, Banknote, CheckCircle2 } from "lucide-react"

export default function CheckoutPage() {
  const { cart, createOrder, user, getCartTotal } = useStore()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryOption: "home" as "home" | "pickup",
    paymentMethod: "credit" as "credit" | "debit" | "cod",
  })

  const [isProcessing, setIsProcessing] = useState(false)

  const total = getCartTotal()

  if (!user) {
    router.push("/login?redirect=/checkout")
    return null
  }

  if (cart.length === 0) {
    router.push("/cart")
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    try {
      const order = createOrder({
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        deliveryOption: formData.deliveryOption,
        paymentMethod: formData.paymentMethod,
      })

      // Simulate processing delay
      setTimeout(() => {
        setIsProcessing(false)
        router.push(`/orders?success=${order.id}`)
      }, 1500)
    } catch (error) {
      console.error("Checkout error:", error)
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Checkout</h1>
      <p className="mb-8 text-muted-foreground">Complete your order details</p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form onSubmit={handleCheckout} className="space-y-6">
            {/* Delivery Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    placeholder="123 Main St, Apt 4B, New York, NY 10001"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Delivery Option */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Option</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.deliveryOption}
                  onValueChange={(value) => setFormData({ ...formData, deliveryOption: value as "home" | "pickup" })}
                >
                  <div className="flex items-center space-x-3 rounded-lg border p-4">
                    <RadioGroupItem value="home" id="home" />
                    <Label htmlFor="home" className="flex flex-1 cursor-pointer items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">Home Delivery</p>
                        <p className="text-sm text-muted-foreground">Delivered to your doorstep</p>
                      </div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 rounded-lg border p-4">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup" className="flex flex-1 cursor-pointer items-center gap-2">
                      <Package className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">Store Pickup</p>
                        <p className="text-sm text-muted-foreground">Collect from nearest store</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    setFormData({ ...formData, paymentMethod: value as "credit" | "debit" | "cod" })
                  }
                >
                  <div className="flex items-center space-x-3 rounded-lg border p-4">
                    <RadioGroupItem value="credit" id="credit" />
                    <Label htmlFor="credit" className="flex flex-1 cursor-pointer items-center gap-2">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">Credit Card</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 rounded-lg border p-4">
                    <RadioGroupItem value="debit" id="debit" />
                    <Label htmlFor="debit" className="flex flex-1 cursor-pointer items-center gap-2">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">Debit Card</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 rounded-lg border p-4">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex flex-1 cursor-pointer items-center gap-2">
                      <Banknote className="h-5 w-5 text-muted-foreground" />
                      <span className="font-semibold">Cash on Delivery</span>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Button type="submit" size="lg" className="w-full" disabled={isProcessing}>
              {isProcessing ? (
                <>Processing...</>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-5 w-5" />
                  Place Order
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {cart.map((item) => {
                  const itemKey = item.selectedSize ? `${item.id}-${item.selectedSize}` : item.id
                  return (
                    <div key={itemKey} className="flex justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium line-clamp-1">{item.name}</p>
                        <p className="text-muted-foreground">
                          Qty: {item.quantity}
                          {item.selectedSize && ` • Size: ${item.selectedSize}`}
                        </p>
                      </div>
                      <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  )
                })}
              </div>
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-foreground">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping:</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (10%):</span>
                  <span className="font-semibold text-foreground">${(total * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-3 text-xl font-bold">
                  <span>Total:</span>
                  <span>${(total * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
