const mongoose = require('mongoose');

const requisitionSchema = mongoose.Schema({
    requisitionId: { type: String, unique: true, required: true },
    eventDetails: { type: String, required: true },
    requestedBy: { type: String, required: true }, // Changed from ObjectId to String
    status: {
        type: String,
        enum: ['draft', 'allocated', 'partially_sold', 'closed', 'cancelled'],
        default: 'draft'
    },
    totalQuantityAllocated: { type: Number, default: 0 },
    totalQuantitySold: { type: Number, default: 0 },
    remarks: { type: String }
}, {
    timestamps: true
});

module.exports = mongoose.model('Requisition', requisitionSchema);
