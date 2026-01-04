const express = require('express');
const {
  getPyqs,
  getPyqById,
  createPyq,
  updatePyq,
  deletePyq,
  getAdminPyqs,
  submitTest
} = require('../controllers/pyqController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getPyqs);
router.get('/:id', getPyqById);
router.post('/:id/submit', submitTest); // For submitting test answers

// Admin routes
router.get('/admin/list', protect, admin, getAdminPyqs);
router.post('/admin', protect, admin, createPyq);
router.put('/admin/:id', protect, admin, updatePyq);
router.delete('/admin/:id', protect, admin, deletePyq);

module.exports = router;