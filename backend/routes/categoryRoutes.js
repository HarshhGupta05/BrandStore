const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const Product = require('../models/Product');

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find({});
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;

        const categoryExists = await Category.findOne({ name });
        if (categoryExists) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = new Category({
            id: `cat-${Date.now()}`,
            name,
            description
        });

        const createdCategory = await category.save();
        res.status(201).json(createdCategory);
    } catch (error) {
        res.status(400).json({ message: 'Invalid category data' });
    }
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
router.put('/:id', async (req, res) => {
    try {
        const { name, description } = req.body;
        // Search by 'id' string field first (not _id)
        let category = await Category.findOne({ id: req.params.id }) || await Category.findById(req.params.id).catch(e => null);

        if (category) {
            category.name = name || category.name;
            category.description = description || category.description;

            const updatedCategory = await category.save();
            res.json(updatedCategory);
        } else {
            res.status(404).json({ message: 'Category not found' });
        }
    } catch (error) {
        res.status(400).json({ message: 'Invalid category data' });
    }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
    try {
        let category = await Category.findOne({ id: req.params.id }) || await Category.findById(req.params.id).catch(e => null);

        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Check if products use this category
        const productsUsingCategory = await Product.countDocuments({ category: category.name });
        if (productsUsingCategory > 0) {
            return res.status(400).json({
                message: `Cannot delete category. It is used by ${productsUsingCategory} products. Please reassign them first.`
            });
        }

        await category.deleteOne();
        res.json({ message: 'Category removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Seed dummy categories if empty
router.post('/seed', async (req, res) => {
    try {
        const count = await Category.countDocuments({});
        if (count === 0) {
            const dummyCategories = [
                { id: "cat-1", name: "Clothing", description: "Apparel and fashion items" },
                { id: "cat-2", name: "Stationary", description: "Office supplies and writing tools" },
                { id: "cat-3", name: "Accessories", description: "Supplementary items and add-ons" }
            ];
            await Category.insertMany(dummyCategories);
            res.json({ message: 'Seeded categories' });
        } else {
            res.json({ message: 'Categories already exist' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
})

module.exports = router;
