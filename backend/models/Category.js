const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, unique: true },
    description: { type: String },
}, {
    timestamps: true,
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
