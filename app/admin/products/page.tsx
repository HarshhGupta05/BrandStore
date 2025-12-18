"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/contexts/store-context"
import { categories } from "@/lib/dummy-data"
import { Plus, Pencil, Trash2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useStore()
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
    manufacturer: "",
    sizes: "",
  })

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      stock: "",
      manufacturer: "",
      sizes: "",
    })
    setIsAddingProduct(false)
    setEditingProduct(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const productData = {
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      category: formData.category,
      image: formData.image || "/placeholder.svg",
      stock: Number.parseInt(formData.stock),
      manufacturer: formData.manufacturer,
      sizes: formData.sizes ? formData.sizes.split(",").map((s) => s.trim()) : undefined,
    }

    if (editingProduct) {
      updateProduct(editingProduct, productData)
    } else {
      addProduct(productData)
    }

    resetForm()
  }

  const handleEdit = (product: any) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      stock: product.stock.toString(),
      manufacturer: product.manufacturer,
      sizes: product.sizes ? product.sizes.join(", ") : "",
    })
    setEditingProduct(product.id)
    setIsAddingProduct(true)
  }

  const handleDeactivate = (productId: string) => {
    if (confirm("Are you sure you want to deactivate this product?")) {
      deleteProduct(productId)
    }
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="mb-2 text-3xl font-bold">Products Management</h1>
          <p className="text-muted-foreground">Add, edit, and manage your product catalog</p>
        </div>
        {!isAddingProduct && (
          <Button onClick={() => setIsAddingProduct(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Product
          </Button>
        )}
      </div>

      {isAddingProduct && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
              <Button variant="ghost" size="icon" onClick={resetForm}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="manufacturer">Manufacturer *</Label>
                  <Input
                    id="manufacturer"
                    required
                    value={formData.manufacturer}
                    onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                    placeholder="Enter manufacturer name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/product-image.png"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="sizes">Sizes (comma-separated, optional)</Label>
                  <Input
                    id="sizes"
                    value={formData.sizes}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="S, M, L, XL"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter product description"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit">{editingProduct ? "Update Product" : "Add Product"}</Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Products ({products.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product) => (
              <div key={product.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex items-center gap-4">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="h-16 w-16 rounded object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{product.name}</p>
                      {product.stock === 0 && (
                        <Badge variant="destructive" className="text-xs">
                          Inactive
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {product.category} • Stock: {product.stock} units
                    </p>
                    {product.sizes && (
                      <p className="text-xs text-muted-foreground">Sizes: {product.sizes.join(", ")}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold">₹{product.price.toFixed(2)}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeactivate(product.id)}
                      disabled={product.stock === 0}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
