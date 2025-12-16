// Dummy product data
export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
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

export const categories = ["Electronics", "Clothing", "Books", "Home & Garden", "Sports", "Toys"]

export const products: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 99.99,
    category: "Electronics",
    image: "/wireless-headphones.png",
    stock: 50,
    manufacturer: "TechCorp",
  },
  {
    id: "2",
    name: "Cotton T-Shirt",
    description: "Comfortable 100% cotton t-shirt available in multiple sizes",
    price: 19.99,
    category: "Clothing",
    image: "/cotton-tshirt.png",
    stock: 200,
    manufacturer: "FashionHub",
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
  },
  {
    id: "3",
    name: "JavaScript Guide",
    description: "Complete guide to modern JavaScript programming",
    price: 29.99,
    category: "Books",
    image: "/javascript-programming-book.png",
    stock: 100,
    manufacturer: "BookPress",
  },
  {
    id: "4",
    name: "Garden Tool Set",
    description: "Complete set of essential garden tools including shovel, rake, and pruning shears",
    price: 49.99,
    category: "Home & Garden",
    image: "/garden-tool-set.jpg",
    stock: 30,
    manufacturer: "GardenPro",
  },
  {
    id: "5",
    name: "Yoga Mat",
    description: "Non-slip yoga mat for all levels, eco-friendly material",
    price: 24.99,
    category: "Sports",
    image: "/rolled-yoga-mat.png",
    stock: 75,
    manufacturer: "FitLife",
  },
  {
    id: "6",
    name: "Building Blocks Set",
    description: "Educational building blocks for kids aged 3+, 500 pieces",
    price: 34.99,
    category: "Toys",
    image: "/colorful-building-blocks.png",
    stock: 120,
    manufacturer: "ToyWorld",
  },
  {
    id: "7",
    name: "Leather Jacket",
    description: "Premium leather jacket with classic design",
    price: 149.99,
    category: "Clothing",
    image: "/black-leather-jacket.png",
    stock: 35,
    manufacturer: "FashionHub",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "8",
    name: "Smart Watch",
    description: "Fitness tracker with heart rate monitor and GPS",
    price: 199.99,
    category: "Electronics",
    image: "/smart-watch-fitness.png",
    stock: 60,
    manufacturer: "TechCorp",
  },
  {
    id: "9",
    name: "Running Shoes",
    description: "Lightweight running shoes with excellent cushioning",
    price: 89.99,
    category: "Clothing",
    image: "/running-shoes.jpg",
    stock: 100,
    manufacturer: "FitLife",
    sizes: ["7", "8", "9", "10", "11", "12"],
  },
  {
    id: "10",
    name: "Cookbook Collection",
    description: "Essential cookbook with 200+ recipes from around the world",
    price: 24.99,
    category: "Books",
    image: "/cookbook-recipes.jpg",
    stock: 80,
    manufacturer: "BookPress",
  },
  {
    id: "11",
    name: "LED Desk Lamp",
    description: "Adjustable LED desk lamp with multiple brightness levels",
    price: 39.99,
    category: "Home & Garden",
    image: "/led-desk-lamp.png",
    stock: 45,
    manufacturer: "GardenPro",
  },
  {
    id: "12",
    name: "Tennis Racket",
    description: "Professional-grade tennis racket for advanced players",
    price: 129.99,
    category: "Sports",
    image: "/tennis-racket.png",
    stock: 25,
    manufacturer: "FitLife",
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
