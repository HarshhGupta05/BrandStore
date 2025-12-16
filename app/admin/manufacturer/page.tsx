"use client"

import type React from "react"

import { useState } from "react"
import { useStore } from "@/contexts/store-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Factory, Plus, Pencil, Trash2 } from "lucide-react"
import type { ManufacturerOrder } from "@/contexts/store-context"

export default function AdminManufacturerPage() {
  const { products, manufacturerOrders, createManufacturerOrder, updateManufacturerOrder, deleteManufacturerOrder } =
    useStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [editingOrder, setEditingOrder] = useState<ManufacturerOrder | null>(null)

  const [formData, setFormData] = useState({
    productId: "",
    quantity: "",
    cost: "",
    orderDate: new Date().toISOString().split("T")[0],
    expectedArrival: "",
    status: "Ordered" as ManufacturerOrder["status"],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const product = products.find((p) => p.id === formData.productId)
    if (!product) return

    createManufacturerOrder({
      productId: formData.productId,
      productName: product.name,
      quantity: Number.parseInt(formData.quantity),
      cost: Number.parseFloat(formData.cost),
      orderDate: formData.orderDate,
      expectedArrival: formData.expectedArrival,
      status: formData.status,
    })

    setFormData({
      productId: "",
      quantity: "",
      cost: "",
      orderDate: new Date().toISOString().split("T")[0],
      expectedArrival: "",
      status: "Ordered",
    })
    setIsCreateOpen(false)
  }

  const handleEdit = (order: ManufacturerOrder) => {
    setEditingOrder(order)
    setIsEditOpen(true)
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingOrder) return

    const formElement = e.target as HTMLFormElement
    const formData = new FormData(formElement)

    updateManufacturerOrder(editingOrder.id, {
      quantity: Number.parseInt(formData.get("quantity") as string),
      cost: Number.parseFloat(formData.get("cost") as string),
      orderDate: formData.get("orderDate") as string,
      expectedArrival: formData.get("expectedArrival") as string,
      status: formData.get("status") as ManufacturerOrder["status"],
    })

    setIsEditOpen(false)
    setEditingOrder(null)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this manufacturer order?")) {
      deleteManufacturerOrder(id)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Received":
        return "bg-green-100 text-green-800 border-green-200"
      case "In Transit":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Ordered":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return ""
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Manufacturer Orders</h1>
          <p className="text-muted-foreground">Create and manage orders from manufacturers to restock inventory</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Manufacturer Order</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="product">Product</Label>
                <Select
                  value={formData.productId}
                  onValueChange={(value) => setFormData({ ...formData, productId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} (Stock: {product.stock})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  required
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="cost">Cost per Unit ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="orderDate">Order Date</Label>
                <Input
                  id="orderDate"
                  type="date"
                  required
                  value={formData.orderDate}
                  onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="expectedArrival">Expected Arrival</Label>
                <Input
                  id="expectedArrival"
                  type="date"
                  required
                  value={formData.expectedArrival}
                  onChange={(e) => setFormData({ ...formData, expectedArrival: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ordered">Ordered</SelectItem>
                    <SelectItem value="In Transit">In Transit</SelectItem>
                    <SelectItem value="Received">Received</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Create Order
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {manufacturerOrders.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Factory className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">No manufacturer orders yet</h2>
            <p className="text-muted-foreground">Create your first order to restock inventory from manufacturers</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Factory className="h-5 w-5" />
              All Manufacturer Orders ({manufacturerOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Cost/Unit</TableHead>
                    <TableHead className="text-right">Total Cost</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Expected Arrival</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {manufacturerOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.productName}</TableCell>
                      <TableCell className="text-right">{order.quantity}</TableCell>
                      <TableCell className="text-right">${order.cost.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${(order.quantity * order.cost).toFixed(2)}</TableCell>
                      <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(order.expectedArrival).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(order)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(order.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Manufacturer Order</DialogTitle>
          </DialogHeader>
          {editingOrder && (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <Label>Product</Label>
                <Input value={editingOrder.productName} disabled />
              </div>

              <div>
                <Label htmlFor="edit-quantity">Quantity</Label>
                <Input
                  id="edit-quantity"
                  name="quantity"
                  type="number"
                  min="1"
                  required
                  defaultValue={editingOrder.quantity}
                />
              </div>

              <div>
                <Label htmlFor="edit-cost">Cost per Unit ($)</Label>
                <Input
                  id="edit-cost"
                  name="cost"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  defaultValue={editingOrder.cost}
                />
              </div>

              <div>
                <Label htmlFor="edit-orderDate">Order Date</Label>
                <Input
                  id="edit-orderDate"
                  name="orderDate"
                  type="date"
                  required
                  defaultValue={editingOrder.orderDate}
                />
              </div>

              <div>
                <Label htmlFor="edit-expectedArrival">Expected Arrival</Label>
                <Input
                  id="edit-expectedArrival"
                  name="expectedArrival"
                  type="date"
                  required
                  defaultValue={editingOrder.expectedArrival}
                />
              </div>

              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select name="status" defaultValue={editingOrder.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ordered">Ordered</SelectItem>
                    <SelectItem value="In Transit">In Transit</SelectItem>
                    <SelectItem value="Received">Received</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                {editingOrder.status !== "Received" && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Note: Marking as "Received" will automatically increase product stock
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Update Order
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditOpen(false)
                    setEditingOrder(null)
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
