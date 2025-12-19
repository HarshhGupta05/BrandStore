

"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useStore } from "@/contexts/store-context"
import { categories } from "@/lib/dummy-data"
import { Plus, Pencil, Trash2, X, Upload, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function AdminProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, categories } = useStore()
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "", // Legacy primary image
    images: [] as string[], // All images
    stock: "",
    manufacturer: "",
    sizes: "",
  })

  // File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null)

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      images: [],
      stock: "",
      manufacturer: "",
      sizes: "",
    })
    setIsAddingProduct(false)
    setEditingProduct(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Ensure we have at least one image
    const finalImages = formData.images.length > 0 ? formData.images : ["/placeholder.svg"]
    const primaryImage = finalImages[0]

    const productData = {
      name: formData.name,
      description: formData.description,
      price: Number.parseFloat(formData.price),
      category: formData.category,
      image: primaryImage, // Legacy support: Primary image is always index 0
      images: finalImages,
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
      images: product.images && product.images.length > 0 ? product.images : [product.image],
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

  // Handle File Selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, base64String]
        }))
      }
      reader.readAsDataURL(file)
    })

    // Reset input so same files can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const newImages = [...formData.images]
    if (direction === 'left' && index > 0) {
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]]
    } else if (direction === 'right' && index < newImages.length - 1) {
      [newImages[index + 1], newImages[index]] = [newImages[index], newImages[index + 1]]
    }
    setFormData(prev => ({ ...prev, images: newImages }))
  }

  const makePrimary = (index: number) => {
    const newImages = [...formData.images]
    const [selected] = newImages.splice(index, 1)
    newImages.unshift(selected)
    setFormData(prev => ({ ...prev, images: newImages }))
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">

                {/* Image Upload Section - Full Width */}
                <div className="md:col-span-2 space-y-4">
                  <Label>Product Images</Label>
                  <div className="rounded-lg border border-dashed p-6 text-center hover:bg-muted/50 transition-colors">
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      id="image-upload"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                    />
                    <Label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                      <div className="p-3 bg-primary/10 rounded-full">
                        <Upload className="h-6 w-6 text-primary" />
                      </div>
                      <span className="text-sm font-medium">Click to upload images</span>
                      <span className="text-xs text-muted-foreground">Support for JPG, PNG, WEBP</span>
                    </Label>
                  </div>

                  {/* Image Preview List */}
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {formData.images.map((img, index) => (
                        <div key={index} className="group relative aspect-square rounded-lg border bg-background overflow-hidden">
                          <img src={img} alt={`Preview ${index}`} className="w-full h-full object-cover" />

                          {/* Primary Badge */}
                          {index === 0 && (
                            <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full z-10 font-medium">
                              Primary
                            </div>
                          )}

                          {/* Actions Overlay */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            {index > 0 && (
                              <Button size="icon" variant="secondary" type="button" onClick={() => moveImage(index, 'left')} className="h-8 w-8">
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                            )}

                            <Button size="icon" variant="destructive" type="button" onClick={() => removeImage(index)} className="h-8 w-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>

                            {index < formData.images.length - 1 && (
                              <Button size="icon" variant="secondary" type="button" onClick={() => moveImage(index, 'right')} className="h-8 w-8">
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            )}

                            {index !== 0 && (
                              <Button size="icon" variant="default" type="button" onClick={() => makePrimary(index)} className="h-8 w-8 absolute top-2 right-2" title="Make Primary">
                                <Star className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

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
                        <SelectItem key={cat.id} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">{editingProduct ? "Update Product" : "Save Product"}</Button>
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
              <div key={product.id} className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded overflow-hidden border">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                    {product.images && product.images.length > 1 && (
                      <div className="absolute bottom-0 right-0 bg-black/70 text-white text-[10px] px-1">
                        +{product.images.length - 1}
                      </div>
                    )}
                  </div>
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

