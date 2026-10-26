const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.generateInvoicePDF = async (paymentData) => {
  return new Promise((resolve, reject) => {
    try {
      const invoicesDir = path.join(process.cwd(), "invoices");
      if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
      }

      const fileName = `INV-${Date.now()}-${paymentData.invoice_number || "REC"}.pdf`;
      const filePath = path.join(invoicesDir, fileName);
      const doc = new PDFDocument({ margin: 50, size: "A4" });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Header
      doc
        .fontSize(20)
        .font("Helvetica-Bold")
        .fillColor("#0F382A")
        .text("HEALSPACE CLINICAL PRACTICE", 50, 50);

      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#556A5F")
        .text("Dr. Dhanya Krishna | Licensed Clinical Psychologist (RCI)", 50, 75)
        .text("Department of Adult Psychotherapy & Behavioral Medicine", 50, 88)
        .text("Indiranagar, Bengaluru, Karnataka 560038 | support@healspace.in", 50, 101);

      doc.strokeColor("#DFD5C4").lineWidth(1).moveTo(50, 120).lineTo(545, 120).stroke();

      // Invoice Meta Details
      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .fillColor("#0D2F23")
        .text("TAX INVOICE & PAYMENT RECEIPT", 50, 140);

      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor("#333333")
        .text(`Invoice No: ${paymentData.invoice_number || "INV-2026-001"}`, 50, 165)
        .text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 50, 180)
        .text(`Payment ID: ${paymentData.gateway_payment_id || "TEST_UPI_CAPTURED"}`, 50, 195)
        .text(`Status: COMPLETED (PAID)`, 50, 210);

      // Client Info
      doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text("Billed To:", 350, 140)
        .font("Helvetica")
        .text(paymentData.client_name, 350, 155)
        .text(paymentData.client_email, 350, 170)
        .text(paymentData.client_phone || "Not Provided", 350, 185);

      // Table Header
      const tableTop = 240;
      doc.rect(50, tableTop, 495, 25).fill("#FAF7F0");
      doc
        .fillColor("#0F382A")
        .font("Helvetica-Bold")
        .fontSize(9)
        .text("Item / Consultation Description", 60, tableTop + 7)
        .text("Format", 280, tableTop + 7)
        .text("Rate (INR)", 400, tableTop + 7)
        .text("Amount", 480, tableTop + 7);

      // Table Row
      const rowTop = tableTop + 35;
      doc
        .fillColor("#333333")
        .font("Helvetica")
        .fontSize(9)
        .text("Psychotherapy & Diagnostic Consultation (45 min)", 60, rowTop)
        .text("Telehealth/Clinic", 280, rowTop)
        .text(`Rs. ${paymentData.amount}`, 400, rowTop)
        .text(`Rs. ${paymentData.amount}`, 480, rowTop);

      doc.strokeColor("#EFE9DD").lineWidth(0.5).moveTo(50, rowTop + 20).lineTo(545, rowTop + 20).stroke();

      // Calculation Section
      const totalTop = rowTop + 35;
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .fillColor("#0F382A")
        .text("Total Paid:", 380, totalTop)
        .text(`Rs. ${paymentData.amount}.00`, 480, totalTop);

      // Footer
      doc
        .fontSize(8)
        .font("Helvetica")
        .fillColor("#7A8C82")
        .text("This is a computer-generated receipt authorized under HealSpace Clinical Operations.", 50, 720, {
          align: "center",
          width: 495,
        });

      doc.end();

      stream.on("finish", () => {
        resolve({ fileName, filePath });
      });

      stream.on("error", (err) => reject(err));
    } catch (e) {
      reject(e);
    }
  });
};
