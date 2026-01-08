"use client"

import Link from "next/link"
import Image from "next/image"
import { useStore } from "@/contexts/store-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart, User, LogOut, ShieldCheck, Moon, Sun, Menu } from "lucide-react"
import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Navbar() {
  const { cart, user, logout, isAdmin } = useStore()
  const [isDark, setIsDark] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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

  const NavLinks = ({ className = "", onClick = () => { } }: { className?: string; onClick?: () => void }) => (
    <>
      <Link href="/" className={`text-sm font-medium hover:text-primary transition-colors uppercase tracking-wide ${className}`} onClick={onClick}>
        Home
      </Link>
      <Link href="/categories" className={`text-sm font-medium hover:text-primary transition-colors uppercase tracking-wide ${className}`} onClick={onClick}>
        Categories
      </Link>
      {isAdmin && (
        <Link href="/admin" onClick={onClick}>
          <Button variant="outline" size="sm" className="gap-2 bg-transparent border-primary/20 text-primary hover:bg-primary hover:text-white w-full justify-start md:w-auto">
            <ShieldCheck className="h-4 w-4" />
            <span className="uppercase tracking-wide text-xs">Admin</span>
          </Button>
        </Link>
      )}
      {user && (
        <Link href="/orders" className={`text-sm font-medium hover:text-primary transition-colors uppercase tracking-wide ${className}`} onClick={onClick}>
          My Orders
        </Link>
      )}
    </>
  )

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center">
            {mounted ? (
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2 hover:bg-muted/50">
                    <Menu className="h-6 w-6 text-foreground/80" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col gap-8 mt-8">
                    <Link href="/" className="flex items-center gap-3 px-2" onClick={() => setIsOpen(false)}>
                      <Image src="/logo.png" alt="IEM Logo" width={40} height={40} className="object-contain" />
                      <span className="text-xl font-bold text-primary tracking-tight">IEM BRANDSTORE</span>
                    </Link>
                    <div className="flex flex-col gap-6 px-2">
                      <NavLinks className="text-base py-2 border-b border-border/50" onClick={() => setIsOpen(false)} />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Button variant="ghost" size="icon" className="mr-2 hover:bg-muted/50">
                <Menu className="h-6 w-6 text-foreground/80" />
              </Button>
            )}
          </div>

          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity group">
            <Image src="/logo.png" alt="IEM Logo" width={48} height={48} className="object-contain" />
            <span className="hidden sm:inline text-2xl font-bold text-primary tracking-tight">IEM BrandStore</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLinks />
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleDarkMode}
              className="text-muted-foreground hover:text-primary hover:bg-muted/50"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary hover:bg-muted/50">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground shadow-sm">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-border/50">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-medium leading-none">{user.name}</span>
                  {isAdmin && <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Administrator</span>}
                </div>
                <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md">
                  <User className="h-4 w-4 mr-2" /> <span className="text-sm font-medium">Login</span>
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
