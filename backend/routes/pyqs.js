const express = require('express');
const {
  getPyqs,
  getPyqById,
  createPyq,
  updatePyq,
  deletePyq,
  getAdminPyqs,
} = require('../controllers/pyqController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

router.get('/', getPyqs);
router.get('/admin', protect, admin, getAdminPyqs);
router.get('/:id', getPyqById);
router.post('/', protect, admin, upload.single('file'), createPyq);
router.put('/:id', protect, admin, upload.single('file'), updatePyq);
router.delete('/:id', protect, admin, deletePyq);

module.exports = router;