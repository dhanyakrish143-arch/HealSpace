require("dotenv").config();
const mongoose = require("mongoose");
const Appointment = require("./src/models/Appointment");

async function runCohortAnalytics() {
  const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/healspace";

  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully!\n");

    const therapistSlug = "dhanya-krishna";

    // Multi-stage Aggregation Pipeline for Retention & Cohorts
    const results = await Appointment.aggregate([
      { $match: { therapist_slug: therapistSlug } },
      {
        $group: {
          _id: {
            month: { $substr: ["$date", 0, 7] },
            client: "$client_email"
          },
          visitCount: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: "$_id.month",
          uniquePatients: { $sum: 1 },
          returningPatients: {
            $sum: { $cond: [{ $gt: ["$visitCount", 1] }, 1, 0] }
          },
          totalConsultationsInPeriod: { $sum: "$visitCount" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    console.log("==================================================");
    console.log(`PRACTICE RETENTION & COHORT ANALYSIS (${therapistSlug})`);
    console.log("==================================================");

    if (results.length === 0) {
      console.log("No appointments recorded for this slug yet.");
    } else {
      console.table(results);
    }

    console.log("\nPipeline executed cleanly via Mongoose.");
  } catch (error) {
    console.error("Aggregation error:", error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runCohortAnalytics();
