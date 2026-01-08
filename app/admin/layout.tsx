"use client"

import type React from "react"

import { useStore } from "@/contexts/store-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ShieldAlert } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isAdmin, isLoading } = useStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login")
      } else if (!isAdmin) {
        router.push("/")
      }
    }
  }, [user, isAdmin, router, isLoading])

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!user) {
    return null
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>You do not have permission to access the admin panel.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <aside className="w-64 space-y-2">
          <h2 className="font-bold text-xl mb-4">Admin Panel</h2>
          <Link href="/admin">
            <Button variant="ghost" className="w-full justify-start">
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/products">
            <Button variant="ghost" className="w-full justify-start">
              Products
            </Button>
          </Link>
          <Link href="/admin/categories">
            <Button variant="ghost" className="w-full justify-start">
              Categories
            </Button>
          </Link>
          <Link href="/admin/orders">
            <Button variant="ghost" className="w-full justify-start">
              Orders
            </Button>
          </Link>
          <Link href="/admin/stock">
            <Button variant="ghost" className="w-full justify-start">
              Stock Management
            </Button>
          </Link>
          <Link href="/admin/delivery">
            <Button variant="ghost" className="w-full justify-start">
              Delivery Logs
            </Button>
          </Link>
          <Link href="/admin/manufacturer">
            <Button variant="ghost" className="w-full justify-start">
              Manufacturer Orders
            </Button>
          </Link>
          <Link href="/admin/vendor-invoices">
            <Button variant="ghost" className="w-full justify-start">
              Vendor Invoices
            </Button>
          </Link>
          <Link href="/admin/requisitions">
            <Button variant="ghost" className="w-full justify-start">
              Requisitions / Events
            </Button>
          </Link>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
