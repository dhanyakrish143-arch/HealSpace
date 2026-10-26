// src/services/notificationService.js
// Event-driven domain notifications (Module 6 Specification)

const events = {
  BOOKING_CONFIRMED: "BOOKING_CONFIRMED",
  PAYMENT_RECEIVED: "PAYMENT_RECEIVED",
  CRISIS_ALERT: "CRISIS_ALERT"
};

async function sendNotification(eventType, payload) {
  const timestamp = new Date().toISOString();
  console.log(`\n[DOMAIN EVENT] ${eventType} triggered at ${timestamp}`);

  switch (eventType) {
    case events.BOOKING_CONFIRMED:
      console.log(`[WHATSAPP QUEUE] To: ${payload.phone} | "Your consultation with Dr. Dhanya Krishna is confirmed for ${payload.slot}."`);
      break;

    case events.PAYMENT_RECEIVED:
      console.log(`[WHATSAPP QUEUE] To: ${payload.phone} | "Payment receipt of ₹${payload.amount} received. GST invoice generated."`);
      break;

    case events.CRISIS_ALERT:
      console.log(`[PRIORITY DISPATCH] Attending Doctor: Dr. Dhanya Krishna alerted for urgent patient: ${payload.clientName}`);
      break;

    default:
      console.log(`[NOTIFICATION DISPATCH] Generic event:`, payload);
  }
  return { success: true, queuedAt: timestamp };
}

module.exports = {
  sendNotification,
  events
};
