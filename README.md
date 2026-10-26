# HealSpace Clinical SaaS Platform

> **HealSpace** is a HIPAA-aligned, full-stack practice management and clinical telehealth platform engineered for licensed psychotherapists and psychological care providers in India.

---

## 🌟 Key Functional Architecture

1. **Practitioner Identity & Telehealth Intake (`/dhanya-krishna`)**
   - Branded clinical microsite with real-time dynamic slot availability engine.
   - Dual-mode consultation routing: In-person clinic appointments & virtual teletherapy.
   - Clinical intake onboarding capturing psychological presenting concerns.

2. **Real-Time Encrypted Clinical Messaging (`chatSocket.js` & `ChatWindow.jsx`)**
   - Bi-directional WebSocket communication bridge via Socket.io.
   - **Integrated Automated AI Clinical Triage**: Instant automated guidance answering patient FAQs regarding booking, pricing, and consultation structure.
   - **Clinical Priority Escalation**: Algorithmic keyword detection that identifies crisis triggers and flags attending clinicians with an urgent triage alert while surfacing 24/7 tele-mental health helplines (Tele-MANAS 14416).

3. **Clinical Documentation & Confidentiality Boundary (`/api/notes`)**
   - Dual-tier `SessionNote` schema enforcing strict API-level projection separation:
     - **Private SOAP Notes**: Restricted strictly to the clinician's authenticated session.
     - **Shared Protocols & Care Plans**: Accessible to patients for post-session follow-through and behavioral homework.

4. **Automated Financials & Tax Compliance (`/api/payments`)**
   - Simulated Razorpay order lifecycle and webhook-compatible payment tracking.
   - Automated PDFKit GST-compliant invoice generation (`/invoices`) with instant status tracking.

5. **Practitioner Command Center (`/dashboard`)**
   - Multi-tab management: Live appointments, client CRM directory, consultation chat console, and billing records.
   - **Practice Analytics (`/api/analytics`)**: Real-time aggregation pipelines compiling caseload volume, session format breakdowns, and revenue velocity.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18 (Vite), Tailwind CSS, Lucide Icons, Socket.io-Client, React Router DOM |
| **Backend** | Node.js, Express.js, Socket.io Server, Mongoose ODM |
| **Database** | MongoDB Atlas (Multi-collection relational schemas & Aggregations) |
| **Compliance & Security** | Strict Field Projection (SOAP shielding), Role-Based Entitlement Gates (`canAccess`) |

---

## 🚀 Local Development Setup

### 1. Backend Service Setup
```bash
cd healspace-backend
npm install
npm run dev
# Running on http://localhost:5001
