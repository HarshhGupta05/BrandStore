const mongoose = require('mongoose');

const reportSchema = mongoose.Schema({
    title: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalRevenue: { type: Number, required: true },
    totalExpenses: { type: Number, required: true, default: 0 },
    netProfit: { type: Number, required: true, default: 0 },
    totalOrders: { type: Number, required: true },
    avgOrderValue: { type: Number, required: true },
    successRate: { type: Number, required: true },
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    notes: { type: String }
}, {
    timestamps: true
});

const Report = mongoose.model('Report', reportSchema);
module.exports = Report;
