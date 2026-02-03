"use client"

import { useState, Fragment } from "react"
import { useStore } from "@/contexts/store-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Factory, Plus, Trash2, PackageCheck, Eye, X } from "lucide-react"
import type { ManufacturerOrder } from "@/contexts/store-context"

export default function AdminManufacturerPage() {
  const { products, manufacturerOrders, createManufacturerOrder, receiveManufacturerOrderItems, deleteManufacturerOrder, vendors, createVendor } =
    useStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  // Receive Modal State
  const [isReceiveOpen, setIsReceiveOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<ManufacturerOrder | null>(null)
  const [receiveQuantities, setReceiveQuantities] = useState<{ [key: string]: string }>({})
  const [receiveDates, setReceiveDates] = useState<{ [key: string]: string }>({}) // New state for per-item dates
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null) // productId for expanded history
  const [discount, setDiscount] = useState("0")
  const [cgst, setCgst] = useState("0")
  const [sgst, setSgst] = useState("0")


  // Create Form State
  const [vendorId, setVendorId] = useState("")
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split("T")[0])
  const [expectedArrival, setExpectedArrival] = useState("")
  const [orderItems, setOrderItems] = useState<{ productId: string; quantity: string; cost: string }[]>([
    { productId: "", quantity: "", cost: "" }
  ])

  // Create Vendor State
  const [isVendorDiffOpen, setIsVendorDiffOpen] = useState(false)
  const [newVendor, setNewVendor] = useState({ name: "", phone: "", address: "", email: "", contactPerson: "" })

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await createVendor(newVendor)
      setNewVendor({ name: "", phone: "", address: "", email: "", contactPerson: "" })
      setIsVendorDiffOpen(false)
    } catch (err: any) {
      console.error(err)
      const errorMessage = err.response?.data?.message || err.message || "Failed to create vendor"
      alert(`Error: ${errorMessage}`)
    }
  }

  // --- Create Order Logic ---

  const handleAddItem = () => {
    setOrderItems([...orderItems, { productId: "", quantity: "", cost: "" }])
  }

  const handleRemoveItem = (index: number) => {
    const newItems = [...orderItems]
    newItems.splice(index, 1)
    setOrderItems(newItems)
  }

  const handleItemChange = (index: number, field: string, value: string) => {
    const newItems = [...orderItems]
    newItems[index] = { ...newItems[index], [field]: value }
    setOrderItems(newItems)
  }

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate items
    const validItems = orderItems.filter(item => item.productId && Number(item.quantity) > 0 && Number(item.cost) >= 0)

    if (validItems.length === 0) {
      alert("Please add at least one valid product.")
      return
    }

    const payloadItems = validItems.map(item => {
      const product = products.find(p => p.id === item.productId)
      return {
        productId: item.productId,
        productName: product?.name || "Unknown Product",
        quantity: Number(item.quantity),
        quantityReceived: 0,
        cost: Number(item.cost)
      }
    })

    await createManufacturerOrder({
      vendorId,
      items: payloadItems,
      orderDate: orderDate,
      expectedArrival: expectedArrival,
      status: "Ordered",
    })

    // Reset Form
    setVendorId("")
    setOrderDate(new Date().toISOString().split("T")[0])
    setExpectedArrival("")
    setOrderItems([{ productId: "", quantity: "", cost: "" }])
    setIsCreateOpen(false)
  }

  // --- Receive Items Logic ---

  const openReceiveModal = (order: ManufacturerOrder) => {
    setSelectedOrder(order)
    setReceiveQuantities({}) // Reset inputs

    // Initialize dates for all items to today
    const initialDates: { [key: string]: string } = {}
    order.items.forEach(item => {
      initialDates[item.productId] = new Date().toISOString().split("T")[0]
    })
    setReceiveDates(initialDates)
    setDiscount("0")
    setCgst("0")
    setSgst("0")

    setExpandedHistory(null)
    setIsReceiveOpen(true)
  }

  const handleReceiveChange = (productId: string, value: string) => {
    setReceiveQuantities(prev => ({ ...prev, [productId]: value }))
  }

  const handleDateChange = (productId: string, value: string) => {
    setReceiveDates(prev => ({ ...prev, [productId]: value }))
  }

  const handleConfirmReceive = async () => {
    if (!selectedOrder) return

    const itemsToReceive = Object.entries(receiveQuantities)
      .map(([productId, qty]) => ({
        productId,
        receivedQuantity: Number(qty)
      }))
      .filter(item => item.receivedQuantity > 0)

    if (itemsToReceive.length === 0) {
      setIsReceiveOpen(false)
      return
    }

    await receiveManufacturerOrderItems(
      selectedOrder.orderId,
      itemsToReceive.map(i => ({
        ...i,
        receivedDate: receiveDates[i.productId] || new Date().toISOString().split("T")[0]
      })),
      Number(discount),
      Number(cgst),
      Number(sgst)
    )

    setIsReceiveOpen(false)
    setSelectedOrder(null)
  }


  // --- Helper ---
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Received":
        return "bg-green-100 text-green-800 border-green-200"
      case "Partially Received":
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
          <p className="text-muted-foreground">Manage purchase orders and inventory restocking</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Create New Purchase Order</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitCreate} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="orderDate">Order Date</Label>
                  <Input
                    id="orderDate"
                    type="date"
                    required
                    value={orderDate}
                    onChange={(e) => setOrderDate(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="vendor">Vendor</Label>
                  <div className="flex gap-2">
                    <Select value={vendorId} onValueChange={setVendorId}>
                      <SelectTrigger id="vendor">
                        <SelectValue placeholder="Select Vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        {vendors.map((v) => (
                          <SelectItem key={v._id} value={v._id}>{v.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Dialog open={isVendorDiffOpen} onOpenChange={setIsVendorDiffOpen}>
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline" size="icon">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Vendor</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCreateVendor} className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label>Vendor Name *</Label>
                            <Input required value={newVendor.name} onChange={e => setNewVendor({ ...newVendor, name: e.target.value })} placeholder="Acme Corp" />
                          </div>
                          <div className="space-y-2">
                            <Label>Phone *</Label>
                            <Input required value={newVendor.phone} onChange={e => setNewVendor({ ...newVendor, phone: e.target.value })} placeholder="+91..." />
                          </div>
                          <div className="space-y-2">
                            <Label>Address *</Label>
                            <Input required value={newVendor.address} onChange={e => setNewVendor({ ...newVendor, address: e.target.value })} placeholder="Address" />
                          </div>
                          <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="email" value={newVendor.email} onChange={e => setNewVendor({ ...newVendor, email: e.target.value })} placeholder="Email (Optional)" />
                          </div>
                          <div className="space-y-2">
                            <Label>Contact Person</Label>
                            <Input value={newVendor.contactPerson} onChange={e => setNewVendor({ ...newVendor, contactPerson: e.target.value })} placeholder="Name (Optional)" />
                          </div>
                          <Button type="submit" className="w-full">Save Vendor</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expectedArrival">Expected Arrival</Label>
                  <Input
                    id="expectedArrival"
                    type="date"
                    required
                    value={expectedArrival}
                    onChange={(e) => setExpectedArrival(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Order Items</Label>
                  <Button type="button" variant="outline" size="sm" onClick={handleAddItem}>
                    <Plus className="h-4 w-4 mr-1" /> Add Item
                  </Button>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-12 gap-2 bg-muted p-2 text-xs font-medium text-muted-foreground border-b uppercase">
                    <div className="col-span-5">Product</div>
                    <div className="col-span-2">Qty</div>
                    <div className="col-span-3">Cost/Unit</div>
                    <div className="col-span-2">Action</div>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto p-2 space-y-2">
                    {orderItems.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-center">
                        <div className="col-span-5">
                          <Select
                            value={item.productId}
                            onValueChange={(val) => handleItemChange(index, "productId", val)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Select Product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map(p => (
                                <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            min="1"
                            placeholder="Qty"
                            className="h-8"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                          />
                        </div>
                        <div className="col-span-3">
                          <div className="relative">
                            <span className="absolute left-2 top-1.5 text-xs text-muted-foreground">₹</span>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              className="h-8 pl-5"
                              value={item.cost}
                              onChange={(e) => handleItemChange(index, "cost", e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="col-span-2 flex justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => handleRemoveItem(index)}
                            disabled={orderItems.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Order</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {
        manufacturerOrders.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Factory className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
              <h2 className="mb-2 text-xl font-semibold">No orders found</h2>
              <p className="text-muted-foreground">Get started by creating a new manufacturer order.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Factory className="h-5 w-5" />
                All Orders ({manufacturerOrders.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Vendor</TableHead>
                      <TableHead>Order Date</TableHead>
                      <TableHead className="text-center">Items</TableHead>
                      <TableHead className="text-right">Total Cost</TableHead>
                      <TableHead>Expected</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {manufacturerOrders.map((order) => (
                      <TableRow key={order.orderId}>
                        <TableCell className="font-medium">{order.orderId}</TableCell>
                        <TableCell>{order.vendor?.name || "Unknown"}</TableCell>
                        <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                        <TableCell className="text-center">
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-secondary text-xs">
                            {order.items.length} Products
                          </span>
                        </TableCell>
                        <TableCell className="text-right">₹{order.totalCost.toFixed(2)}</TableCell>
                        <TableCell>{new Date(order.expectedArrival).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
                              onClick={() => openReceiveModal(order)}
                            >
                              <PackageCheck className="h-4 w-4 mr-1" /> Manage
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
        )
      }

      {/* Receive / Manage Items Modal */}
      <Dialog open={isReceiveOpen} onOpenChange={setIsReceiveOpen}>
        <DialogContent className="max-w-6xl bg-background p-0 overflow-hidden flex flex-col max-h-[85vh] w-[95vw]">
          <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
            <DialogTitle className="text-xl">Manage Order: <span className="font-mono text-muted-foreground ml-2">{selectedOrder?.orderId}</span></DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <>
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Order Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted/30 p-4 rounded-xl border">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Order Date</div>
                    <div className="font-mono text-lg font-medium">
                      {selectedOrder.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString() : "-"}
                    </div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl border">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total Cost</div>
                    <div className="font-mono text-lg font-medium">₹{selectedOrder.totalCost.toFixed(2)}</div>
                  </div>
                  <div className="bg-muted/30 p-4 rounded-xl border flex flex-col justify-center items-start col-span-2 md:col-span-2">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Status</div>
                    <Badge variant="outline" className={`
                        px-3 py-1 text-sm font-medium border-0
                        ${selectedOrder.status === 'Received' ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}
                        ${selectedOrder.status === 'Partially Received' ? 'bg-amber-100 text-amber-700 hover:bg-amber-100' : ''}
                        ${selectedOrder.status === 'Ordered' ? 'bg-slate-100 text-slate-700 hover:bg-slate-100' : ''}
                        ${selectedOrder.status === 'Cancelled' ? 'bg-red-100 text-red-700 hover:bg-red-100' : ''}
                    `}>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                </div>

                {/* Products Table Section (Desktop/Visible on md+) */}
                <div className="hidden md:block">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    Received Items
                    <Badge variant="secondary" className="text-xs font-normal">
                      {selectedOrder.items.length} Items
                    </Badge>
                  </h3>
                  <div className="border rounded-lg bg-background overflow-hidden shadow-sm overflow-x-auto">
                    <Table className="table-fixed min-w-[700px]">
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead className="w-[35%] pl-4">Product Details</TableHead>
                          <TableHead className="text-right w-[15%]">Ordered</TableHead>
                          <TableHead className="text-right w-[15%]">Received</TableHead>
                          <TableHead className="text-right w-[15%]">Remaining</TableHead>
                          <TableHead className="w-[20%] text-center">Receive Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items.map((item) => {
                          const remaining = item.quantity - item.quantityReceived
                          const isFullyReceived = remaining <= 0

                          return (
                            <Fragment key={item.productId}>
                              <TableRow className={`group transition-colors ${isFullyReceived ? "bg-muted/40 hover:bg-muted/50" : "hover:bg-muted/5"}`}>
                                <TableCell className="font-medium align-top py-4 pl-4">
                                  <div className="flex flex-col gap-1">
                                    <span className="text-sm font-semibold text-foreground truncate max-w-[250px]" title={item.productName}>
                                      {item.productName}
                                    </span>
                                    {item.deliveries && item.deliveries.length > 0 && (
                                      <button
                                        onClick={() => setExpandedHistory(expandedHistory === item.productId ? null : item.productId)}
                                        className="text-xs text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 w-fit transition-colors"
                                      >
                                        <Eye className="h-3 w-3" />
                                        {expandedHistory === item.productId ? "Hide History" : "View History"}
                                      </button>
                                    )}
                                    {isFullyReceived && (
                                      <Badge variant="secondary" className="w-fit bg-green-100 text-green-700 border-green-200 mt-1 text-[10px] px-2 py-0.5">
                                        Completed
                                      </Badge>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="text-right align-top py-4 font-mono text-muted-foreground">{item.quantity}</TableCell>
                                <TableCell className="text-right align-top py-4 font-mono text-green-600">{item.quantityReceived}</TableCell>
                                <TableCell className="text-right align-top py-4">
                                  <span className={`font-mono font-bold ${remaining > 0 ? "text-foreground" : "text-muted-foreground"}`}>
                                    {remaining}
                                  </span>
                                </TableCell>
                                <TableCell className="align-top py-4">
                                  {!isFullyReceived && selectedOrder.status !== 'Cancelled' && (
                                    <div className="space-y-2">
                                      <div className="relative">
                                        <Input
                                          type="number"
                                          min="0"
                                          max={remaining}
                                          placeholder="Qty"
                                          className="h-9 w-full text-right bg-background border-input focus:ring-1 pr-8"
                                          value={receiveQuantities[item.productId] || ""}
                                          onChange={(e) => handleReceiveChange(item.productId, e.target.value)}
                                        />
                                        <span className="absolute right-3 top-2.5 text-xs text-muted-foreground pointer-events-none">
                                          / {remaining}
                                        </span>
                                      </div>
                                      <Input
                                        type="date"
                                        className="h-9 w-full bg-background border-input text-xs"
                                        value={receiveDates[item.productId] || ""}
                                        onChange={(e) => handleDateChange(item.productId, e.target.value)}
                                      />
                                    </div>
                                  )}
                                </TableCell>
                              </TableRow>
                              {expandedHistory === item.productId && item.deliveries && (
                                <TableRow className="bg-muted/10">
                                  <TableCell colSpan={5} className="p-0">
                                    <div className="p-4 bg-muted/20 border-y shadow-inner">
                                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 pl-1">Delivery History</p>
                                      <div className="space-y-2">
                                        {item.deliveries.map((delivery, idx) => (
                                          <div key={idx} className="flex items-center text-sm bg-background border rounded-md px-3 py-2">
                                            <span className="font-mono font-medium w-8 text-right mr-3">{idx + 1}.</span>
                                            <span className="font-medium mr-auto">Received <span className="text-green-600">{delivery.receivedQuantity}</span> units</span>
                                            <span className="text-muted-foreground font-mono text-xs">
                                              {new Date(delivery.receivedDate).toLocaleDateString()}
                                            </span>
                                            <span className="ml-4 text-xs bg-muted px-2 py-0.5 rounded text-muted-foreground">Admin</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              )}
                            </Fragment>
                          )
                        })}
                      </TableBody>
                    </Table>
                  </div>

                </div>

                {/* Mobile Card View (< 768px) */}
                <div className="md:hidden space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    Received Items
                    <Badge variant="secondary" className="text-xs font-normal">
                      {selectedOrder.items.length} Items
                    </Badge>
                  </h3>
                  {selectedOrder.items.map((item) => {
                    const remaining = item.quantity - item.quantityReceived
                    const isFullyReceived = remaining <= 0

                    return (
                      <div key={item.productId} className={`border rounded-lg p-4 space-y-4 ${isFullyReceived ? "bg-muted/40" : "bg-background"}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-sm">{item.productName}</div>
                            {isFullyReceived && <Badge variant="secondary" className="text-[10px] mt-1">Completed</Badge>}
                          </div>
                          <div className="text-right text-xs space-y-1">
                            <div className="text-muted-foreground">Ordered: {item.quantity}</div>
                            <div className="text-green-600">Received: {item.quantityReceived}</div>
                            <div className="font-bold">Remaining: {remaining}</div>
                          </div>
                        </div>

                        {!isFullyReceived && selectedOrder.status !== 'Cancelled' && (
                          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Receive Qty</Label>
                              <div className="relative">
                                <Input
                                  type="number"
                                  min="0"
                                  max={remaining}
                                  className="h-9 w-full bg-background"
                                  value={receiveQuantities[item.productId] || ""}
                                  onChange={(e) => handleReceiveChange(item.productId, e.target.value)}
                                />
                                <span className="absolute right-2 top-2.5 text-xs text-muted-foreground">/{remaining}</span>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-muted-foreground">Date</Label>
                              <Input
                                type="date"
                                className="h-9 w-full bg-background"
                                value={receiveDates[item.productId] || ""}
                                onChange={(e) => handleDateChange(item.productId, e.target.value)}
                              />
                            </div>
                          </div>
                        )}

                        <div className="pt-2">
                          <button
                            onClick={() => setExpandedHistory(expandedHistory === item.productId ? null : item.productId)}
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" /> {expandedHistory === item.productId ? "Hide History" : "View History"}
                          </button>
                          {expandedHistory === item.productId && item.deliveries && (
                            <div className="mt-2 space-y-2 bg-muted/20 p-2 rounded">
                              {item.deliveries.map((delivery, idx) => (
                                <div key={idx} className="flex justify-between text-xs border-b border-border/50 pb-1 last:border-0">
                                  <span>{new Date(delivery.receivedDate).toLocaleDateString()}</span>
                                  <span><strong>{delivery.receivedQuantity}</strong> units</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Tax and Discount Section */}
                <div className="bg-muted/30 p-6 rounded-xl border mt-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Invoice Adjustments</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="discount" className="text-xs">Flat Discount (₹)</Label>
                      <Input
                        id="discount"
                        type="number"
                        placeholder="0"
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cgst" className="text-xs">CGST (%)</Label>
                      <Input
                        id="cgst"
                        type="number"
                        placeholder="0"
                        value={cgst}
                        onChange={(e) => setCgst(e.target.value)}
                        className="h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sgst" className="text-xs">SGST (%)</Label>
                      <Input
                        id="sgst"
                        type="number"
                        placeholder="0"
                        value={sgst}
                        onChange={(e) => setSgst(e.target.value)}
                        className="h-10"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t bg-background flex justify-end gap-3 flex-shrink-0">
                <Button variant="outline" onClick={() => setIsReceiveOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmReceive}
                  disabled={Object.keys(receiveQuantities).length === 0}
                >
                  Update Received Items
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div >
  )
}
