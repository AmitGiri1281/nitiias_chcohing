const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');

// Get user notifications
router.get('/', async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Mark as read
router.put('/:id', async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ success: true });
});

module.exports = router;