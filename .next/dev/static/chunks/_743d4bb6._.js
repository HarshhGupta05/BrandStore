(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/lib/dummy-data.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Dummy product data
__turbopack_context__.s([
    "categories",
    ()=>categories,
    "dummyOrders",
    ()=>dummyOrders,
    "products",
    ()=>products
]);
const categories = [
    "Clothing",
    "Stationary",
    "Accessories"
];
const products = [
    {
        id: "1",
        name: "IEM Pink T-Shirt",
        description: "Premium cotton pink t-shirt with IEM branding",
        price: 250,
        category: "Clothing",
        image: "/tshirt-pink.jpg",
        stock: 100,
        manufacturer: "IEM Merch",
        sizes: [
            "S",
            "M",
            "L",
            "XL"
        ]
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
        sizes: [
            "S",
            "M",
            "L",
            "XL"
        ]
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
        sizes: [
            "S",
            "M",
            "L",
            "XL"
        ]
    },
    {
        id: "4",
        name: "IEM White Bottle",
        description: "Durable white water bottle with IEM logo",
        price: 400,
        category: "Accessories",
        image: "/bottle-white.jpg",
        stock: 50,
        manufacturer: "IEM Merch"
    },
    {
        id: "5",
        name: "IEM Heated Bottle",
        description: "Insulated heated bottle to keep your drinks warm",
        price: 500,
        category: "Accessories",
        image: "/heated-bottle-white.jpg",
        stock: 30,
        manufacturer: "IEM Merch"
    },
    {
        id: "6",
        name: "IEM Mug",
        description: "White ceramic mug with IEM logo",
        price: 150,
        category: "Stationary",
        image: "/iem-mug.jpeg",
        stock: 100,
        manufacturer: "IEM Merch"
    },
    {
        id: "7",
        name: "IEM Pen",
        description: "Premium ballpoint pen with IEM branding",
        price: 80,
        category: "Stationary",
        image: "/iem-pen.jpeg",
        stock: 200,
        manufacturer: "IEM Merch"
    },
    {
        id: "8",
        name: "IEM Giftware Set",
        description: "Complete gift set with notebook, pen and keychain",
        price: 300,
        category: "Stationary",
        image: "/iem-giftware.jpeg",
        stock: 40,
        manufacturer: "IEM Merch"
    },
    {
        id: "9",
        name: "IEM Keychain",
        description: "Metal keychain with IEM logo",
        price: 100,
        category: "Accessories",
        image: "/keychain.jpeg",
        stock: 150,
        manufacturer: "IEM Merch"
    }
];
const dummyOrders = [
    {
        id: "ORD-001",
        userId: "user-1",
        products: [
            {
                productId: "1",
                quantity: 1,
                price: 99.99
            },
            {
                productId: "2",
                quantity: 2,
                price: 19.99
            }
        ],
        total: 139.97,
        status: "delivered",
        date: "2024-01-15"
    },
    {
        id: "ORD-002",
        userId: "user-1",
        products: [
            {
                productId: "3",
                quantity: 1,
                price: 29.99
            }
        ],
        total: 29.99,
        status: "shipped",
        date: "2024-01-20"
    }
];
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
const API_URL = 'http://localhost:5000/api';
const api = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});
api.interceptors.request.use((config)=>{
    const token = localStorage.getItem('auth_token');
    if (token) {
        const parsedToken = JSON.parse(token); // The current implementation stores the whole token object as string
        if (parsedToken.token) {
            config.headers.Authorization = `Bearer ${parsedToken.token}`;
        }
    }
    return config;
});
const __TURBOPACK__default__export__ = api;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/contexts/store-context.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StoreProvider",
    ()=>StoreProvider,
    "useStore",
    ()=>useStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dummy$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dummy-data.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
