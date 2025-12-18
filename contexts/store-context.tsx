"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { products as initialProducts, type Product } from "@/lib/dummy-data"
import api from "@/lib/api"


interface CartItem extends Product {
  quantity: number
  selectedSize?: string // For products with sizes
}

interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
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
  deliveryOption: "home" | "pickup"
  paymentMethod: "credit" | "debit" | "cod"
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  deliveryDetails: DeliveryDetails
  orderStatus: "Placed" | "Processing" | "Shipped" | "Delivered" | "Cancelled"
  deliveryStatus: "In Process" | "Delivered" | "Rejected" | "Not Received"
  createdAt: string
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

export interface ManufacturerOrder {
  id: string
  productId: string
  productName: string
  quantity: number
  quantityReceived: number
  cost: number
  orderDate: string
  expectedArrival: string
  status: "Ordered" | "In Transit" | "Received" | "Cancelled"
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

  products: Product[]
  addProduct: (product: Omit<Product, "id">) => void
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  updateStock: (productId: string, newStock: number) => void
  updateOrderDeliveryStatus: (orderId: string, status: Order["deliveryStatus"], deliveryAgent?: string) => void
  deliveryLogs: DeliveryLog[]
  manufacturerOrders: ManufacturerOrder[]
  createManufacturerOrder: (order: Omit<ManufacturerOrder, "id">) => void
  updateManufacturerOrder: (id: string, updates: Partial<ManufacturerOrder>) => void
  deleteManufacturerOrder: (id: string) => void
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

    // Fetch products from backend
    const fetchProducts = async () => {
      try {
        const { data } = await api.get('/products')
        setProducts(data)
      } catch (error: any) {
        if (error.response && error.response.status === 500) {
          console.warn("Backend products API failed (500), falling back to local data.")
        } else {
          console.error("Failed to fetch products:", error)
        }
        // Fallback to dummy data if API fails to avoid broken UI during dev
        setProducts(initialProducts)
      }
    }

    fetchProducts()

    // Fetch orders if user is logged in
    // This will be handled in a separate effect dependent on 'user'
  }, [])

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const { data } = await api.get('/orders')
          // Map backend order to frontend Order interface
          const mappedOrders: Order[] = data.map((order: any) => ({
            id: order._id,
            userId: order.user?._id || "unknown",
            items: order.orderItems.map((item: any) => ({
              productId: item.product,
              productName: item.name,
              quantity: item.quantity,
              price: item.price,
              selectedSize: item.size
            })),
            total: order.totalPrice,
            deliveryDetails: {
              name: order.shippingAddress?.name || order.user?.name || "Unknown User",
              phone: order.shippingAddress?.phone || "Not provided",
              address: order.shippingAddress?.address || "",
              deliveryOption: "home", // Default
              paymentMethod: order.paymentMethod as any
            },
            orderStatus: order.status === 'pending' ? 'Placed' : 'Processing', // Map status
            deliveryStatus: order.isDelivered ? 'Delivered' : 'In Process',
            createdAt: order.createdAt
          }))
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
    if (manufacturerOrders.length > 0) {
      localStorage.setItem("manufacturer_orders", JSON.stringify(manufacturerOrders))
    }
  }, [manufacturerOrders])

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
          city: "Unknown", // Frontend doesn't convert address string to parts yet
          postalCode: "00000",
          country: "Unknown"
        },
        paymentMethod: deliveryDetails.paymentMethod,
        totalPrice: total
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
        total: data.totalPrice,
        deliveryDetails,
        orderStatus: "Placed",
        deliveryStatus: "In Process", // Backend default
        createdAt: data.createdAt
      }

      setOrders((prev) => [newOrder, ...prev])
      clearCart()
      return newOrder
    } catch (error) {
      console.error("Create order failed", error)
      throw error
    }
  }

  const getAllOrders = () => {
    return orders
  }

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: `prod-${Date.now()}`,
    }
    setProducts((prev) => [...prev, newProduct])
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) => prev.map((product) => (product.id === id ? { ...product, ...updates } : product)))
  }

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.map((product) => (product.id === id ? { ...product, stock: 0 } : product)))
  }

  const updateStock = (productId: string, newStock: number) => {
    setProducts((prev) => prev.map((product) => (product.id === productId ? { ...product, stock: newStock } : product)))
  }

  const updateOrderDeliveryStatus = (orderId: string, status: Order["deliveryStatus"], deliveryAgent?: string) => {
    setOrders((prev) => {
      const updatedOrders = prev.map((order) => {
        if (order.id === orderId) {
          const previousStatus = order.deliveryStatus
          const newOrder = { ...order, deliveryStatus: status }

          if (status === "Delivered" && previousStatus !== "Delivered") {
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

            newOrder.orderStatus = "Delivered"
          }

          if (status === "Rejected") {
            newOrder.orderStatus = "Cancelled"
          } else if (status === "Not Received") {
            newOrder.orderStatus = "Cancelled"
          }

          return newOrder
        }
        return order
      })

      return updatedOrders
    })
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await api.post('/auth/login', { email, password })

      const newUser: User = {
        id: data._id,
        email: data.email,
        name: data.name,
        role: data.role as "admin" | "user",
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

  const isAdmin = user?.role === "admin"

  const createManufacturerOrder = (order: Omit<ManufacturerOrder, "id">) => {
    const newOrder: ManufacturerOrder = {
      ...order,
      id: `MFG-${Date.now()}`,
    }
    setManufacturerOrders((prev) => [newOrder, ...prev])
  }

  const updateManufacturerOrder = (id: string, updates: Partial<ManufacturerOrder>) => {
    setManufacturerOrders((prev) =>
      prev.map((order) => {
        if (order.id === id) {
          const updatedOrder = { ...order, ...updates }

          if (updates.status === "Received" && order.status !== "Received") {
            setProducts((prevProducts) =>
              prevProducts.map((product) => {
                if (product.id === order.productId) {
                  return {
                    ...product,
                    stock: product.stock + (updatedOrder.quantityReceived || updatedOrder.quantity),
                  }
                }
                return product
              }),
            )
          }

          return updatedOrder
        }
        return order
      }),
    )
  }

  const deleteManufacturerOrder = (id: string) => {
    setManufacturerOrders((prev) => prev.filter((order) => order.id !== id))
  }

  return (
    <StoreContext.Provider
      value={{
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
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        updateOrderDeliveryStatus,
        deliveryLogs,
        manufacturerOrders,
        createManufacturerOrder,
        updateManufacturerOrder,
        deleteManufacturerOrder,
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
