const express = require('express');
const router = express.Router();
const ManufacturerOrder = require('../models/ManufacturerOrder');
const Product = require('../models/Product');

// @desc    Create a manufacturer order
// @route   POST /api/manufacturer-orders
// @access  Private/Admin
router.post('/', async (req, res) => {
    try {
        const { items, orderDate, expectedArrival, status, vendorId } = req.body;

        // Calculate total cost
        const totalCost = items.reduce((sum, item) => sum + (item.quantity * item.cost), 0);

        const orderId = `MFG-${Date.now()}`;

        const order = new ManufacturerOrder({
            orderId,
            vendor: vendorId,
            items,
            orderDate,
            expectedArrival,
            status: status || 'Ordered',
            totalCost
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        console.error("Error creating manufacturer order:", error);
        res.status(400).json({ message: 'Invalid order data', error: error.message });
    }
});

// @desc    Get all manufacturer orders
// @route   GET /api/manufacturer-orders
// @access  Private/Admin
router.get('/', async (req, res) => {
    try {
        const orders = await ManufacturerOrder.find({}).populate('vendor').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

const VendorInvoice = require('../models/VendorInvoice');

// @desc    Receive items and update stock
// @route   PUT /api/manufacturer-orders/:id/receive
// @access  Private/Admin
router.put('/:id/receive', async (req, res) => {
    try {
        const { receivedItems, discount, cgst, sgst } = req.body; // Array of { productId, receivedQuantity, receivedDate }
        const order = await ManufacturerOrder.findOne({ orderId: req.params.id });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.status === 'Cancelled') {
            return res.status(400).json({ message: 'Cannot receive items for a cancelled order' });
        }

        const invoiceItems = [];
        let invoiceSubTotal = 0;
        const receivingBatchDate = receivedItems.length > 0 && receivedItems[0].receivedDate
            ? new Date(receivedItems[0].receivedDate)
            : new Date();

        for (const receivedItem of receivedItems) {
            const orderItem = order.items.find(item => item.productId === receivedItem.productId);

            if (orderItem) {
                const quantityToReceive = Number(receivedItem.receivedQuantity);
                const receivedDate = receivedItem.receivedDate ? new Date(receivedItem.receivedDate) : new Date();

                if (quantityToReceive > 0) {
                    // Update Order Item Local Stats
                    orderItem.quantityReceived = (orderItem.quantityReceived || 0) + quantityToReceive;

                    if (!orderItem.deliveries) orderItem.deliveries = [];
                    orderItem.deliveries.push({
                        receivedQuantity: quantityToReceive,
                        receivedDate: receivedDate,
                        receivedBy: 'admin'
                    });

                    // Update Global Receiving History
                    if (!order.receivingHistory) order.receivingHistory = [];
                    order.receivingHistory.push({
                        productId: orderItem.productId,
                        quantityReceived: quantityToReceive,
                        receivedDate: receivedDate,
                        costPerUnit: orderItem.cost
                    });

                    // Prepare Invoice Item
                    const lineTotal = quantityToReceive * orderItem.cost;
                    invoiceItems.push({
                        productId: receivedItem.productId,
                        productName: orderItem.productName,
                        quantity: quantityToReceive,
                        costPerUnit: orderItem.cost,
                        total: lineTotal
                    });
                    invoiceSubTotal += lineTotal;

                    // Update Product Stock
                    let product = await Product.findOne({ id: receivedItem.productId });
                    if (!product) {
                        try {
                            product = await Product.findById(receivedItem.productId);
                        } catch (e) { }
                    }

                    if (product) {
                        product.stock += quantityToReceive;
                        await product.save();
                    }
                }
            }
        }

        // Generate Vendor Invoice if items were received
        if (invoiceItems.length > 0) {
            const invoiceId = `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

            const orderWithVendor = await ManufacturerOrder.findOne({ orderId: order.orderId }).populate('vendor');
            const vendorName = orderWithVendor?.vendor?.name || "Unknown Vendor";

            const taxRateC = Number(cgst) || 0;
            const taxRateS = Number(sgst) || 0;
            const disc = Number(discount) || 0;

            const totalPayable = invoiceSubTotal - disc + (invoiceSubTotal * taxRateC / 100) + (invoiceSubTotal * taxRateS / 100);

            const newInvoice = new VendorInvoice({
                invoiceId,
                manufacturerOrderId: order.orderId,
                vendorName: vendorName,
                items: invoiceItems,
                subTotal: invoiceSubTotal,
                discount: disc,
                cgst: taxRateC,
                sgst: taxRateS,
                totalAmount: totalPayable,
                invoiceDate: receivingBatchDate,
                status: 'Pending'
            });
            await newInvoice.save();
        }

        // Recalculate status
        const allReceived = order.items.every(item => item.quantityReceived >= item.quantity);
        const someReceived = order.items.some(item => item.quantityReceived > 0);

        if (allReceived) {
            order.status = 'Received';
        } else if (someReceived) {
            order.status = 'Partially Received';
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);

    } catch (error) {
        console.error("Error receiving items:", error);
        res.status(400).json({ message: 'Error receiving items', error: error.message });
    }
});

// @desc    Update order status (e.g. Cancel)
// @route   PUT /api/manufacturer-orders/:id/status
// @access  Private/Admin
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const order = await ManufacturerOrder.findOne({ orderId: req.params.id });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } catch (error) {
        res.status(400).json({ message: 'Error updating status' });
    }
});

module.exports = router;
