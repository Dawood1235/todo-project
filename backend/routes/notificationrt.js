const express = require('express');

const router = express.Router();

const {
    getNotifications,markNotificationAsRead
} = require("../controller/notificationcont");

const {authmiddleware} = require("../middleware/auth");

router.get("/",authmiddleware,getNotifications);
// router.patch("/notpat",authmiddleware,markNotificationAsRead);

router.patch(
    "/notpat",authmiddleware,markNotificationAsRead
);

module.exports = router;