"use client";
;
;
;
const StoreContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const ADMIN_EMAIL = "admin@eshop.com";
const ADMIN_PASSWORD = "admin123";
function StoreProvider({ children }) {
    _s();
    const [cart, setCart] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [orders, setOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dummy$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["products"]);
    const [deliveryLogs, setDeliveryLogs] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [manufacturerOrders, setManufacturerOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StoreProvider.useEffect": ()=>{
            const storedAuth = localStorage.getItem("auth_token");
            if (storedAuth) {
                try {
                    const authData = JSON.parse(storedAuth);
                    if (authData.expiresAt > Date.now()) {
                        setUser(authData.user);
                    } else {
                        localStorage.removeItem("auth_token");
                    }
                } catch (error) {
                    localStorage.removeItem("auth_token");
                }
            }
            const storedCart = localStorage.getItem("cart");
            if (storedCart) {
                try {
                    setCart(JSON.parse(storedCart));
                } catch (error) {
                    console.error("Failed to load cart:", error);
                }
            }
            // Fetch products from backend
            const fetchProducts = {
                "StoreProvider.useEffect.fetchProducts": async ()=>{
                    try {
                        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/products');
                        setProducts(data);
                    } catch (error) {
                        if (error.response && error.response.status === 500) {
                            console.warn("Backend products API failed (500), falling back to local data.");
                        } else {
                            console.error("Failed to fetch products:", error);
                        }
                        // Fallback to dummy data if API fails to avoid broken UI during dev
                        setProducts(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dummy$2d$data$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["products"]);
                    }
                }
            }["StoreProvider.useEffect.fetchProducts"];
            fetchProducts();
        // Fetch orders if user is logged in
        // This will be handled in a separate effect dependent on 'user'
        }
    }["StoreProvider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StoreProvider.useEffect": ()=>{
            const fetchOrders = {
                "StoreProvider.useEffect.fetchOrders": async ()=>{
                    if (user) {
                        try {
                            const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/orders');
                            // Map backend order to frontend Order interface
                            const mappedOrders = data.map({
                                "StoreProvider.useEffect.fetchOrders.mappedOrders": (order)=>({
                                        id: order._id,
                                        userId: order.user?._id || "unknown",
                                        items: order.orderItems.map({
                                            "StoreProvider.useEffect.fetchOrders.mappedOrders": (item)=>({
                                                    productId: item.product,
                                                    productName: item.name,
                                                    quantity: item.quantity,
                                                    price: item.price,
                                                    selectedSize: item.size
                                                })
                                        }["StoreProvider.useEffect.fetchOrders.mappedOrders"]),
                                        total: order.totalPrice,
                                        deliveryDetails: {
                                            name: order.shippingAddress?.name || order.user?.name || "Unknown User",
                                            phone: order.shippingAddress?.phone || "Not provided",
                                            address: order.shippingAddress?.address || "",
                                            deliveryOption: "home",
                                            paymentMethod: order.paymentMethod
                                        },
                                        orderStatus: order.status === 'pending' ? 'Placed' : 'Processing',
                                        deliveryStatus: order.isDelivered ? 'Delivered' : 'In Process',
                                        createdAt: order.createdAt
                                    })
                            }["StoreProvider.useEffect.fetchOrders.mappedOrders"]);
                            setOrders(mappedOrders);
                        } catch (e) {
                            console.error("Failed to fetch orders", e);
                            if (e.response && e.response.status === 401) {
                                logout();
                            }
                        }
                    } else {
                        setOrders([]);
                    }
                }
            }["StoreProvider.useEffect.fetchOrders"];
            fetchOrders();
        }
    }["StoreProvider.useEffect"], [
        user
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StoreProvider.useEffect": ()=>{
            localStorage.setItem("cart", JSON.stringify(cart));
        }
    }["StoreProvider.useEffect"], [
        cart
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StoreProvider.useEffect": ()=>{
            if (orders.length > 0) {
                localStorage.setItem("orders", JSON.stringify(orders));
            }
        }
    }["StoreProvider.useEffect"], [
        orders
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StoreProvider.useEffect": ()=>{
            if (products.length > 0) {
                localStorage.setItem("products", JSON.stringify(products));
            }
        }
    }["StoreProvider.useEffect"], [
        products
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StoreProvider.useEffect": ()=>{
            if (deliveryLogs.length > 0) {
                localStorage.setItem("delivery_logs", JSON.stringify(deliveryLogs));
            }
        }
    }["StoreProvider.useEffect"], [
        deliveryLogs
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "StoreProvider.useEffect": ()=>{
            if (manufacturerOrders.length > 0) {
                localStorage.setItem("manufacturer_orders", JSON.stringify(manufacturerOrders));
            }
        }
    }["StoreProvider.useEffect"], [
        manufacturerOrders
    ]);
    const addToCart = (product, size)=>{
        setCart((prev)=>{
            const existing = prev.find((item)=>item.id === product.id && item.selectedSize === size);
            if (existing) {
                return prev.map((item)=>item.id === product.id && item.selectedSize === size ? {
                        ...item,
                        quantity: item.quantity + 1
                    } : item);
            }
            return [
                ...prev,
                {
                    ...product,
                    quantity: 1,
                    selectedSize: size
                }
            ];
        });
    };
    const removeFromCart = (productId, size)=>{
        setCart((prev)=>prev.filter((item)=>!(item.id === productId && item.selectedSize === size)));
    };
    const updateQuantity = (productId, quantity, size)=>{
        if (quantity <= 0) {
            removeFromCart(productId, size);
            return;
        }
        setCart((prev)=>prev.map((item)=>item.id === productId && item.selectedSize === size ? {
                    ...item,
                    quantity
                } : item));
    };
    const clearCart = ()=>{
        setCart([]);
        localStorage.removeItem("cart");
    };
    const getCartTotal = ()=>{
        return cart.reduce((sum, item)=>sum + item.price * item.quantity, 0);
    };
    const createOrder = async (deliveryDetails)=>{
        if (!user) {
            throw new Error("User must be logged in to create an order");
        }
        if (cart.length === 0) {
            throw new Error("Cart is empty");
        }
        const orderItems = cart.map((item)=>({
                name: item.name,
                quantity: item.quantity,
                image: item.image,
                price: item.price,
                product: item._id || item.id,
                size: item.selectedSize
            }));
        const total = getCartTotal();
        try {
            const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/orders', {
                orderItems,
                shippingAddress: {
                    name: deliveryDetails.name,
                    phone: deliveryDetails.phone,
                    address: deliveryDetails.address,
                    city: "Unknown",
                    postalCode: "00000",
                    country: "Unknown"
                },
                paymentMethod: deliveryDetails.paymentMethod,
                totalPrice: total
            });
            // Adapt backend response to Order interface if needed
            // Backend returns _id, frontend uses id
            // Map it:
            const newOrder = {
                id: data._id,
                userId: user.id,
                items: data.orderItems.map((i)=>({
                        productId: i.product,
                        productName: i.name,
                        quantity: i.quantity,
                        price: i.price,
                        selectedSize: i.size
                    })),
                total: data.totalPrice,
                deliveryDetails,
                orderStatus: "Placed",
                deliveryStatus: "In Process",
                createdAt: data.createdAt
            };
            setOrders((prev)=>[
                    newOrder,
                    ...prev
                ]);
            clearCart();
            return newOrder;
        } catch (error) {
            console.error("Create order failed", error);
            throw error;
        }
    };
    const getAllOrders = ()=>{
        return orders;
    };
    const addProduct = (product)=>{
        const newProduct = {
            ...product,
            id: `prod-${Date.now()}`
        };
        setProducts((prev)=>[
                ...prev,
                newProduct
            ]);
    };
    const updateProduct = (id, updates)=>{
        setProducts((prev)=>prev.map((product)=>product.id === id ? {
                    ...product,
                    ...updates
                } : product));
    };
    const deleteProduct = (id)=>{
        setProducts((prev)=>prev.map((product)=>product.id === id ? {
                    ...product,
                    stock: 0
                } : product));
    };
    const updateStock = (productId, newStock)=>{
        setProducts((prev)=>prev.map((product)=>product.id === productId ? {
                    ...product,
                    stock: newStock
                } : product));
    };
    const updateOrderDeliveryStatus = (orderId, status, deliveryAgent)=>{
        setOrders((prev)=>{
            const updatedOrders = prev.map((order)=>{
                if (order.id === orderId) {
                    const previousStatus = order.deliveryStatus;
                    const newOrder = {
                        ...order,
                        deliveryStatus: status
                    };
                    if (status === "Delivered" && previousStatus !== "Delivered") {
                        setProducts((prevProducts)=>prevProducts.map((product)=>{
                                const orderItem = order.items.find((item)=>item.productId === product.id);
                                if (orderItem) {
                                    return {
                                        ...product,
                                        stock: Math.max(0, product.stock - orderItem.quantity)
                                    };
                                }
                                return product;
                            }));
                        const newLogs = order.items.map((item)=>({
                                id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                                orderId: order.id,
                                productName: item.productName,
                                quantity: item.quantity,
                                price: item.price,
                                deliveryAgent: deliveryAgent || "Not specified",
                                deliveredAt: new Date().toISOString()
                            }));
                        setDeliveryLogs((prevLogs)=>[
                                ...newLogs,
                                ...prevLogs
                            ]);
                        newOrder.orderStatus = "Delivered";
                    }
                    if (status === "Rejected") {
                        newOrder.orderStatus = "Cancelled";
                    } else if (status === "Not Received") {
                        newOrder.orderStatus = "Cancelled";
                    }
                    return newOrder;
                }
                return order;
            });
            return updatedOrders;
        });
    };
    const login = async (email, password)=>{
        try {
            const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/login', {
                email,
                password
            });
            const newUser = {
                id: data._id,
                email: data.email,
                name: data.name,
                role: data.role
            };
            const authToken = {
                token: data.token,
                user: newUser,
                expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
            };
            localStorage.setItem("auth_token", JSON.stringify(authToken));
            setUser(newUser);
            return true;
        } catch (error) {
            console.error("Login failed", error);
            throw error // Throw error to be handled by the component
            ;
        }
    };
    const register = async (name, email, password)=>{
        try {
            const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/register', {
                name,
                email: email.trim().toLowerCase(),
                password: password.trim()
            });
            const newUser = {
                id: data._id,
                email: data.email,
                name: data.name,
                role: data.role
            };
            const authToken = {
                token: data.token,
                user: newUser,
                expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000
            };
            localStorage.setItem("auth_token", JSON.stringify(authToken));
            setUser(newUser);
            return true;
        } catch (error) {
            console.error("Registration failed", error);
            throw error;
        }
    };
    const logout = ()=>{
        localStorage.removeItem("auth_token");
        setUser(null);
    };
    const isAdmin = user?.role === "admin";
    const createManufacturerOrder = (order)=>{
        const newOrder = {
            ...order,
            id: `MFG-${Date.now()}`
        };
        setManufacturerOrders((prev)=>[
                newOrder,
                ...prev
            ]);
    };
    const updateManufacturerOrder = (id, updates)=>{
        setManufacturerOrders((prev)=>prev.map((order)=>{
                if (order.id === id) {
                    const updatedOrder = {
                        ...order,
                        ...updates
                    };
                    if (updates.status === "Received" && order.status !== "Received") {
                        setProducts((prevProducts)=>prevProducts.map((product)=>{
                                if (product.id === order.productId) {
                                    return {
                                        ...product,
                                        stock: product.stock + (updatedOrder.quantityReceived || updatedOrder.quantity)
                                    };
                                }
                                return product;
                            }));
                    }
                    return updatedOrder;
                }
                return order;
            }));
    };
    const deleteManufacturerOrder = (id)=>{
        setManufacturerOrders((prev)=>prev.filter((order)=>order.id !== id));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StoreContext.Provider, {
        value: {
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
            deleteManufacturerOrder
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/contexts/store-context.tsx",
        lineNumber: 511,
        columnNumber: 5
    }, this);
}
_s(StoreProvider, "ou9lLwGKA3MQsHXIi+9By87wRdM=");
_c = StoreProvider;
function useStore() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(StoreContext);
    if (context === undefined) {
        throw new Error("useStore must be used within a StoreProvider");
    }
    return context;
}
_s1(useStore, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "StoreProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/lib/utils.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-client] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/ui/button.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Button",
    ()=>Button,
    "buttonVariants",
    ()=>buttonVariants
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-slot/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
;
;
;
;
const buttonVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cva"])("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive", {
    variants: {
        variant: {
            default: 'bg-primary text-primary-foreground hover:bg-primary/90',
            destructive: 'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
            outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
            secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
            link: 'text-primary underline-offset-4 hover:underline'
        },
        size: {
            default: 'h-9 px-4 py-2 has-[>svg]:px-3',
            sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
            lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
            icon: 'size-9',
            'icon-sm': 'size-8',
            'icon-lg': 'size-10'
        }
    },
    defaultVariants: {
        variant: 'default',
        size: 'default'
    }
});
function Button({ className, variant, size, asChild = false, ...props }) {
    const Comp = asChild ? __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$slot$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Slot"] : 'button';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Comp, {
        "data-slot": "button",
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])(buttonVariants({
            variant,
            size,
            className
        })),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/button.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_c = Button;
