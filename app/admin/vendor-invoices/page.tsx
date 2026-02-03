"use client"

import { useState, useEffect } from "react"
import { useStore } from "@/contexts/store-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { Search, Filter, FileText, CheckCircle, CreditCard, ChevronRight } from "lucide-react"

export default function VendorInvoicesPage() {
    const { vendorInvoices, fetchVendorInvoices, payVendorInvoice } = useStore()!
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Paid">("All")
    const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)

    useEffect(() => {
        fetchVendorInvoices()
    }, [])

    const filteredInvoices = vendorInvoices.filter(invoice => {
        const matchesSearch = invoice.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            invoice.invoiceId.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "All" || invoice.status === statusFilter
        return matchesSearch && matchesStatus
    })

    // Calculations for Summary Cards
    const totalPending = vendorInvoices
        .filter(inv => inv.status === 'Pending')
        .reduce((sum, inv) => sum + inv.totalAmount, 0)

    const totalPaid = vendorInvoices
        .filter(inv => inv.status === 'Paid')
        .reduce((sum, inv) => sum + inv.totalAmount, 0)

    const handlePayInvoice = async () => {
        if (selectedInvoice) {
            await payVendorInvoice(selectedInvoice.invoiceId)
            setSelectedInvoice((prev: any) => ({ ...prev, status: 'Paid' })) // Optimistic update for modal
            setIsDetailsOpen(false)
        }
    }

    const openDetails = (invoice: any) => {
        setSelectedInvoice(invoice)
        setIsDetailsOpen(true)
    }

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Vendor Invoices</h1>
                    <p className="text-muted-foreground">Manage and track payments for received manufacturer orders.</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                        <CreditCard className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalPending.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Across {vendorInvoices.filter(i => i.status === 'Pending').length} invoices</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{totalPaid.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Lifetime payments</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{vendorInvoices.length}</div>
                        <p className="text-xs text-muted-foreground">Generated from receipts</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by Vendor or Invoice ID..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select
                        className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                    >
                        <option value="All">All Status</option>
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                    </select>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="border rounded-md bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Invoice ID</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Vendor</TableHead>
                            <TableHead>Ref. Order</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredInvoices.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                                    No invoices found matching your filters.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredInvoices.map((invoice) => (
                                <TableRow key={invoice._id} className="cursor-pointer hover:bg-muted/50" onClick={() => openDetails(invoice)}>
                                    <TableCell className="font-medium font-mono text-xs">{invoice.invoiceId}</TableCell>
                                    <TableCell>{format(new Date(invoice.invoiceDate), "dd MMM yyyy")}</TableCell>
                                    <TableCell>{invoice.vendorName}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{invoice.manufacturerOrderId}</TableCell>
                                    <TableCell className="text-right font-bold">₹{invoice.totalAmount.toLocaleString()}</TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant={invoice.status === 'Paid' ? 'secondary' : 'default'} className={invoice.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                                            {invoice.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); openDetails(invoice); }}>
                                            View <ChevronRight className="ml-1 h-3 w-3" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Invoice Details Modal */}
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex justify-between items-center pr-8">
                            <span>Invoice {selectedInvoice?.invoiceId}</span>
                            <Badge variant={selectedInvoice?.status === 'Paid' ? 'secondary' : 'default'}
                                className={selectedInvoice?.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}>
                                {selectedInvoice?.status}
                            </Badge>
                        </DialogTitle>
                        <DialogDescription>
                            Generated on {selectedInvoice && format(new Date(selectedInvoice.invoiceDate), "PPP")} for {selectedInvoice?.vendorName}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-muted-foreground block">Reference Order</span>
                                <span className="font-semibold">{selectedInvoice?.manufacturerOrderId}</span>
                            </div>
                            <div>
                                <span className="text-muted-foreground block">Vendor Name</span>
                                <span className="font-semibold">{selectedInvoice?.vendorName}</span>
                            </div>
                        </div>

                        <div className="border rounded-md overflow-hidden">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead className="text-right">Qty</TableHead>
                                        <TableHead className="text-right">Cost</TableHead>
                                        <TableHead className="text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedInvoice?.items.map((item: any, idx: number) => (
                                        <TableRow key={idx}>
                                            <TableCell className="font-medium text-sm">{item.productName}</TableCell>
                                            <TableCell className="text-right text-xs">{item.quantity}</TableCell>
                                            <TableCell className="text-right text-xs">₹{item.costPerUnit}</TableCell>
                                            <TableCell className="text-right text-xs font-semibold">₹{item.total.toLocaleString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <div className="flex justify-end pt-2">
                            <div className="space-y-1.5 w-full max-w-[250px]">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Sub-total:</span>
                                    <span className="font-medium">₹{selectedInvoice?.subTotal?.toLocaleString() || selectedInvoice?.totalAmount.toLocaleString()}</span>
                                </div>
                                {selectedInvoice?.discount > 0 && (
                                    <div className="flex justify-between text-sm text-red-600">
                                        <span className="">Discount:</span>
                                        <span className="font-medium">-₹{selectedInvoice?.discount.toLocaleString()}</span>
                                    </div>
                                )}
                                {selectedInvoice?.cgst > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">CGST ({selectedInvoice.cgst}%):</span>
                                        <span className="font-medium">₹{(selectedInvoice.subTotal * selectedInvoice.cgst / 100).toLocaleString()}</span>
                                    </div>
                                )}
                                {selectedInvoice?.sgst > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">SGST ({selectedInvoice.sgst}%):</span>
                                        <span className="font-medium">₹{(selectedInvoice.subTotal * selectedInvoice.sgst / 100).toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between pt-2 border-t mt-2">
                                    <span className="font-bold text-lg">Total:</span>
                                    <span className="text-2xl font-bold text-primary">₹{selectedInvoice?.totalAmount.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>Close</Button>
                        {selectedInvoice?.status === 'Pending' && (
                            <Button onClick={handlePayInvoice} className="bg-green-600 hover:bg-green-700">
                                Mark as Paid
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
