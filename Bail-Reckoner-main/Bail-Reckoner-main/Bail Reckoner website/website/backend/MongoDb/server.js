const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

// MongoDB Connection URI
const MONGO_URI = "mongodb+srv://technocelestials:arunpass123@technocelestials.pic31.mongodb.net/BailReckoner?retryWrites=true&w=majority&appName=TechnoCelestials";

// Secure API Key
const API_KEY = "mysecureapikey123";

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
})
  .then(() => console.log("✅ MongoDB Connected to BailReckoner"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Middleware for API Key Authentication
const authenticate = (req, res, next) => {
  if (!req.headers["x-api-key"] || req.headers["x-api-key"] !== API_KEY) {
    return res.status(403).json({ message: "Unauthorized access" });
  }
  next();
};


// Case Schema and Model
const caseSchema = new mongoose.Schema({
  caseId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ["Open", "Closed"], default: "Open" },
  assignedLawyer: { type: mongoose.Schema.Types.ObjectId, ref: "Lawyer" },
}, { timestamps: true });

const Case = mongoose.model("Case", caseSchema);




// Fetch Prisoner by ID
app.get("/Prisoner/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const db = mongoose.connection.db;
    const prisoner = await db.collection("Prisoner").findOne({ prisoner_id: id });

    if (!prisoner) {
      return res.status(404).json({ message: "Prisoner not found" });
    }

    res.json(prisoner);
  } catch (error) {
    console.error("❌ Error fetching prisoner:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Fetch Lawyer by ID
app.get("/lawyers/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const db = mongoose.connection.db;
    const lawyer = await db.collection("lawyers").findOne({ _id: id });

    if (!lawyer) {
      return res.status(404).json({ message: "Lawyer not found" });
    }

    res.json(lawyer);
  } catch (error) {
    console.error("❌ Error fetching lawyer:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Fetch Lawyer by ID
app.get("/judge/:id", authenticate, async (req, res) => {
  const { id } = req.params;
  try {
    const db = mongoose.connection.db;
    const lawyer = await db.collection("judge").findOne({ judge_id: id });

    if (!lawyer) {
      return res.status(404).json({ message: "Lawyer not found" });
    }

    res.json(lawyer);
  } catch (error) {
    console.error("❌ Error fetching lawyer:", error);
    res.status(500).json({ message: "Server error", error });
  }
});
app.get('/cases/getByNumber/:caseNumber', async (req, res) => {
  const { caseNumber } = req.params;
  const caseData = await CaseModel.findOne({ case_number: caseNumber });
  if (caseData) {
    res.json(caseData);
  } else {
    res.status(404).send('Case not found');
  }
});




// Backend - Fetch Case by Case Number
app.get("/cases/:caseNumber", authenticate, async (req, res) => {
  const { caseNumber } = req.params;
  try {
    const db = mongoose.connection.db;
    const caseDetails = await db.collection("cases").findOne({ case_number: caseNumber });

    if (!caseDetails) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.json(caseDetails);
  } catch (error) {
    console.error("❌ Error fetching case:", error);
    res.status(500).json({ message: "Server error", error });
  }
});


// 📌 [NEW] MCQ Submission API (Added Without Changing Old Code)
app.post("/mcq/submit", authenticate, async (req, res) => {
  try {
    const { caseId, mcqResponses } = req.body;

    if (!caseId || !mcqResponses) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const db = mongoose.connection.db;
    const casesCollection = db.collection("cases");

    // Store MCQ responses inside the "cases" collection under "bail_assessment"
    const result = await casesCollection.updateOne(
      { case_number: caseId }, // Find case by case_number
      { $set: { bail_assessment: mcqResponses } } // Store MCQ responses
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Case not found" });
    }

    res.status(200).json({ message: "MCQ responses saved successfully" });
  } catch (error) {
    console.error("❌ Error saving MCQ responses:", error);
    res.status(500).json({ message: "Server error", error });
  }
});
// 📌 [NEW] Fetch MCQ Responses for a Case
app.get("/mcq/:caseId", authenticate, async (req, res) => {
  try {
    const { caseId } = req.params;
    const db = mongoose.connection.db;
    const casesCollection = db.collection("cases");

    const caseData = await casesCollection.findOne(
      { case_number: caseId },
      { projection: { bail_assessment: 1, _id: 0 } }
    );

    if (!caseData || !caseData.bail_assessment) {
      return res.status(404).json({ message: "MCQ responses not found for this case" });
    }

    res.json(caseData.bail_assessment);
  } catch (error) {
    console.error("❌ Error fetching MCQ responses:", error);
    res.status(500).json({ message: "Server error", error });
  }
});
// Add Bail Assessment Submission (no changes to existing code above)
// ✅ Add Bail Assessment (as Array)
app.post("/bail-assessment", authenticate, async (req, res) => {
  try {
    const { caseNumber, assessment } = req.body;

    if (!Array.isArray(assessment) || assessment.length !== 9) {
      return res.status(400).json({ message: "Invalid assessment format" });
    }

    const db = mongoose.connection.db;
    await db.collection("cases").updateOne(
      { case_number: caseNumber },
      { $set: { bail_assessment: assessment } },
      { upsert: true }
    );

    res.status(200).json({ message: "Bail assessment saved successfully" });
  } catch (err) {
    console.error("❌ Error saving assessment:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});


// ✅ Check if Bail Assessment Exists for a Case
app.get("/bail-assessment/check/:caseNumber", authenticate, async (req, res) => {
  const { caseNumber } = req.params;

  try {
    const db = mongoose.connection.db;
    const casesCollection = db.collection("cases");

    const caseData = await casesCollection.findOne(
      { case_number: caseNumber, bail_assessment: { $exists: true, $ne: null } },
      { projection: { _id: 1 } }
    );

    res.json({ exists: !!caseData });
  } catch (err) {
    console.error("❌ Error checking bail assessment:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

// 🔥 FIR Heatmap Endpoint by Area
app.get("/fir/areaCounts", authenticate, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const pipeline = [
      { $group: { _id: "$area", count: { $sum: 1 } } },
      { $project: { area: "$_id", count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ];

    const areaCounts = await db.collection("FIR").aggregate(pipeline).toArray();
    res.json({ areaCounts });
  } catch (err) {
    console.error("❌ Error fetching area FIR counts:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});




// Check MongoDB Connection Status
app.get("/status", (req, res) => {
  const status = mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";
  res.json({ message: `MongoDB Status: ${status}` });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
