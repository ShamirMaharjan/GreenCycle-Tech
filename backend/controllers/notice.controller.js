// controllers/notice.controller.js
const Notice = require('../models/notice');

// Add new notice
exports.addNotice = async (req, res) => {
    try {
        const { title, description, category } = req.body;

        const newNotice = new Notice({
            title,
            description,
            category
        });

        await newNotice.save();

        res.status(201).json({
            success: true,
            message: 'Notice added successfully',
            data: newNotice
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error adding notice',
            error: err.message
        });
    }
};

// Get all notices
exports.getNotices = async (req, res) => {
    try {
        const { category } = req.query;
        let query = {};
        
        if (category && ['all', 'User', 'garbageCollector'].includes(category)) {
            query.category = category === 'all' ? { $in: ['client', 'garbageCollector'] } : category;
        }

        const notices = await Notice.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: notices
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching notices',
            error: err.message
        });
    }
};