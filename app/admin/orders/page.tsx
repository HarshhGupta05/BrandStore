"use client"

import { useState } from "react"
import { useStore } from "@/contexts/store-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead className="w-[300px]">Order Details</TableHead>
                  <TableHead>Total & Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">
                      #{order.id.slice(-6)}
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{order.deliveryDetails.name}</div>
                      <div className="text-xs text-muted-foreground">{order.deliveryDetails.address}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{order.deliveryDetails.phone}</div>
                      <div className="text-xs text-muted-foreground uppercase">{order.deliveryDetails.deliveryOption}</div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1 text-sm">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-start text-xs border-b border-dashed pb-1 last:border-0 last:pb-0">
                            <span>
                              {item.quantity}x {item.productName} {item.selectedSize && `(${item.selectedSize})`}
                            </span>
                            <span className="ml-2 font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="font-bold text-sm">₹{order.total.toFixed(2)}</div>
                        <div className="flex flex-col gap-1">
                          <Badge variant="outline" className="w-fit">
                            {order.orderStatus}
                          </Badge>
                          <Badge className={`w-fit ${getStatusColor(order.deliveryStatus)}`}>
                            {order.deliveryStatus}
                          </Badge>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-3 min-w-[200px]">
                        <div>
                          <Label htmlFor={`agent-${order.id}`} className="text-xs">
                            Delivery Agent
                          </Label>
                          <Input
                            id={`agent-${order.id}`}
                            placeholder="Agent Name"
                            value={deliveryAgents[order.id] || ""}
                            onChange={(e) =>
                              setDeliveryAgents((prev) => ({
                                ...prev,
                                [order.id]: e.target.value,
                              }))
                            }
                            className="h-8 text-xs mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs mb-1 block">Update Status</Label>
                          <Select
                            value={order.deliveryStatus}
                            onValueChange={(value) => handleStatusChange(order.id, value as Order["deliveryStatus"])}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="In Process">In Process</SelectItem>
                              <SelectItem value="Delivered">Delivered</SelectItem>
                              <SelectItem value="Rejected">Rejected</SelectItem>
                              <SelectItem value="Not Received">Not Received</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
