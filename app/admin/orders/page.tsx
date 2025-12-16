"use client"

import { useState } from "react"
import { useStore } from "@/contexts/store-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package, ShoppingBag } from "lucide-react"
import type { Order } from "@/contexts/store-context"

export default function AdminOrdersPage() {
  const { getAllOrders, updateOrderDeliveryStatus } = useStore()
  const orders = getAllOrders()
  const [deliveryAgents, setDeliveryAgents] = useState<Record<string, string>>({})

  const handleStatusChange = (orderId: string, newStatus: Order["deliveryStatus"]) => {
    const agent = deliveryAgents[orderId]
    updateOrderDeliveryStatus(orderId, newStatus, agent)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200"
      case "In Process":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Rejected":
        return "bg-red-100 text-red-800 border-red-200"
      case "Not Received":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return ""
    }
  }

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Orders Management</h1>
      <p className="mb-8 text-muted-foreground">View and manage all customer orders with delivery status tracking</p>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ShoppingBag className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">No orders yet</h2>
            <p className="text-muted-foreground">Orders will appear here once customers start placing them</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              All Orders ({orders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="rounded-lg border p-4">
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <p className="font-semibold">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()} at{" "}
                        {new Date(order.createdAt).toLocaleTimeString()}
                      </p>
                      <p className="text-sm text-muted-foreground">User ID: {order.userId}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge variant="outline" className="justify-center">
                        {order.orderStatus}
                      </Badge>
                      <Badge className={getStatusColor(order.deliveryStatus)}>{order.deliveryStatus}</Badge>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-3 space-y-1">
                    <p className="text-sm font-semibold">Items:</p>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm text-muted-foreground">
                        <span>
                          {item.productName} {item.selectedSize && `(${item.selectedSize})`} x {item.quantity}
                        </span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Delivery Details */}
                  <div className="mb-3 rounded bg-muted p-3">
                    <p className="mb-1 text-sm font-semibold">Delivery Details:</p>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>
                        {order.deliveryDetails.name} • {order.deliveryDetails.phone}
                      </p>
                      <p>{order.deliveryDetails.address}</p>
                      <p>
                        {order.deliveryDetails.deliveryOption === "home" ? "Home Delivery" : "Store Pickup"} •{" "}
                        {order.deliveryDetails.paymentMethod.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="mb-3 flex justify-between border-t pt-3 font-bold">
                    <span>Total:</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>

                  <div className="mb-3 rounded bg-background p-3">
                    <Label htmlFor={`agent-${order.id}`} className="text-sm">
                      Delivery Agent Name
                    </Label>
                    <Input
                      id={`agent-${order.id}`}
                      placeholder="Enter delivery agent name"
                      value={deliveryAgents[order.id] || ""}
                      onChange={(e) =>
                        setDeliveryAgents((prev) => ({
                          ...prev,
                          [order.id]: e.target.value,
                        }))
                      }
                      className="mt-1"
                    />
                  </div>

                  {/* Delivery Status Update */}
                  <div className="flex items-center gap-2 rounded bg-background p-2">
                    <span className="text-sm font-medium">Update Status:</span>
                    <Select
                      value={order.deliveryStatus}
                      onValueChange={(value) => handleStatusChange(order.id, value as Order["deliveryStatus"])}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="In Process">In Process</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                        <SelectItem value="Not Received">Not Received</SelectItem>
                      </SelectContent>
                    </Select>
                    {order.deliveryStatus === "Delivered" && (
                      <Badge variant="outline" className="text-xs">
                        Stock Updated & Logged
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
