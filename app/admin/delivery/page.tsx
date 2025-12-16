"use client"

import { useStore } from "@/contexts/store-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Truck, Package } from "lucide-react"

export default function AdminDeliveryPage() {
  const { deliveryLogs } = useStore()

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Delivery Logs</h1>
      <p className="mb-8 text-muted-foreground">Automatically generated logs when orders are marked as delivered</p>

      {deliveryLogs.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Truck className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h2 className="mb-2 text-xl font-semibold">No deliveries yet</h2>
            <p className="text-muted-foreground">
              Delivery logs will automatically appear here when orders are marked as "Delivered"
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Delivery Records ({deliveryLogs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                    <TableHead>Delivery Agent</TableHead>
                    <TableHead>Date & Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deliveryLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">{log.orderId}</TableCell>
                      <TableCell>{log.productName}</TableCell>
                      <TableCell className="text-right">{log.quantity}</TableCell>
                      <TableCell className="text-right">${log.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">${(log.quantity * log.price).toFixed(2)}</TableCell>
                      <TableCell>{log.deliveryAgent}</TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(log.deliveredAt).toLocaleDateString()}</div>
                          <div className="text-muted-foreground">{new Date(log.deliveredAt).toLocaleTimeString()}</div>
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
    </div>
  )
}
