const express = require("express");
const router = express.Router();
const {
  isSignedIn,
  isAdmin,
  isAuthenticated
} = require("./../controller/auth");
const {
  getUserById,
  pushOrderInPurchaseList
} = require("./../controller/user");
const { updateStock } = require("./../controller/product");
const {
  getOrderById,
  createOrder,
  getAllOrders,
  getOrderStatus,
  updateStatus
} = require("./../controller/order");

router.param("userId", getUserById);
router.param("orderId", getOrderById);
router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticated,
  pushOrderInPurchaseList,
  updateStock,
  createOrder
);

router.get(
  "/order/all/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllOrders
);

router.get(
  "/order/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getOrderStatus
);
router.put(
  "/order/:orderId/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateStatus
);

module.exports = router;
