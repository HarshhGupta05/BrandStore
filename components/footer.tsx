import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-muted/50 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">E-Shop</h3>
            <p className="text-sm text-muted-foreground">Your one-stop shop for everything you need.</p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/categories" className="hover:text-primary">
                  All Categories
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-primary">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-primary">
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="#" className="hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="hover:text-primary">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-primary">
                  My Orders
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-primary">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2025 E-Shop. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
