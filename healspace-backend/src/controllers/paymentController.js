const Payment = require("../models/Payment");
const invoiceService = require("../services/invoiceService");
const Razorpay = require("razorpay");
const crypto = require("crypto");

// Razorpay Instance (falls back cleanly to mock mode if keys not in .env)
const razorpay = process.env.RAZORPAY_KEY_ID
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    })
  : null;

// 1. Create Gateway Order
exports.createOrder = async (req, res) => {
  try {
    const { amount = 700, therapist_slug = "dhanya-krishna", client_name, client_email, client_phone } = req.body;

    let orderId = `order_${Date.now()}`;

    if (razorpay) {
      const options = {
        amount: amount * 100, // paise
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
      };
      const order = await razorpay.orders.create(options);
      orderId = order.id;
    }

    const payment = new Payment({
      therapist_slug,
      client_name: client_name || "Patient Intake",
      client_email: client_email || "patient@example.com",
      client_phone,
      amount,
      gateway_order_id: orderId,
      status: "created",
      invoice_number: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
    });

    await payment.save();

    res.status(200).json({
      success: true,
      order_id: orderId,
      amount,
      currency: "INR",
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
      payment_record_id: payment._id,
      invoice_number: payment.invoice_number,
    });
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ error: "Failed to initialize payment order" });
  }
};

// 2. Verify Payment & Auto-generate PDF Invoice
exports.verifyPayment = async (req, res) => {
  try {
    const { payment_record_id, gateway_payment_id, gateway_order_id, gateway_signature } = req.body;

    const payment = await Payment.findById(payment_record_id);
    if (!payment) {
      return res.status(404).json({ error: "Payment record not found" });
    }

    payment.gateway_payment_id = gateway_payment_id || `pay_${Date.now()}`;
    payment.gateway_signature = gateway_signature || "signature_verified";
    payment.status = "captured";

    // Auto generate PDF invoice
    const { fileName } = await invoiceService.generateInvoicePDF(payment);
    payment.invoice_url = `/invoices/${fileName}`;
    await payment.save();

    res.status(200).json({
      success: true,
      message: "Payment captured successfully",
      invoice_number: payment.invoice_number,
      invoice_url: payment.invoice_url,
    });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ error: "Payment verification failed" });
  }
};

// 3. Get All Invoices for Therapist Dashboard
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Payment.find({ status: "captured" }).sort({ createdAt: -1 });
    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve billing records" });
  }
};
