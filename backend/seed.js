const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const connectDB = require('./config/db');

dotenv.config();


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
        category: "Stationary",
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
];

const importData = async () => {
    try {
        await connectDB();
        await Order.deleteMany();
        await Product.deleteMany();
        await User.deleteMany();

        // Drop stale slug index if it exists
        try {
            await Product.collection.dropIndex('slug_1');
            console.log('Stale slug index dropped');
        } catch (err) {
            // Index might not exist, which is fine
        }

        const createdUsers = await User.create([
            {
                name: 'Admin User',
                email: 'admin@eshop.com',
                password: 'admin123',
                role: 'admin'
            },
            {
                name: 'John Doe',
                email: 'user@example.com',
                password: 'password123',
                role: 'user'
            }
        ]);

        const adminUser = createdUsers[0]._id;
        const sampleProducts = products.map(product => {
            return { ...product, user: adminUser };
        });

        await Product.insertMany(sampleProducts);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
