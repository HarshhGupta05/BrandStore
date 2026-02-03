const mongoose = require('mongoose');

const vendorInvoiceSchema = new mongoose.Schema({
    invoiceId: {
        type: String,
        required: true,
        unique: true
    },
    manufacturerOrderId: {
        type: String,
        required: true,
        ref: 'ManufacturerOrder'
    },
    vendorName: {
        type: String,
        required: true
    },
    items: [{
        productId: { type: String, ref: 'Product' },
        productName: String,
        quantity: Number,
        costPerUnit: Number,
        total: Number
    }],
    subTotal: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    cgst: {
        type: Number,
        default: 0
    },
    sgst: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    invoiceDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('VendorInvoice', vendorInvoiceSchema);