;
var _c;
__turbopack_context__.k.register(_c, "Button");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/navbar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Navbar",
    ()=>Navbar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$store$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/contexts/store-context.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-cart.js [app-client] (ecmascript) <export default as ShoppingCart>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/user.js [app-client] (ecmascript) <export default as User>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-client] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.js [app-client] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.js [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.js [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function Navbar() {
    _s();
    const { cart, user, logout, isAdmin } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$store$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"])();
    const [isDark, setIsDark] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Navbar.useEffect": ()=>{
            const darkMode = localStorage.getItem("darkMode") === "true";
            setIsDark(darkMode);
            if (darkMode) {
                document.documentElement.classList.add("dark");
            }
        }
    }["Navbar.useEffect"], []);
    const toggleDarkMode = ()=>{
        const newDarkMode = !isDark;
        setIsDark(newDarkMode);
        localStorage.setItem("darkMode", String(newDarkMode));
        if (newDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };
    const cartItemCount = cart.reduce((sum, item)=>sum + item.quantity, 0);
    const handleLogout = ()=>{
        logout();
        window.location.href = "/";
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        className: "border-b bg-background",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container mx-auto px-4 py-4",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/",
                        className: "flex items-center gap-3 hover:opacity-80 transition-opacity",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                src: "/logo.png",
                                alt: "IEM Logo",
                                width: 48,
                                height: 48,
                                className: "object-contain"
                            }, void 0, false, {
                                fileName: "[project]/components/navbar.tsx",
                                lineNumber: 45,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-2xl font-bold",
                                children: "IEM BrandStore"
                            }, void 0, false, {
                                fileName: "[project]/components/navbar.tsx",
                                lineNumber: 46,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/navbar.tsx",
                        lineNumber: 44,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/",
                                className: "hover:text-primary",
                                children: "Home"
                            }, void 0, false, {
                                fileName: "[project]/components/navbar.tsx",
                                lineNumber: 50,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/categories",
                                className: "hover:text-primary",
                                children: "Categories"
                            }, void 0, false, {
                                fileName: "[project]/components/navbar.tsx",
                                lineNumber: 53,
                                columnNumber: 13
                            }, this),
                            isAdmin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/admin",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    size: "sm",
                                    className: "gap-2 bg-transparent",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/navbar.tsx",
                                            lineNumber: 59,
                                            columnNumber: 19
                                        }, this),
                                        "Admin Panel"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/navbar.tsx",
                                    lineNumber: 58,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/navbar.tsx",
                                lineNumber: 57,
                                columnNumber: 15
                            }, this),
                            user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/orders",
                                className: "hover:text-primary",
                                children: "My Orders"
                            }, void 0, false, {
                                fileName: "[project]/components/navbar.tsx",
                                lineNumber: 65,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/navbar.tsx",
                        lineNumber: 49,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "outline",
                                size: "icon",
                                onClick: toggleDarkMode,
                                className: "bg-transparent",
                                "aria-label": "Toggle dark mode",
                                children: isDark ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/components/navbar.tsx",
                                    lineNumber: 79,
                                    columnNumber: 25
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                                    className: "h-5 w-5"
                                }, void 0, false, {
                                    fileName: "[project]/components/navbar.tsx",
                                    lineNumber: 79,
                                    columnNumber: 55
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/navbar.tsx",
                                lineNumber: 72,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/cart",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    size: "icon",
                                    className: "relative bg-transparent",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$cart$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingCart$3e$__["ShoppingCart"], {
                                            className: "h-5 w-5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/navbar.tsx",
                                            lineNumber: 84,
                                            columnNumber: 17
                                        }, this),
                                        cartItemCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground",
                                            children: cartItemCount
                                        }, void 0, false, {
                                            fileName: "[project]/components/navbar.tsx",
                                            lineNumber: 86,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/navbar.tsx",
                                    lineNumber: 83,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/navbar.tsx",
                                lineNumber: 82,
                                columnNumber: 13
                            }, this),
                            user ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm",
                                        children: [
                                            user.name,
                                            isAdmin && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "ml-1 text-xs text-muted-foreground",
                                                children: "(Admin)"
                                            }, void 0, false, {
                                                fileName: "[project]/components/navbar.tsx",
                                                lineNumber: 97,
                                                columnNumber: 31
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/navbar.tsx",
                                        lineNumber: 95,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "icon",
                                        onClick: handleLogout,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                            className: "h-5 w-5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/navbar.tsx",
                                            lineNumber: 100,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/navbar.tsx",
                                        lineNumber: 99,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/navbar.tsx",
                                lineNumber: 94,
                                columnNumber: 15
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/login",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    size: "icon",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$user$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__User$3e$__["User"], {
                                        className: "h-5 w-5"
                                    }, void 0, false, {
                                        fileName: "[project]/components/navbar.tsx",
                                        lineNumber: 106,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/navbar.tsx",
                                    lineNumber: 105,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/navbar.tsx",
                                lineNumber: 104,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/navbar.tsx",
                        lineNumber: 71,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/navbar.tsx",
                lineNumber: 43,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/navbar.tsx",
            lineNumber: 42,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/navbar.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
_s(Navbar, "GCvCQTbFNdzHH3M44+kt5nf3qIk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$contexts$2f$store$2d$context$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useStore"]
    ];
});
_c = Navbar;
var _c;
__turbopack_context__.k.register(_c, "Navbar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_743d4bb6._.js.map