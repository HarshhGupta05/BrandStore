const express = require('express');
const router = express.Router();
const Requisition = require('../models/Requisition');
const RequisitionItem = require('../models/RequisitionItem');
const Product = require('../models/Product');
const { protect, admin } = require('../middleware/authMiddleware');

// Helper to generate IDs
const generateRequisitionId = () => `REQ-${Date.now()}`;

// @desc    Create new requisition (Draft)
// @route   POST /api/requisitions
router.post('/', protect, admin, async (req, res) => {
    try {
        const { eventDetails, remarks, items, requestedBy } = req.body;
        // items: [{ productId, quantityAllocated, ... }]

        const requisitionId = generateRequisitionId();

        const requisition = new Requisition({
            requisitionId,
            eventDetails,
            requestedBy: requestedBy || req.user.name,
            remarks,
            status: 'draft',
            totalQuantityAllocated: items ? items.reduce((acc, item) => acc + (Number(item.quantityAllocated) || 0), 0) : 0
        });

        const createdRequisition = await requisition.save();

        if (items && items.length > 0) {
            const requisitionItems = items.map(item => ({
                requisitionId,
                productId: item.productId, // Expecting ObjectId
                productName: item.productName,
                quantityAllocated: item.quantityAllocated,
                quantitySold: 0,
                quantityReturned: 0
            }));
            await RequisitionItem.insertMany(requisitionItems);
        }

        res.status(201).json(createdRequisition);
    } catch (error) {
        console.error('Error creating requisition:', error);
        res.status(400).json({ message: 'Error creating requisition', error: error.message });
    }
});

// @desc    Get all requisitions
// @route   GET /api/requisitions
router.get('/', protect, admin, async (req, res) => {
    try {
        const requisitions = await Requisition.find({})
            // .populate('requestedBy', 'name email')
            .sort('-createdAt');
        res.json(requisitions);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Get single requisition with items
// @route   GET /api/requisitions/:id
router.get('/:id', protect, admin, async (req, res) => {
    try {
        const requisition = await Requisition.findOne({ requisitionId: req.params.id });
        // .populate('requestedBy', 'name email');

        if (!requisition) {
            return res.status(404).json({ message: 'Requisition not found' });
        }

        const items = await RequisitionItem.find({ requisitionId: req.params.id })
            .populate('productId', 'name stock price image id');

        res.json({ requisition, items });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Allocate Stock (Draft -> Allocated)
// @route   PUT /api/requisitions/:id/allocate
router.put('/:id/allocate', protect, admin, async (req, res) => {
    try {
        const requisition = await Requisition.findOne({ requisitionId: req.params.id });
        if (!requisition) return res.status(404).json({ message: 'Requisition not found' });

        if (requisition.status !== 'draft') {
            return res.status(400).json({ message: 'Only drafts can be allocated' });
        }

        const items = await RequisitionItem.find({ requisitionId: requisition.requisitionId });

        // Validate Stock
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) return res.status(400).json({ message: `Product not found: ${item.productId}` });

            if (product.stock < item.quantityAllocated) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantityAllocated}` });
            }
        }

        requisition.status = 'allocated';
        await requisition.save();

        res.json({ message: 'Stock allocated successfully', requisition });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc    Update Item Counts (Sold/Returned) and Deduct Stock
// @route   PUT /api/requisitions/:id/update-counts
router.put('/:id/update-counts', protect, admin, async (req, res) => {
    const { updates } = req.body; // Array of { _id, quantitySold, quantityReturned }

    try {
        const requisition = await Requisition.findOne({ requisitionId: req.params.id });
        if (!requisition) return res.status(404).json({ message: 'Requisition not found' });

        if (requisition.status === 'closed' || requisition.status === 'cancelled') {
            return res.status(400).json({ message: 'Cannot update closed/cancelled requisition' });
        }

        let totalSold = 0;

        for (const update of updates) {
            const item = await RequisitionItem.findById(update._id);
            if (!item) continue;

            const newSold = Number(update.quantitySold) || 0;
            const newReturned = Number(update.quantityReturned) || 0;

            if (newSold + newReturned > item.quantityAllocated) {
                return res.status(400).json({ message: `Invalid counts for ${item.productName}: Sold (${newSold}) + Returned (${newReturned}) exceeds Allocated (${item.quantityAllocated})` });
            }

            // Calculate stock deduction delta
            const soldDelta = newSold - item.quantitySold;

            // Update Product Stock
            if (soldDelta !== 0) {
                const product = await Product.findById(item.productId);
                if (product) {
                    product.stock -= soldDelta; // If sold more, stock decreases.
                    await product.save();
                }
            }

            item.quantitySold = newSold;
            item.quantityReturned = newReturned;
            await item.save();
        }

        // Recalculate total sold
        const allItems = await RequisitionItem.find({ requisitionId: requisition.requisitionId });
        requisition.totalQuantitySold = allItems.reduce((acc, i) => acc + i.quantitySold, 0);

        if (requisition.status === 'allocated' && requisition.totalQuantitySold > 0) {
            requisition.status = 'partially_sold';
        }

        await requisition.save();

        res.json({ message: 'Counts updated', requisition });
    } catch (error) {
        console.error("Error updating counts:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
});

// @desc   Close Requisition
// @route  PUT /api/requisitions/:id/close
router.put('/:id/close', protect, admin, async (req, res) => {
    try {
        const requisition = await Requisition.findOne({ requisitionId: req.params.id });
        if (!requisition) return res.status(404).json({ message: 'Requisition not found' });

        requisition.status = 'closed';
        await requisition.save();
        res.json({ message: 'Requisition closed', requisition });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
