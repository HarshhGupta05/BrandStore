"use client"

import Link from "next/link"
import Image from "next/image"
import { useStore } from "@/contexts/store-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, LogOut, ShieldCheck, Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function Navbar() {
  const { cart, user, logout, isAdmin } = useStore()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode") === "true"
    setIsDark(darkMode)
    if (darkMode) {
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !isDark
    setIsDark(newDarkMode)
    localStorage.setItem("darkMode", String(newDarkMode))
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleLogout = () => {
    logout()
    window.location.href = "/"
  }

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image src="/logo.png" alt="IEM Logo" width={48} height={48} className="object-contain" />
            <span className="text-2xl font-bold">IEM BrandStore</span>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <Link href="/categories" className="hover:text-primary">
              Categories
            </Link>
            {isAdmin && (
              <Link href="/admin">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <ShieldCheck className="h-4 w-4" />
                  Admin Panel
                </Button>
              </Link>
            )}
            {user && (
              <Link href="/orders" className="hover:text-primary">
                My Orders
              </Link>
            )}
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleDarkMode}
              className="bg-transparent"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Link href="/cart">
              <Button variant="outline" size="icon" className="relative bg-transparent">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {user.name}
                  {isAdmin && <span className="ml-1 text-xs text-muted-foreground">(Admin)</span>}
                </span>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
