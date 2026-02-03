const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const { protect, admin } = require('../middleware/authMiddleware');

// @desc    Create a new report
// @route   POST /api/reports
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const { title, startDate, endDate, totalRevenue, totalExpenses, netProfit, totalOrders, avgOrderValue, successRate, notes } = req.body;

        const report = new Report({
            title,
            startDate,
            endDate,
            totalRevenue,
            totalExpenses,
            netProfit,
            totalOrders,
            avgOrderValue,
            successRate,
            generatedBy: req.user._id,
            notes
        });

        const createdReport = await report.save();
        res.status(201).json(createdReport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all reports
// @route   GET /api/reports
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const reports = await Report.find({}).populate('generatedBy', 'name email').sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a report
// @route   DELETE /api/reports/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (report) {
            await report.deleteOne();
            res.json({ message: 'Report removed' });
        } else {
            res.status(404).json({ message: 'Report not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
