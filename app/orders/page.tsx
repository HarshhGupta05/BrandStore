"use client"

import { useEffect, useState } from "react"
import { useStore } from "@/contexts/store-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter, useSearchParams } from "next/navigation"
import { Package, CheckCircle2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function OrdersPage() {
  const { user, getAllOrders } = useStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    const successOrderId = searchParams.get("success")
    if (successOrderId) {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
    }
  }, [searchParams])

  if (!user) {
    router.push("/login?redirect=/orders")
    return null
  }

  const orders = getAllOrders()

  return (
    <div className="container mx-auto px-4 py-8">
      {showSuccess && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">Order placed successfully!</p>
              <p className="text-sm text-green-700">You will receive a confirmation email shortly.</p>
            </div>
          </CardContent>
        </Card>
      )}

      <h1 className="mb-2 text-3xl font-bold">My Orders</h1>
      <p className="mb-8 text-muted-foreground">Track and view your order history</p>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">No orders yet</h2>
            <p className="mb-6 text-muted-foreground">Start shopping to create your first order</p>
            <Link href="/categories">
              <Button size="lg">Browse Products</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="mb-1 flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Order #{order.id}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Placed on {new Date(order.createdAt).toLocaleDateString()} at{" "}
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge
                      variant={order.orderStatus === "Placed" ? "default" : "secondary"}
                      className="justify-center"
                    >
                      {order.orderStatus}
                    </Badge>
                    <Badge variant="outline" className="justify-center">
                      {order.deliveryStatus}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Order Items */}
                  <div className="space-y-2">
                    <h3 className="font-semibold">Items:</h3>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>
                          {item.productName} {item.selectedSize && `(${item.selectedSize})`} x {item.quantity}
                        </span>
                        <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Details */}
                  <div className="rounded-lg bg-muted p-4">
                    <h3 className="mb-2 font-semibold">Delivery Details:</h3>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-muted-foreground">Name:</span> {order.deliveryDetails.name}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Phone:</span> {order.deliveryDetails.phone}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Address:</span> {order.deliveryDetails.address}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Delivery Option:</span>{" "}
                        {order.deliveryDetails.deliveryOption === "home" ? "Home Delivery" : "Store Pickup"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Payment Method:</span>{" "}
                        {order.deliveryDetails.paymentMethod.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="flex justify-between border-t pt-4 text-lg font-bold">
                    <span>Total:</span>
                    <span>₹{order.total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
