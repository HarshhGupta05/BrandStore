"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStore } from "@/contexts/store-context"
import { Badge } from "@/components/ui/badge"
import { Package, AlertTriangle } from "lucide-react"

export default function AdminStockPage() {
  const { products, updateStock } = useStore()
  const [stockUpdates, setStockUpdates] = useState<Record<string, string>>({})

  const handleStockChange = (productId: string, value: string) => {
    setStockUpdates({ ...stockUpdates, [productId]: value })
  }

  const handleUpdateStock = (productId: string) => {
    const newStock = Number.parseInt(stockUpdates[productId])
    if (!isNaN(newStock) && newStock >= 0) {
      updateStock(productId, newStock)
      const newUpdates = { ...stockUpdates }
      delete newUpdates[productId]
      setStockUpdates(newUpdates)
    }
  }

  const lowStockProducts = products.filter((p) => p.stock < 20 && p.stock > 0)
  const outOfStockProducts = products.filter((p) => p.stock === 0)

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Stock Management</h1>
      <p className="mb-8 text-muted-foreground">Monitor and update inventory levels across all products</p>

      {/* Alert Cards */}
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <CardTitle className="text-lg">Low Stock Alert</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{lowStockProducts.length}</p>
            <p className="text-sm text-muted-foreground">Products below 20 units</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-red-600" />
              <CardTitle className="text-lg">Out of Stock</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{outOfStockProducts.length}</p>
            <p className="text-sm text-muted-foreground">Products unavailable</p>
          </CardContent>
        </Card>
      </div>

      {/* Stock Management Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Levels ({products.length} Products)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product) => {
              const currentStockValue = stockUpdates[product.id] ?? product.stock.toString()
              const isModified = stockUpdates[product.id] !== undefined

              return (
                <div key={product.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="h-12 w-12 rounded object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{product.name}</p>
                        {product.stock === 0 && <Badge variant="destructive">Out of Stock</Badge>}
                        {product.stock > 0 && product.stock < 20 && (
                          <Badge variant="outline" className="border-orange-500 text-orange-600">
                            Low Stock
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {product.category} • Manufacturer: {product.manufacturer}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="0"
                        value={currentStockValue}
                        onChange={(e) => handleStockChange(product.id, e.target.value)}
                        className="w-24"
                      />
                      <span className="text-sm text-muted-foreground">units</span>
                    </div>
                    <Button
                      variant={isModified ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleUpdateStock(product.id)}
                      disabled={!isModified}
                    >
                      {isModified ? "Update" : "No Change"}
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
