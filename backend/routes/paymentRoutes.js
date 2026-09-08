const express = require("express");
const crypto = require("crypto");
const Razorpay = require("razorpay");

const { protect } = require("../middleware/authMiddleware");

const Order = require("../models/Order");
const Product = require("../models/Product");

const router = express.Router();


// RAZORPAY INSTANCE
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// ==========================================
// CREATE RAZORPAY ORDER
// ==========================================
router.post("/create-order", protect, async (req, res) => {
  try {
    const { items, deliveryAddress } = req.body;

    // Check cart
    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    let totalAmount = 0;
    const orderItems = [];

    // Calculate total from database prices
    for (const item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.productId}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `${product.name} is out of stock`,
        });
      }

      totalAmount += product.price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: product.price,
      });
    }

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100),
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    // Save order in MongoDB
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalAmount,

      razorpayOrderId: razorpayOrder.id,

      paymentStatus: "Pending",
      orderStatus: "Order Placed",

      deliveryAddress,

      trackingHistory: [
        {
          status: "Order Placed",
          message: "Order created and waiting for payment",
        },
      ],
    });

    res.json({
      success: true,

      orderId: order._id,

      razorpayOrderId: razorpayOrder.id,

      amount: razorpayOrder.amount,

      currency: razorpayOrder.currency,

      key: process.env.RAZORPAY_KEY_ID,
    });

  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});


// ==========================================
// VERIFY RAZORPAY PAYMENT
// ==========================================
router.post("/verify", protect, async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // Find order
    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    // Generate signature
    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    // Verify signature
    if (generatedSignature !== razorpay_signature) {
      order.paymentStatus = "Failed";

      await order.save();

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // Payment successful
    order.paymentStatus = "Paid";

    order.razorpayPaymentId = razorpay_payment_id;

    order.razorpaySignature = razorpay_signature;

    order.orderStatus = "Confirmed";

    order.trackingHistory.push({
      status: "Confirmed",
      message: "Payment verified successfully and order confirmed",
    });

    await order.save();

    res.json({
      success: true,
      message: "Payment verified successfully",
      order,
    });

  } catch (error) {
    console.error("Payment verification error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});


// ==========================================
// CANCEL PAYMENT
// ==========================================
router.post("/cancel", protect, async (req, res) => {
  try {
    const { razorpayOrderId } = req.body;

    const order = await Order.findOne({
      razorpayOrderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.paymentStatus = "Cancelled";

    await order.save();

    res.json({
      success: true,
      message: "Payment cancelled",
    });

  } catch (error) {
    console.error("Cancel payment error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
});


// ==========================================
// EXPORT ROUTER
// ==========================================
module.exports = router;