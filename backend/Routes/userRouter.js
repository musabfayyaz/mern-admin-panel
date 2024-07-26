const express = require('express');
const router = express.Router();
const { 
    fetchVendors, 
    addAdmin, 
    addVendor, 
    assignClient, 
    removeVendor, 
    deleteClient,
    getVendorProfile,
    updateClientStatus,
    updateClientNote
} = require("../Controllers/userController");
const authMiddleware = require('../Middlewares/authMiddleware');

router.get("/vendors", fetchVendors);
router.post("/client", assignClient);
router.post("/admin", addAdmin);
router.post("/vendor", addVendor);
router.delete("/vendor/:id", removeVendor);
router.delete("/client/:id", deleteClient);

// Vendor routes
router.get('/vendor/profile', authMiddleware, getVendorProfile);
router.put('/vendor/client/:clientId/status', authMiddleware, updateClientStatus);
router.put('/vendor/client/:clientId/note', authMiddleware, updateClientNote);

module.exports = router;