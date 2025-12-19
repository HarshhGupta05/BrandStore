"use client"

import { useState } from "react"
import { useStore } from "@/contexts/store-context"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Pencil, Trash2, X, Save, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AdminCategoriesPage() {
    const { categories, addCategory, updateCategory, deleteCategory } = useStore()
    const [isAddingRequest, setIsAddingRequest] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({ name: "", description: "" })
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const resetForm = () => {
        setFormData({ name: "", description: "" })
        setIsAddingRequest(false)
        setEditingId(null)
        setError(null)
        setSuccess(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(null)
        try {
            if (editingId) {
                await updateCategory(editingId, formData)
                setSuccess("Category updated successfully")
            } else {
                await addCategory(formData as { name: string, description: string })
                setSuccess("Category added successfully")
            }
            setTimeout(() => {
                resetForm()
            }, 1000)
        } catch (err: any) {
            setError(err.message || "An error occurred")
        }
    }

    const handleEdit = (category: any) => {
        setFormData({ name: category.name, description: category.description || "" })
        setEditingId(category.id)
        setIsAddingRequest(true)
        setError(null)
        setSuccess(null)
    }

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this category? Products assigned to it might need reassignment.")) {
            try {
                await deleteCategory(id)
            } catch (err: any) {
                alert(err.message)
            }
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                    <p className="text-muted-foreground">
                        Manage data for product categorization.
                    </p>
                </div>
                {!isAddingRequest && (
                    <Button onClick={() => setIsAddingRequest(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Category
                    </Button>
                )}
            </div>

            {isAddingRequest && (
                <Card className="border-primary/20 shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="space-y-1">
                            <CardTitle>{editingId ? "Edit Category" : "New Category"}</CardTitle>
                            <CardDescription>Fill in the details below.</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" onClick={resetForm}><X className="w-4 h-4" /></Button>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        {success && (
                            <Alert className="mb-4 bg-green-50 text-green-900 border-green-200">
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="catName">Name</Label>
                                    <Input
                                        id="catName"
                                        required
                                        placeholder="e.g. Clothing, Electronics"
                                        value={formData.name}
                                        onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="catDesc">Description</Label>
                                    <Input
                                        id="catDesc"
                                        placeholder="Short description..."
                                        value={formData.description}
                                        onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                                <Button type="submit"><Save className="w-4 h-4 mr-2" /> Save</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>All Categories</CardTitle>
                    <CardDescription>
                        A list of all product categories in the store.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                                        No categories found. Add one above.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                categories.map((category) => (
                                    <TableRow key={category.id}>
                                        <TableCell className="font-medium">{category.name}</TableCell>
                                        <TableCell>{category.description}</TableCell>
                                        <TableCell className="text-muted-foreground text-xs">{category.id}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button size="icon" variant="ghost" onClick={() => handleEdit(category)}>
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive/90" onClick={() => handleDelete(category.id)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
