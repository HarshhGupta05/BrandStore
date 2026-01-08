"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { products as initialProducts, type Product } from "@/lib/dummy-data"
import api from "../lib/api"


interface CartItem extends Product {
  quantity: number
  selectedSize?: string // For products with sizes
}

export interface Address {
  name: string
  address: string
  city: string
  postalCode: string
  country: string
  phone: string
  isDefault?: boolean
}

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
  addresses?: Address[]
}

interface AuthToken {
  token: string
  user: User
  expiresAt: number
}

export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  selectedSize?: string
}

export interface DeliveryDetails {
  name: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
  deliveryOption: "home" | "pickup"
  paymentMethod: "credit" | "debit" | "cod"
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  taxPrice: number
  shippingPrice: number
  total: number
  deliveryDetails: DeliveryDetails
  orderStatus: "Placed" | "In Process" | "Shipped" | "Delivered" | "Cancelled"
  deliveryStatus: "In Process" | "Delivered" | "Rejected" | "Not Received"
  createdAt: string
  deliveredAt?: string
}

export interface DeliveryLog {
  id: string
  orderId: string
  productName: string
  quantity: number
  price: number
  deliveryAgent: string
  deliveredAt: string
}

// Updated Manufacturer Order Interface
export interface ManufacturerOrderItem {
  productId: string
  productName: string
  quantity: number
  quantityReceived: number
  cost: number
  deliveries?: {
    receivedQuantity: number
    receivedDate: string
    receivedBy?: string
  }[]
}

export interface ManufacturerOrder {
  id: string // Frontend ID mapped from _id or orderId
  orderId: string // Display ID (MFG-XXX)
  items: ManufacturerOrderItem[]
  receivingHistory?: {
    productId: string
    quantityReceived: number
    receivedDate: string
    costPerUnit: number
  }[]
  orderDate: string
  expectedArrival: string
  status: "Ordered" | "In Transit" | "Partially Received" | "Received" | "Cancelled"
  totalCost: number
}

export interface VendorInvoice {
  _id: string
  invoiceId: string
  manufacturerOrderId: string
  vendorName: string
  items: {
    productId: string
    productName: string
    quantity: number
    costPerUnit: number
    total: number
  }[]
  totalAmount: number
  invoiceDate: string
  status: "Pending" | "Paid"
  createdAt: string
}

interface StoreContextType {
  cart: CartItem[]
  addToCart: (product: Product, size?: string) => void
  removeFromCart: (productId: string, size?: string) => void
  updateQuantity: (productId: string, quantity: number, size?: string) => void
  clearCart: () => void
  getCartTotal: () => number
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isAdmin: boolean
  orders: Order[]
  createOrder: (deliveryDetails: DeliveryDetails) => Promise<Order>
  getAllOrders: () => Order[]
  cancelOrder: (orderId: string) => Promise<void>

