class NotificationService {
  static async notifyBookingConfirmed({ clientName, clientPhone, clientEmail, date, time }) {
    const timestamp = new Date().toISOString();
    console.log(`\n================= [DOMAIN EVENT: BOOKING CONFIRMED] =================`);
    console.log(`[Timestamp]   : ${timestamp}`);
    console.log(`[Patient]     : ${clientName} (${clientEmail})`);
    console.log(`[Slot]        : ${date} at ${time}`);
    console.log(`[WhatsApp Stub] -> Queued template message to ${clientPhone || "+91-XXXXXXXXXX"}:`);
    console.log(`                  "Namaste ${clientName}, your consultation with Dr. Dhanya Krishna is confirmed for ${date} at ${time}."`);
    console.log(`[Email Stub]    -> Sent calendar invite & video room link to ${clientEmail}`);
    console.log(`====================================================================\n`);
    return { success: true, channel: "whatsapp_and_email_queued" };
  }

  static async notifyPaymentReceipt({ clientName, clientPhone, amount, invoiceNumber, invoiceUrl }) {
    console.log(`\n================= [DOMAIN EVENT: PAYMENT CAPTURED] =================`);
    console.log(`[Patient]     : ${clientName}`);
    console.log(`[Amount]      : INR ${amount}`);
    console.log(`[Invoice No]  : ${invoiceNumber}`);
    console.log(`[WhatsApp Stub] -> "Thank you for settling your consult fee. Download receipt: ${invoiceUrl}"`);
    console.log(`====================================================================\n`);
    return { success: true };
  }
}

module.exports = NotificationService;
