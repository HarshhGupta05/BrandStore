// Dummy product data
export interface Product {
  id: string
  _id?: string // MongoDB ID
  name: string
  description: string
  price: number
  category: string
  image: string
  images?: string[]
  stock: number
  manufacturer: string
  sizes?: string[] // Optional sizes for clothing items
}

export interface Order {
  id: string
  userId: string
  products: { productId: string; quantity: number; price: number }[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered"
  date: string
}

export const categories = ["Clothing", "Stationary", "Accessories"]

export const products: Product[] = [
  {
    id: "1",
    name: "IEM Pink T-Shirt",
    description: "Premium cotton pink t-shirt with IEM branding",
    price: 250,
    category: "Clothing",
    image: "/tshirt-pink.jpg",
    stock: 100,
    manufacturer: "IEM Merch",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "2",
    name: "IEM White T-Shirt",
    description: "Classic white t-shirt with IEM logo",
    price: 250,
    category: "Clothing",
    image: "/tshirt-white.jpg",
    stock: 100,
    manufacturer: "IEM Merch",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "3",
    name: "IEM Green T-Shirt",
    description: "Stylish green t-shirt with IEM branding",
    price: 250,
    category: "Clothing",
    image: "/tshirt-green.jpg",
    stock: 100,
    manufacturer: "IEM Merch",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "4",
    name: "IEM White Bottle",
    description: "Durable white water bottle with IEM logo",
    price: 400,
    category: "Accessories",
    image: "/bottle-white.jpg",
    stock: 50,
    manufacturer: "IEM Merch",
  },
  {
    id: "5",
    name: "IEM Heated Bottle",
    description: "Insulated heated bottle to keep your drinks warm",
    price: 500,
    category: "Accessories",
    image: "/heated-bottle-white.jpg",
    stock: 30,
    manufacturer: "IEM Merch",
  },
  {
    id: "6",
    name: "IEM Mug",
    description: "White ceramic mug with IEM logo",
    price: 150,
    category: "Stationary", // User asked for Stationary/Accessories distribution, Mug fits better in Accessories but usually grouped with desk items
    image: "/iem-mug.jpeg",
    stock: 100,
    manufacturer: "IEM Merch",
  },
  {
    id: "7",
    name: "IEM Pen",
    description: "Premium ballpoint pen with IEM branding",
    price: 80,
    category: "Stationary",
    image: "/iem-pen.jpeg",
    stock: 200,
    manufacturer: "IEM Merch",
  },
  {
    id: "8",
    name: "IEM Giftware Set",
    description: "Complete gift set with notebook, pen and keychain",
    price: 300,
    category: "Stationary",
    image: "/iem-giftware.jpeg",
    stock: 40,
    manufacturer: "IEM Merch",
  },
  {
    id: "9",
    name: "IEM Keychain",
    description: "Metal keychain with IEM logo",
    price: 100,
    category: "Accessories",
    image: "/keychain.jpeg",
    stock: 150,
    manufacturer: "IEM Merch",
  },
]

export const dummyOrders: Order[] = [
  {
    id: "ORD-001",
    userId: "user-1",
    products: [
      { productId: "1", quantity: 1, price: 99.99 },
      { productId: "2", quantity: 2, price: 19.99 },
    ],
    total: 139.97,
    status: "delivered",
    date: "2024-01-15",
  },
  {
    id: "ORD-002",
    userId: "user-1",
    products: [{ productId: "3", quantity: 1, price: 29.99 }],
    total: 29.99,
    status: "shipped",
    date: "2024-01-20",
  },
]