  products: Product[]
  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  updateStock: (productId: string, newStock: number) => void
  updateOrderDeliveryStatus: (orderId: string, status: Order["deliveryStatus"], deliveryAgent?: string) => void
  deliveryLogs: DeliveryLog[]
  manufacturerOrders: ManufacturerOrder[]
  createManufacturerOrder: (items: any[], expectedDate: string, vendorName: string) => Promise<void>
  receiveManufacturerOrderItems: (orderId: string, items: { productId: string, receivedQuantity: number, receivedDate?: string }[]) => Promise<void>
  updateManufacturerOrderStatus: (orderId: string, status: string) => Promise<void>
  deleteManufacturerOrder: (orderId: string) => Promise<void>
  categories: { id: string, name: string, description?: string }[]
  addCategory: (category: { name: string, description: string }) => Promise<void>
  updateCategory: (id: string, updates: { name?: string, description?: string }) => Promise<void>
  deleteCategory: (id: string) => Promise<void>
  vendorInvoices: VendorInvoice[]
  fetchVendorInvoices: () => Promise<void>
  payVendorInvoice: (invoiceId: string) => Promise<void>
  refreshUser: () => Promise<void>
  fetchOrders: () => Promise<void>
  submitReview: (productId: string, rating: number, comment: string) => Promise<void>
  addAddress: (address: Address) => Promise<void>
  isLoading: boolean
  refreshProducts: () => Promise<void>
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

const ADMIN_EMAIL = "admin@eshop.com"
const ADMIN_PASSWORD = "admin123"

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [deliveryLogs, setDeliveryLogs] = useState<DeliveryLog[]>([])
  const [manufacturerOrders, setManufacturerOrders] = useState<ManufacturerOrder[]>([])
  const [vendorInvoices, setVendorInvoices] = useState<VendorInvoice[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const refreshProducts = async () => {
    try {
      const { data } = await api.get('/products')
      setProducts(data)
    } catch (error: any) {
      if (error.response && error.response.status === 500) {
        console.warn("Backend products API failed (500), falling back to local data.")
      } else {
        console.error("Failed to fetch products:", error)
      }
      setProducts(initialProducts)
    }
  }

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth_token")
    if (storedAuth) {
      try {
        const authData: AuthToken = JSON.parse(storedAuth)
        if (authData.expiresAt > Date.now()) {
          setUser(authData.user)
        } else {
          localStorage.removeItem("auth_token")
        }
      } catch (error) {
        localStorage.removeItem("auth_token")
      }
    }

    const storedCart = localStorage.getItem("cart")
    if (storedCart) {
      try {
        setCart(JSON.parse(storedCart))
      } catch (error) {
        console.error("Failed to load cart:", error)
      }
    }

    refreshProducts()

    // Fetch orders if user is logged in
    // This will be handled in a separate effect dependent on 'user'
    setIsLoading(false)
  }, [])


  const fetchOrders = async () => {
    if (user) {
      try {
        const { data } = await api.get('/orders')
        // Map backend order to frontend Order interface
        const mappedOrders: Order[] = data.map((order: any) => ({
          id: order._id,
          userId: order.user?._id || "unknown",
          items: order.orderItems.map((item: any) => ({
            productId: item.productId || item.product,
            productName: item.name,
            quantity: item.quantity,
            price: item.price,
            selectedSize: item.size
          })),
          total: Number(order.totalPrice) || 0,
          taxPrice: Number(order.taxPrice) || 0,
          shippingPrice: Number(order.shippingPrice) || 0,
          deliveryDetails: {
            name: order.shippingAddress?.name || order.user?.name || "Unknown User",
            phone: order.shippingAddress?.phone || "Not provided",
            address: order.shippingAddress?.address || "",
            city: order.shippingAddress?.city || "",
            postalCode: order.shippingAddress?.postalCode || "",
            country: order.shippingAddress?.country || "",
            deliveryOption: "home", // Default
            paymentMethod: order.paymentMethod as any
          },
          orderStatus:
            order.status === 'Cancelled' ? 'Cancelled' :
              order.status === 'Placed' ? 'Placed' :
                order.status === 'In Process' ? 'In Process' :
                  order.status === 'Shipped' ? 'Shipped' :
                    order.status === 'Delivered' ? 'Delivered' :
                      'Placed', // Default to Placed
          deliveryStatus: order.status === 'Delivered' ? 'Delivered' : (order.status === 'Cancelled' ? 'Rejected' : 'In Process'),
          createdAt: order.createdAt,
          deliveredAt: order.deliveredAt
        }))
        // Sort by createdAt desc
        mappedOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setOrders(mappedOrders)
      } catch (e: any) {
        console.error("Failed to fetch orders", e)
        if (e.response && e.response.status === 401) {
          logout()
        }
      }
    } else {
      setOrders([])
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [user])

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem("orders", JSON.stringify(orders))
    }
  }, [orders])

  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem("products", JSON.stringify(products))
    }
  }, [products])

  useEffect(() => {
    if (deliveryLogs.length > 0) {
      localStorage.setItem("delivery_logs", JSON.stringify(deliveryLogs))
    }
  }, [deliveryLogs])

  useEffect(() => {
    const fetchManufacturerOrders = async () => {
      try {
        const { data } = await api.get('/manufacturer-orders')
        // Map backend data to frontend interface
        const mappedOrders: ManufacturerOrder[] = data.map((order: any) => ({
          id: order._id,
          orderId: order.orderId,
          items: order.items,
          orderDate: order.orderDate,
          expectedArrival: order.expectedArrival,
          status: order.status,
          totalCost: order.totalCost
        }))
        setManufacturerOrders(mappedOrders)
      } catch (error) {
        console.error("Failed to fetch manufacturer orders", error)
      }
    }
    fetchManufacturerOrders()
  }, [])

  const addToCart = (product: Product, size?: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.selectedSize === size)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.selectedSize === size ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size }]
    })
  }

  const removeFromCart = (productId: string, size?: string) => {
    setCart((prev) => prev.filter((item) => !(item.id === productId && item.selectedSize === size)))
  }

  const updateQuantity = (productId: string, quantity: number, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size)
      return
    }
    setCart((prev) =>
      prev.map((item) => (item.id === productId && item.selectedSize === size ? { ...item, quantity } : item)),
    )
  }

  const clearCart = () => {
    setCart([])
    localStorage.removeItem("cart")
  }

  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const createOrder = async (deliveryDetails: DeliveryDetails): Promise<Order> => {
    if (!user) {
      throw new Error("User must be logged in to create an order")
    }

    if (cart.length === 0) {
      throw new Error("Cart is empty")
    }

    const orderItems = cart.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      image: item.image,
      price: item.price,
      product: item._id || item.id,
      productId: item.id, // custom string ID (e.g. "1")
      size: item.selectedSize
    }))

    const total = getCartTotal()

    try {
      const { data } = await api.post('/orders', {
        orderItems,
        shippingAddress: {
          name: deliveryDetails.name,
          phone: deliveryDetails.phone,
          address: deliveryDetails.address,
          city: deliveryDetails.city,
          postalCode: deliveryDetails.postalCode,
          country: deliveryDetails.country
        },
        paymentMethod: deliveryDetails.paymentMethod,
        taxPrice: total * 0.1,
        shippingPrice: 0,
        totalPrice: total * 1.1
      })

      // Adapt backend response to Order interface if needed
      // Backend returns _id, frontend uses id
      // Map it:
      const newOrder: Order = {
        id: data._id,
        userId: user.id, // simplified
        items: data.orderItems.map((i: any) => ({
          productId: i.product,
          productName: i.name,
          quantity: i.quantity,
          price: i.price,
          selectedSize: i.size
        })),
        total: Number(data.totalPrice) || 0,
        taxPrice: Number(data.taxPrice) || 0,
        shippingPrice: Number(data.shippingPrice) || 0,
        deliveryDetails,
        orderStatus: "Placed",
        deliveryStatus: "In Process", // Backend default
        createdAt: data.createdAt
      }

      setOrders((prev) => [newOrder, ...prev])
      clearCart()
      // Refresh user to get updated addresses if any were added
      await refreshUser()
      return newOrder
    } catch (error) {
      console.error("Create order failed", error)
      throw error
    }
  }

  const getAllOrders = () => {
    return orders
  }

  const cancelOrder = async (orderId: string) => {
    try {
      await api.put(`/orders/${orderId}/cancel`)
      setOrders(prev => prev.map(order =>
        order.id === orderId ? { ...order, orderStatus: 'Cancelled' } : order
      ))
    } catch (error) {
      console.error("Failed to cancel order:", error)
      throw error
    }
  }

  // Products CRUD with Backend
  const addProduct = async (product: Omit<Product, "id">) => {
    try {
      const { data } = await api.post('/products', product)
      setProducts((prev) => [...prev, data])
    } catch (error) {
      console.error("Failed to add product:", error)
      // Fallback for demo if backend fails
      const newProduct: Product = { ...product, id: `prod-${Date.now()}` }
      setProducts((prev) => [...prev, newProduct])
    }
  }

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { data } = await api.put(`/products/${id}`, updates)
      setProducts((prev) => prev.map((product) => (product.id === id ? data : product)))
    } catch (error) {
      console.error("Failed to update product:", error)
      // Fallback
      setProducts((prev) => prev.map((product) => (product.id === id ? { ...product, ...updates } : product)))
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      await api.delete(`/products/${id}`)
      setProducts((prev) => prev.map((product) => (product.id === id ? { ...product, stock: 0 } : product))) // Soft delete in frontend to match previous logic, or remove completely if preferred. Let's stick to deactivating (stock 0) or removing. The User asked for permanent storage, deleting implies removal. But UI had "Deactivate". Let's assume soft delete for safety or hard delete for "Trash". 
      // Actually, standard delete is better.
      setProducts((prev) => prev.filter((p) => p.id !== id))
    } catch (error) {
      console.error("Failed to delete product:", error)
      setProducts((prev) => prev.map((product) => (product.id === id ? { ...product, stock: 0 } : product)))
    }
  }

  const updateStock = async (productId: string, newStock: number) => {
    await updateProduct(productId, { stock: newStock })
  }

  const updateOrderDeliveryStatus = async (orderId: string, status: Order["deliveryStatus"], deliveryAgent?: string) => {
    try {
      // Map frontend delivery status back to backend status
      let backendStatus: string = status
      if (status === "In Process") backendStatus = "In Process"
      if (status === "Delivered") backendStatus = "Delivered"
      if (status === "Rejected") backendStatus = "Cancelled"
      if (status === "Not Received") backendStatus = "Cancelled"

      const { data } = await api.put(`/orders/${orderId}/status`, { status: backendStatus })

      // Update local state by refetching
      await fetchOrders()

      // If delivered, we still want to add delivery logs (optional but keep for compatibility)
      if (status === "Delivered") {
        const order = orders.find(o => o.id === orderId)
        if (order) {
          const newLogs: DeliveryLog[] = order.items.map((item) => ({
            id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            orderId: order.id,
            productName: item.productName,
            quantity: item.quantity,
            price: item.price,
            deliveryAgent: deliveryAgent || "Not specified",
            deliveredAt: new Date().toISOString(),
          }))
          setDeliveryLogs((prevLogs) => [...newLogs, ...prevLogs])

          // Update stock locally if not already done by backend (ideally backend should handle this, 
          // but we follow current logic)
          setProducts((prevProducts) =>
            prevProducts.map((product) => {
              const orderItem = order.items.find((item) => item.productId === product.id)
              if (orderItem) {
                return {
                  ...product,
                  stock: Math.max(0, product.stock - orderItem.quantity),
                }
              }
              return product
            }),
          )
        }
      }
    } catch (error) {
      console.error("Failed to update order status", error)
      throw error
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await api.post('/auth/login', { email, password })

      const newUser: User = {
        id: data._id,
        email: data.email,
        name: data.name,
        role: data.role as "admin" | "user",
        addresses: data.addresses || []
      }

      const authToken: AuthToken = {
        token: data.token,
        user: newUser,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      }

      localStorage.setItem("auth_token", JSON.stringify(authToken))
      setUser(newUser)
      return true
    } catch (error: any) {
      console.error("Login failed", error)
      throw error // Throw error to be handled by the component
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await api.post('/auth/register', {
        name,
        email: email.trim().toLowerCase(),
        password: password.trim()
      })

      const newUser: User = {
        id: data._id,
        email: data.email,
        name: data.name,
        role: data.role as "admin" | "user",
        addresses: []
      }

      const authToken: AuthToken = {
        token: data.token,
        user: newUser,
        expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
      }

      localStorage.setItem("auth_token", JSON.stringify(authToken))
      setUser(newUser)
      return true
    } catch (error: any) {
      console.error("Registration failed", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    setUser(null)
  }

  const refreshUser = async () => {
    if (!user) return
    try {
      const { data } = await api.get('/users/profile')
      const updatedUser: User = {
        id: data._id,
        email: data.email,
        name: data.name,
        role: data.role as "admin" | "user",
        addresses: data.addresses || []
      }
      setUser(updatedUser)
      // Update local storage
      const storedAuth = localStorage.getItem("auth_token")
      if (storedAuth) {
        const authData = JSON.parse(storedAuth)
        authData.user = updatedUser
        localStorage.setItem("auth_token", JSON.stringify(authData))
      }
    } catch (error) {
      console.error("Failed to refresh user", error)
    }
  }

  const isAdmin = user?.role === "admin"

  const createManufacturerOrder = async (orderData: any) => {
    try {
      const { data } = await api.post('/manufacturer-orders', orderData)
      const newOrder: ManufacturerOrder = {
        id: data._id,
        orderId: data.orderId,
        items: data.items,
        orderDate: data.orderDate,
        expectedArrival: data.expectedArrival,
        status: data.status,
        totalCost: data.totalCost
      }
      setManufacturerOrders((prev) => [newOrder, ...prev])
    } catch (error) {
      console.error("Failed to create manufacturer order", error)
      throw error
    }
  }

  const receiveManufacturerOrderItems = async (orderId: string, items: { productId: string, receivedQuantity: number, receivedDate?: string }[]) => {
    try {
      const { data } = await api.put(`/manufacturer-orders/${orderId}/receive`, { receivedItems: items })

      // Update local state
      setManufacturerOrders((prev) => prev.map(order =>
        order.orderId === orderId ? {
          ...order,
          items: data.items,
          status: data.status
        } : order
      ))

      // Also re-fetch products to get updated stock
      const { data: productsData } = await api.get('/products')
      setProducts(productsData)

    } catch (error) {
      console.error("Failed to receive items", error)
      throw error
    }
  }

  const updateManufacturerOrderStatus = async (orderId: string, status: string) => {
    try {
      const { data } = await api.put(`/manufacturer-orders/${orderId}/status`, { status })
      setManufacturerOrders((prev) => prev.map(order =>
        order.orderId === orderId ? { ...order, status: data.status } : order
      ))
    } catch (error) {
      console.error("Failed to update status", error)
      throw error
    }
  }

  const deleteManufacturerOrder = async (orderId: string) => {
    try {
      await api.delete(`/manufacturer-orders/${orderId}`)
      setManufacturerOrders((prev) => prev.filter(order => order.orderId !== orderId))
    } catch (error) {
      console.error("Failed to delete order", error)
      throw error
    }
  }


  const [categories, setCategories] = useState<{ id: string, name: string, description?: string }[]>([])

  useEffect(() => {
    // ... existing token check ...
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/categories')
        if (data.length === 0) {
          // Trigger seed
          await api.post('/categories/seed')
          const seeded = await api.get('/categories')
          setCategories(seeded.data)
        } else {
          setCategories(data)
        }
      } catch (error) {
        console.error("Failed to fetch categories")
        // Fallback to dummy
        setCategories([
          { id: "cat-1", name: "Clothing", description: "Apparel" },
          { id: "cat-2", name: "Stationary", description: "Office" },
          { id: "cat-3", name: "Accessories", description: "Add-ons" }
        ])
      }
    }
    fetchCategories()

    // ... rest of effects
  }, [])

  // ... existing CRUD ...

  const addCategory = async (category: { name: string, description: string }) => {
    try {
      const { data } = await api.post('/categories', category)
      setCategories(prev => [...prev, data])
    } catch (e: any) {
      console.error("Add category failed", e)
      throw new Error(e.response?.data?.message || "Failed to add category")
    }
  }

  const updateCategory = async (id: string, updates: { name?: string, description?: string }) => {
    try {
      const { data } = await api.put(`/categories/${id}`, updates)
      setCategories(prev => prev.map(c => c.id === id ? data : c))
    } catch (error) {
      console.error("Failed to update order status", error)
      throw error
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      await api.delete(`/categories/${id}`)
      setCategories(prev => prev.filter(c => c.id !== id))
    } catch (e: any) {
      throw new Error(e.response?.data?.message || "Failed to delete category")
    }
  }

  const fetchVendorInvoices = async () => {
    try {
      const { data } = await api.get('/vendor-invoices')
      setVendorInvoices(data)
    } catch (error) {
      console.error("Failed to fetch vendor invoices", error)
    }
  }

  const payVendorInvoice = async (invoiceId: string) => {
    try {
      const { data } = await api.put(`/vendor-invoices/${invoiceId}/pay`)
      setVendorInvoices((prev) => prev.map(inv =>
        inv.invoiceId === invoiceId ? { ...inv, status: 'Paid' } : inv
      ))
    } catch (error) {
      console.error("Failed to pay invoice", error)
      throw error
    }
  }

  const submitReview = async (productId: string, rating: number, comment: string) => {
    try {
      await api.post(`/products/${productId}/reviews`, { rating, comment })
      const { data } = await api.get('/products')
      setProducts(data)
    } catch (error: any) {
      console.error("Failed to submit review:", error)
      throw new Error(error.response?.data?.message || "Failed to submit review")
    }
  }

  const addAddress = async (address: Address) => {
    try {
      const { data } = await api.post('/users/addresses', address)
      if (user) {
        const updatedUser = { ...user, addresses: data }
        setUser(updatedUser)

        // Update local storage
        const storedAuth = localStorage.getItem("auth_token")
        if (storedAuth) {
          const authData = JSON.parse(storedAuth)
          authData.user = updatedUser
          localStorage.setItem("auth_token", JSON.stringify(authData))
        }
      }
    } catch (error) {
      console.error("Failed to add address", error)
      throw error
    }
  }

  return (
    <StoreContext.Provider
      value={{
        // ... existing values
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        user,
        login,
        register,
        logout,
        isAdmin,
        orders,
        createOrder,
        getAllOrders,
        cancelOrder,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        updateOrderDeliveryStatus,
        deliveryLogs,
        manufacturerOrders,
        createManufacturerOrder,
        receiveManufacturerOrderItems, // Expose new method
        updateManufacturerOrderStatus, // Expose new method
        deleteManufacturerOrder,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        vendorInvoices,
        fetchVendorInvoices,
        payVendorInvoice,
        refreshUser,
        fetchOrders,
        submitReview,
        addAddress,
        isLoading,
        refreshProducts
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}


export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error("useStore must be used within a StoreProvider")
  }
  return context
}
