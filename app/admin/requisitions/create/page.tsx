"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2, Plus, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreateRequisitionPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [products, setProducts] = useState<any[]>([])
    const [formData, setFormData] = useState({
        eventDetails: '',
        requestedBy: '', // Added manual field
        remarks: '',
        items: [] as any[] // { productId, productName, quantityAllocated, availableStock }
    })

    useEffect(() => {
        api.get('/products').then(res => setProducts(res.data)).catch(console.error)
    }, [])

    const handleAddItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { productId: '', quantityAllocated: 1, availableStock: 0 }]
        }))
    }

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...formData.items]

        if (field === 'productId') {
            const prod = products.find(p => p._id === value)
            if (prod) {
                newItems[index].productId = value
                newItems[index].productName = prod.name
                newItems[index].availableStock = prod.stock
            }
        } else {
            newItems[index][field] = value
        }

        setFormData(prev => ({ ...prev, items: newItems }))
    }

    const handleRemoveItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.eventDetails) return alert("Event details required")
        if (formData.items.length === 0) return alert("Add at least one item")

        // Validation
        for (const item of formData.items) {
            if (!item.productId) return alert("Select a product for all items")
            if (item.quantityAllocated > item.availableStock) {
                return alert(`Quantity for ${item.productName} exceeds available stock (${item.availableStock})`)
            }
        }

        setLoading(true)
        try {
            await api.post('/requisitions', formData)
            router.push('/admin/requisitions')
        } catch (error: any) {
            console.error(error)
            alert(error.response?.data?.message || 'Failed to create requisition')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <Link href="/admin/requisitions" className="flex items-center text-muted-foreground hover:text-foreground mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Requisitions
                </Link>
                <h1 className="text-3xl font-bold">New Requisition</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Event Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="eventDetails">Event Name & Details *</Label>
                            <Textarea
                                id="eventDetails"
                                placeholder="e.g. Pop-up Store at City Center, Jan 10-12"
                                required
                                value={formData.eventDetails}
                                onChange={(e) => setFormData({ ...formData, eventDetails: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="requestedBy">Requested By *</Label>
                            <Input
                                id="requestedBy"
                                placeholder="Enter name of requester"
                                required
                                value={formData.requestedBy}
                                onChange={(e) => setFormData({ ...formData, requestedBy: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="remarks">Remarks</Label>
                            <Textarea
                                id="remarks"
                                placeholder="Additional notes..."
                                value={formData.remarks}
                                onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="mb-6">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Items Allocation</CardTitle>
                        <Button type="button" onClick={handleAddItem} size="sm">
                            <Plus className="mr-2 h-4 w-4" /> Add Item
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {formData.items.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                                No items added. Click "Add Item" to start.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {formData.items.map((item, index) => (
                                    <div key={index} className="flex gap-4 items-end p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
                                        <div className="flex-1 space-y-2">
                                            <Label>Product</Label>
                                            <Select
                                                value={item.productId}
                                                onValueChange={(val) => handleItemChange(index, 'productId', val)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select Product" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {products.map(p => (
                                                        <SelectItem key={p._id} value={p._id}>
                                                            {p.name} (Stock: {p.stock})
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="w-32 space-y-2">
                                            <Label>Quantity</Label>
                                            <Input
                                                type="number"
                                                min="1"
                                                value={item.quantityAllocated}
                                                onChange={(e) => handleItemChange(index, 'quantityAllocated', Number(e.target.value))}
                                            />
                                        </div>
                                        <div className="pb-2 text-sm text-muted-foreground w-32">
                                            Max: {item.availableStock}
                                        </div>
                                        <Button type="button" variant="ghost" size="icon" onClick={() => handleRemoveItem(index)}>
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Requisition
                    </Button>
                </div>
            </form>
        </div>
    )
}
