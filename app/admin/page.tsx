"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FunctionComponent, useEffect, useState } from "react"
import { Package, ShoppingCart, DollarSign, Users } from "lucide-react"
import { useStore } from "@/contexts/store-context"

export default function AdminDashboard() {
  const { products, orders, fetchOrders } = useStore()

  useEffect(() => {
    fetchOrders()
  }, [])

  const totalProducts = products.length
  // Total Orders: All orders placed (excluding cancelled maybe? User said "as per orders placed". Usually means total count. Let's stick to total count or maybe exclude Cancelled if that's what "placed" implies. But typically "placed" is a status. "As per orders placed" probably means count of valid orders. Let's use total length for now, or filter out cancelled?)
  // Re-reading: "fix the revenue and orders part as per orders placed". Maybe they mean count orders that are successfully placed (so not cancelled?). And revenue "as per orders delivered".
  // Let's count all orders for "Total Orders" as that's standard, possibly excluding cancelled if the user wants "placed" to mean "active".
  // Actually, usually "Total Orders" is the count of all orders. 
  // Let's look at the current dummy implementation: `dummyOrders.length`. 
  // I will use `orders.length` but let's filter just in case the user meant "active". No, "orders placed" usually just means total volume. I will use `orders.length` but typically you might want to exclude strictly invalid ones.
  // However, for Revenue, strictly "delivered".

  const totalOrders = orders.length

  const totalRevenue = orders
    .filter(order => order.deliveryStatus === "Delivered")
    .reduce((sum, order) => sum + order.total, 0)

  const totalStock = products.reduce((sum, product) => sum + product.stock, 0)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStock}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Admin dashboard placeholder content</p>
        </CardContent>
      </Card>
    </div>
  )
}
