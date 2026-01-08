const mongoose = require('mongoose');

const requisitionItemSchema = mongoose.Schema({
    requisitionId: { type: String, required: true, ref: 'Requisition' },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String },
    quantityAllocated: { type: Number, required: true, default: 0 },
    quantitySold: { type: Number, default: 0 },
    quantityReturned: { type: Number, default: 0 }
});

// Virtual to populate requisition based on custom ID if needed
requisitionItemSchema.virtual('requisition', {
    ref: 'Requisition',
    localField: 'requisitionId',
    foreignField: 'requisitionId',
    justOne: true
});

module.exports = mongoose.model('RequisitionItem', requisitionItemSchema);
