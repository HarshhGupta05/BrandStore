const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    images: [{ type: String }],
    stock: { type: Number, required: true },
    manufacturer: { type: String, required: true },
    sizes: [{ type: String }],
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
