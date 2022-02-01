const express = require('express')
const {
  saveNotification,
  deleteNotification,
  getAllNotifications
} = require('../Controllers/notificationController')

const { protect } = require('../Middleware/authMiddleware')

const router = express.Router()

router
  .route('/')
  .post(protect, saveNotification)
  .get(protect, getAllNotifications)
router.route('/remove/:notificationId').delete(protect, deleteNotification)

module.exports = router
