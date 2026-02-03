"use client"

import { useState, useMemo, useEffect } from "react"
import { useStore } from "@/contexts/store-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Download, FileText, Printer, Filter, Calendar as CalendarIcon, ArrowUpRight, ArrowDownLeft, Wallet, Save, Trash2, History } from "lucide-react"
import { toast } from "sonner"

export default function ReportsPage() {
    const { orders, fetchOrders, savedReports, fetchReports, saveReport, deleteReport, vendorInvoices, fetchVendorInvoices } = useStore()
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        fetchOrders()
        fetchReports()
        fetchVendorInvoices()
    }, [])

    // Default to current month
    const now = new Date()
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0]

    const [startDate, setStartDate] = useState(firstDay)
    const [endDate, setEndDate] = useState(lastDay)

    const allActivities = useMemo(() => {
        const orderActivities = orders.map(order => ({
            id: order.id,
            date: order.createdAt,
            type: 'SALE',
            title: `Customer Sale: ${order.deliveryDetails.name}`,
            amount: order.total,
            status: order.orderStatus,
            items: order.items.map(i => `${i.quantity}x ${i.productName}`),
            details: order
        }))

        const invoiceActivities = vendorInvoices.map(invoice => ({
            id: invoice._id || invoice.invoiceId,
            date: invoice.invoiceDate || invoice.createdAt,
            type: 'EXPENSE',
            title: `Vendor Invoice: ${invoice.vendorName}`,
            amount: invoice.totalAmount,
            status: invoice.status === 'Paid' ? 'Paid' : 'Pending',
            items: invoice.items.map(i => `${i.quantity}x ${i.productName}`),
            details: invoice
        }))

        return [...orderActivities, ...invoiceActivities]
            .filter(act => {
                const actDate = new Date(act.date).toLocaleDateString('en-CA') // YYYY-MM-DD local
                return actDate >= startDate && actDate <= endDate
            })
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    }, [orders, vendorInvoices, startDate, endDate])

    const stats = useMemo(() => {
        const totalSales = allActivities
            .filter(a => a.type === 'SALE' && a.status !== 'Cancelled')
            .reduce((sum, a) => sum + a.amount, 0)

        const totalExpenses = allActivities
            .filter(a => a.type === 'EXPENSE')
            .reduce((sum, a) => sum + a.amount, 0)

        const netProfit = totalSales - totalExpenses
        const salesCount = allActivities.filter(a => a.type === 'SALE').length
        const expenseCount = allActivities.filter(a => a.type === 'EXPENSE').length

        return { totalSales, totalExpenses, netProfit, salesCount, expenseCount }
    }, [allActivities])

    const handlePrint = () => {
        window.print()
    }

    const handleSaveReport = async () => {
        setIsSaving(true)
        try {
            const title = `Store Activity: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`
            await saveReport({
                title,
                startDate,
                endDate,
                totalRevenue: stats.totalSales,
                totalExpenses: stats.totalExpenses,
                netProfit: stats.netProfit,
                totalOrders: stats.salesCount,
                avgOrderValue: stats.totalSales / (stats.salesCount || 1),
                successRate: 100,
                notes: `Incl. ${stats.expenseCount} vendor activities. Generated on ${new Date().toLocaleString()}`
            })
            toast.success("Monthly activity report saved!")
        } catch (error) {
            toast.error("Failed to save report.")
        } finally {
            setIsSaving(false)
        }
    }

    const handleExportCSV = () => {
        if (allActivities.length === 0) {
            toast.error("No data to export")
            return
        }

        const headers = ["Date", "Activity ID", "Title", "Type", "Status", "Amount (INR)", "Items"]
        const csvRows = allActivities.map(act => [
            new Date(act.date).toLocaleDateString(),
            act.id.toUpperCase(),
            act.title,
            act.type,
            act.status,
            act.amount.toFixed(2),
            act.items.join("; ")
        ])

        const csvContent = [headers, ...csvRows]
            .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
            .join("\n")

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `Store_Activity_${startDate}_to_${endDate}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success("Activity CSV Exported")
    }

    const handleDeleteReport = async (id: string) => {
        if (confirm("Are you sure you want to delete this saved report?")) {
            try {
                await deleteReport(id)
                toast.success("Report deleted.")
            } catch (error) {
                toast.error("Failed to delete report.")
            }
        }
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 print-container">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Monthly Store Activity</h1>
                    <p className="text-muted-foreground mt-1">Full breakdown of customer sales and vendor expenses.</p>
                </div>
                <div className="flex gap-2 print:hidden">
                    <Button variant="outline" size="sm" onClick={handleSaveReport} disabled={isSaving || allActivities.length === 0}>
                        <Save className="mr-2 h-4 w-4" />
                        {isSaving ? "Saving..." : "Save to DB"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handlePrint}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print Report
                    </Button>
                    <Button variant="default" size="sm" onClick={handleExportCSV}>
                        <Download className="mr-2 h-4 w-4" />
                        Export CSV
                    </Button>
                </div>
            </div>

            <Card className="print:hidden glass border-none shadow-lg bg-gradient-to-br from-background/50 to-secondary/30 backdrop-blur-md">
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filter Period
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="start-date" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Start Date</Label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="start-date"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="pl-10 h-11 focus-visible:ring-primary/50"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="end-date" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">End Date</Label>
                            <div className="relative">
                                <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                                <Input
                                    id="end-date"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="pl-10 h-11 focus-visible:ring-primary/50"
                                />
                            </div>
                        </div>
                        <div className="flex items-end pb-1">
                            <Button variant="secondary" className="w-full h-11" onClick={() => {
                                setStartDate(firstDay)
                                setEndDate(lastDay)
                            }}>
                                Reset to Current Month
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="overflow-hidden border-none shadow-md bg-white/50 backdrop-blur-sm card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                        <div className="p-2 bg-green-100 rounded-full">
                            <ArrowUpRight className="h-4 w-4 text-green-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">₹{stats.totalSales.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                        <p className="text-xs text-muted-foreground mt-1">{stats.salesCount} Transactions</p>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-none shadow-md bg-white/50 backdrop-blur-sm card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                        <div className="p-2 bg-red-100 rounded-full">
                            <ArrowDownLeft className="h-4 w-4 text-red-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600 text-foreground">₹{stats.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                        <p className="text-xs text-muted-foreground mt-1">{stats.expenseCount} Vendor Invoices</p>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-none shadow-md bg-white/50 backdrop-blur-sm card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Net Profit/Loss</CardTitle>
                        <div className="p-2 bg-blue-100 rounded-full">
                            <Wallet className="h-4 w-4 text-blue-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-2xl font-bold ${stats.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                            ₹{stats.netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Sales minus Expenses</p>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border-none shadow-md bg-white/50 backdrop-blur-sm card-hover">
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Store Utilization</CardTitle>
                        <div className="p-2 bg-purple-100 rounded-full">
                            <FileText className="h-4 w-4 text-purple-600" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600">{allActivities.length}</div>
                        <p className="text-xs text-muted-foreground mt-1">Total Activities</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-none shadow-xl overflow-hidden bg-white/80 backdrop-blur-lg">
                <CardHeader className="bg-muted/50 border-b">
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Activity Ledger</CardTitle>
                            <p className="text-xs text-muted-foreground mt-1">
                                {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-xs font-semibold uppercase text-muted-foreground">Net Period Change</div>
                            <div className={`text-xl font-bold ${stats.netProfit >= 0 ? 'text-primary' : 'text-red-600'}`}>
                                {stats.netProfit >= 0 ? '+' : ''}₹{stats.netProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead className="w-[120px] font-bold">Date</TableHead>
                                <TableHead className="font-bold">Activity Details</TableHead>
                                <TableHead className="font-bold">Status</TableHead>
                                <TableHead className="text-right font-bold">Amount (INR)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allActivities.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                                        No activities found for this month.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                allActivities.map((act) => (
                                    <TableRow key={act.id} className="hover:bg-muted/10 transition-colors border-b last:border-0">
                                        <TableCell className="font-medium">
                                            {new Date(act.date).toLocaleDateString('en-IN', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric'
                                            })}
                                            <div className="text-[10px] text-muted-foreground">
                                                {new Date(act.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full ${act.type === 'SALE' ? 'bg-green-500' : 'bg-red-500'}`} />
                                                <div className="font-semibold text-sm">{act.title}</div>
                                            </div>
                                            <div className="text-xs text-muted-foreground font-mono mt-0.5">ID: {act.id.toUpperCase().slice(-12)}</div>
                                            <div className="mt-1.5 flex flex-wrap gap-1">
                                                {act.items.slice(0, 3).map((item, idx) => (
                                                    <span key={idx} className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] bg-secondary text-secondary-foreground">
                                                        {item}
                                                    </span>
                                                ))}
                                                {act.items.length > 3 && <span className="text-[10px] text-muted-foreground">+{act.items.length - 3} more</span>}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${act.type === 'SALE'
                                                ? (act.status === 'Cancelled' ? 'bg-red-50 text-red-700 ring-red-600/10' : 'bg-green-50 text-green-700 ring-green-600/20')
                                                : (act.status === 'Paid' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' : 'bg-orange-50 text-orange-700 ring-orange-600/20')
                                                }`}>
                                                {act.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className={`text-right font-bold ${act.type === 'SALE' ? 'text-green-600' : 'text-red-500'}`}>
                                            {act.type === 'SALE' ? '+' : '-'}₹{act.amount.toFixed(2)}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="space-y-4 print:hidden">
                <div className="flex items-center gap-2">
                    <History className="h-5 w-5 text-muted-foreground" />
                    <h2 className="text-xl font-bold">Saved Reports History</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {savedReports.length === 0 ? (
                        <p className="text-muted-foreground italic col-span-full">No saved reports found in database.</p>
                    ) : (
                        savedReports.map((report) => (
                            <Card key={report._id} className="group hover:border-primary/50 transition-all card-hover">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-sm font-bold line-clamp-1">{report.title}</CardTitle>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => handleDeleteReport(report._id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">Generated by {report.generatedBy?.name || "Admin"}</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="p-2 bg-muted/50 rounded-md">
                                            <p className="text-muted-foreground">Sales</p>
                                            <p className="font-bold text-green-600">₹{report.totalRevenue.toFixed(0)}</p>
                                        </div>
                                        <div className="p-2 bg-muted/50 rounded-md">
                                            <p className="text-muted-foreground">Expenses</p>
                                            <p className="font-bold text-red-600">₹{report.totalExpenses?.toFixed(0) || 0}</p>
                                        </div>
                                        <div className="p-2 bg-muted/50 rounded-md col-span-2 flex justify-between items-center">
                                            <p className="text-muted-foreground">Net Profit</p>
                                            <p className={`font-bold ${report.netProfit >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                                                ₹{report.netProfit?.toFixed(2) || (report.totalRevenue - (report.totalExpenses || 0)).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex justify-between items-center text-[10px] text-muted-foreground">
                                        <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                                        <Button variant="link" size="sm" className="h-auto p-0 text-[10px]" onClick={() => {
                                            setStartDate(new Date(report.startDate).toLocaleDateString('en-CA'))
                                            setEndDate(new Date(report.endDate).toLocaleDateString('en-CA'))
                                            window.scrollTo({ top: 0, behavior: 'smooth' })
                                            toast.info("Showing activity for: " + report.title)
                                        }}>
                                            View Period
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </div>
            </div>

            <div className="hidden print:block fixed bottom-0 left-0 right-0 p-8 border-t text-center text-xs text-muted-foreground bg-white">
                <p>Generated by BrandStore Admin Panel - {new Date().toLocaleString()}</p>
                <p>This is a computer generated statement and does not require a signature.</p>
            </div>

            <style jsx global>{`
        @media print {
          /* Reset common hiding logic */
          body * {
            visibility: hidden;
          }
          
          /* Only show the print-container */
          .print-container, .print-container * {
            visibility: visible;
          }
          
          .print-container {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
            background: white !important;
          }

          /* Hide UI elements */
          aside, nav, .print\\:hidden, button, [role="button"] {
            display: none !important;
          }

          /* Force background colors to print */
          .Card {
            border: 1px solid #ddd !important;
            break-inside: avoid;
            background: white !important;
            box-shadow: none !important;
            margin-bottom: 20px;
          }

          /* Table styling for print */
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          th, td {
            border: 1px solid #eee !important;
            padding: 8px !important;
          }
          
          /* Ensure text is black for clarity */
          .text-muted-foreground {
            color: #666 !important;
          }
          .text-green-600 {
            color: #059669 !important;
          }
        }
      `}</style>
        </div>
    )
}
