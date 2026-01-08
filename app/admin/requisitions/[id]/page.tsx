"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, ArrowLeft, Save, Archive } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { useStore } from "@/contexts/store-context"

export default function RequisitionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const { id } = use(params)
    const { refreshProducts } = useStore() // Get refreshProducts

    const [requisition, setRequisition] = useState<any>(null)
    const [items, setItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchRequisition()
    }, [])

    const fetchRequisition = async () => {
        setLoading(true)
        try {
            const { data } = await api.get(`/requisitions/${id}`)
            setRequisition(data.requisition)
            setItems(data.items)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to load requisition')
        } finally {
            setLoading(false)
        }
    }

    const handleAllocate = async () => {
        if (!confirm("This will validate stock and lock the allocation. Continue?")) return
        setProcessing(true)
        try {
            const { data } = await api.put(`/requisitions/${id}/allocate`)
            setRequisition(data.requisition)
            alert("Stock allocated successfully.")
        } catch (err: any) {
            alert(err.response?.data?.message || "Allocation failed")
        } finally {
            setProcessing(false)
        }
    }

    const handleUpdateCounts = async () => {
        // Validate first
        for (const item of items) {
            if (item.quantitySold + item.quantityReturned > item.quantityAllocated) {
                return alert(`Invalid counts for ${item.productName}. Sold + Returned cannot exceed Allocated.`)
            }
        }

        setProcessing(true)
        try {
            const updates = items.map(item => ({
                _id: item._id,
                quantitySold: item.quantitySold,
                quantityReturned: item.quantityReturned
            }))
            const { data } = await api.put(`/requisitions/${id}/update-counts`, { updates })
            setRequisition(data.requisition) // Update status if changed

            // Refresh global product stock
            if (refreshProducts) {
                await refreshProducts()
            }

            alert("Counts updated and stock deducted accordingly.")
        } catch (err: any) {
            alert(err.response?.data?.message || "Update failed")
        } finally {
            setProcessing(false)
        }
    }

    const handleCloseRequisition = async () => {
        if (!confirm("This will close the event. Remaining stock is considered returned. This action cannot be undone. Continue?")) return
        setProcessing(true)
        try {
            const { data } = await api.put(`/requisitions/${id}/close`)
            setRequisition(data.requisition)
            router.push('/admin/requisitions')
        } catch (err: any) {
            alert(err.response?.data?.message || "Closure failed")
        } finally {
            setProcessing(false)
        }
    }

    const handleItemChange = (index: number, field: 'quantitySold' | 'quantityReturned', value: number) => {
        const newItems = [...items]

        if (field === 'quantitySold') {
            const sold = value
            const allocated = newItems[index].quantityAllocated

            // Validate
            if (sold > allocated) {
                alert(`Cannot sell more than allocated (${allocated})`)
                return
            }

            newItems[index].quantitySold = sold
            // Auto fill returned: Allocated - Sold
            newItems[index].quantityReturned = allocated - sold
        } else {
            // Manual adjustment of returned if needed (optional, but keep for flexibility)
            newItems[index][field] = value
        }

        setItems(newItems)
    }

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
    if (error) return <div className="p-12 text-center text-red-500">{error}</div>
    if (!requisition) return <div className="p-12 text-center">Requisition not found</div>

    const isDraft = requisition.status === 'draft'
    const isActive = requisition.status === 'allocated' || requisition.status === 'partially_sold'
    const isClosed = requisition.status === 'closed' || requisition.status === 'cancelled'

    // Check if fully sold
    const isFullySold = requisition.totalQuantityAllocated > 0 && requisition.totalQuantitySold === requisition.totalQuantityAllocated

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <Link href="/admin/requisitions" className="flex items-center text-muted-foreground hover:text-foreground mb-2">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Link>
                    <h1 className="text-3xl font-bold flex items-center gap-4">
                        {requisition.requisitionId}
                        <Badge variant={isFullySold ? 'default' : isActive ? 'outline' : 'secondary'} className={isFullySold ? 'bg-green-600 hover:bg-green-700' : ''}>
                            {isFullySold ? 'SOLD OUT' : requisition.status.toUpperCase().replace('_', ' ')}
                        </Badge>
                    </h1>
                </div>
                <div className="flex gap-2">
                    {isDraft && (
                        <Button onClick={handleAllocate} disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Allocate Stock
                        </Button>
                    )}
                    {isActive && (
                        <>
                            <Button variant="secondary" onClick={handleUpdateCounts} disabled={processing}>
                                <Save className="mr-2 h-4 w-4" />
                                Save Counts
                            </Button>
                            <Button variant="destructive" onClick={handleCloseRequisition} disabled={processing}>
                                <Archive className="mr-2 h-4 w-4" />
                                Close Event
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="md:col-span-2">
                    <CardHeader><CardTitle>Event Details</CardTitle></CardHeader>
                    <CardContent>
                        <Textarea
                            readOnly
                            value={requisition.eventDetails}
                            className="min-h-[100px] bg-muted/20"
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>Info</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <span className="text-sm text-muted-foreground block">Requested By</span>
                            <span className="font-medium">{requisition.requestedBy}</span>
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground block">Created At</span>
                            <span className="font-medium">{new Date(requisition.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground block">Remarks</span>
                            <p className="text-sm">{requisition.remarks || '-'}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader><CardTitle>Allocated Items</CardTitle></CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <div className="grid grid-cols-12 border-b p-4 font-medium bg-muted/50 text-sm">
                            <div className="col-span-5">Product</div>
                            <div className="col-span-2 text-center">Allocated</div>
                            <div className="col-span-2 text-center">Sold</div>
                            <div className="col-span-2 text-center">Returned</div>
                            <div className="col-span-1"></div>
                        </div>
                        {items.map((item, index) => (
                            <div key={item._id} className="grid grid-cols-12 border-b p-4 items-center last:border-0 hover:bg-muted/10">
                                <div className="col-span-5">
                                    <div className="font-medium">{item.productName}</div>
                                    <div className="text-xs text-muted-foreground">ID: {item.productId?._id || 'N/A'}</div>
                                </div>
                                <div className="col-span-2 text-center text-lg font-semibold">
                                    {item.quantityAllocated}
                                </div>
                                <div className="col-span-2 px-2">
                                    <Input
                                        type="number"
                                        min="0"
                                        value={item.quantitySold}
                                        onChange={(e) => handleItemChange(index, 'quantitySold', Number(e.target.value))}
                                        disabled={!isActive}
                                        className="text-center"
                                    />
                                </div>
                                <div className="col-span-2 px-2">
                                    <Input
                                        type="number"
                                        min="0"
                                        value={item.quantityReturned}
                                        onChange={(e) => handleItemChange(index, 'quantityReturned', Number(e.target.value))}
                                        disabled={!isActive}
                                        className="text-center"
                                    />
                                </div>
                                <div className="col-span-1 flex justify-center">
                                    {item.quantitySold + item.quantityReturned === item.quantityAllocated && (
                                        <div className="w-2 h-2 rounded-full bg-green-500" title="Fully Reconciled"></div>
                                    )}
                                    {item.quantitySold + item.quantityReturned > item.quantityAllocated && (
                                        <div className="w-2 h-2 rounded-full bg-red-500" title="Over Allocated!"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {isActive && (
                        <div className="mt-4 p-4 bg-blue-50 text-blue-800 text-sm rounded border border-blue-100">
                            <p><strong>Note:</strong> Updating "Sold" quantity will immediately deduct stock from the main inventory. Ensure counts are accurate before saving.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
