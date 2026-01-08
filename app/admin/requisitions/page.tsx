"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Loader2 } from "lucide-react"
import api from "@/lib/api"

export default function RequisitionsPage() {
    const [requisitions, setRequisitions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchRequisitions()
    }, [])

    const fetchRequisitions = async () => {
        try {
            const { data } = await api.get('/requisitions')
            setRequisitions(data)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="mb-2 text-3xl font-bold">Requisitions & Events</h1>
                    <p className="text-muted-foreground">Manage offline stock allocations and sales</p>
                </div>
                <Link href="/admin/requisitions/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Requisition
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Requisitions</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin" /></div>
                    ) : requisitions.length === 0 ? (
                        <div className="text-center p-8 text-muted-foreground">No requisitions found. Create one to get started.</div>
                    ) : (
                        <div className="rounded-md border">
                            <div className="grid grid-cols-6 border-b p-4 font-medium bg-muted/50">
                                <div className="col-span-1">ID</div>
                                <div className="col-span-2">Event Details</div>
                                <div className="col-span-1">Requested By</div>
                                <div className="col-span-1">Status</div>
                                <div className="col-span-1 text-right">Actions</div>
                            </div>
                            {requisitions.map((req) => (
                                <div key={req._id} className="grid grid-cols-6 border-b p-4 items-center last:border-0 hover:bg-muted/30 transition-colors">
                                    <div className="font-mono text-sm">{req.requisitionId}</div>
                                    <div className="col-span-2 truncate pr-4" title={req.eventDetails}>
                                        {req.eventDetails}
                                    </div>
                                    <div className="text-sm">{req.requestedBy || 'Unknown'}</div>
                                    <div>
                                        <Badge variant="outline" className={
                                            req.status === 'allocated' ? 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100' :
                                                req.status === 'partially_sold' ? 'bg-green-100 text-green-800 border-green-200 hover:bg-green-100' :
                                                    req.status === 'closed' ? 'bg-gray-100 text-gray-800 border-gray-200' :
                                                        req.status === 'cancelled' ? 'bg-red-100 text-red-800 border-red-200' :
                                                            '' // draft defaults
                                        }>
                                            {req.status ? req.status.toUpperCase().replace('_', ' ') : 'DRAFT'}
                                        </Badge>
                                    </div>
                                    <div className="text-right">
                                        <Link href={`/admin/requisitions/${req.requisitionId}`}>
                                            <Button variant="outline" size="sm">View</Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
