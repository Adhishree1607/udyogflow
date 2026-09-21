const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());


// ===============================
// 1. Backend Test Route
// ===============================

app.get("/", (req, res) => {
  res.json({
    message: "UdyogFlow Backend is running!"
  });
});


// ===============================
// 2. PostgreSQL Test Route
// ===============================

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "PostgreSQL connected successfully!",
      time: result.rows[0].now
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Database connection failed"
    });
  }
});


// ===============================
// 3. Save New Application
// ===============================

app.post("/api/applications", async (req, res) => {
  try {

    const {
      businessName,
      industry,
      location,
      businessType,
      description
    } = req.body;


    // Save application
    const applicationResult = await pool.query(
      `INSERT INTO applications
      (
        business_name,
        industry,
        location,
        business_type,
        project_description
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *`,
      [
        businessName,
        industry,
        location,
        businessType,
        description
      ]
    );


    const application = applicationResult.rows[0];


    // Find matching MAITRI approvals
    const approvalResult = await pool.query(
      `SELECT approval_id
       FROM approval_services
       WHERE activity_name = $1
       ORDER BY approval_id`,
      [industry]
    );


    // Create approval records
    for (const approval of approvalResult.rows) {

      await pool.query(
        `INSERT INTO application_approvals
        (
          application_id,
          approval_id,
          status
        )
        VALUES ($1, $2, $3)`,
        [
          application.application_id,
          approval.approval_id,
          "Pending"
        ]
      );

    }


    res.status(201).json({
      message: "Application saved successfully",
      application: application,
      approvalsCreated: approvalResult.rows.length
    });


  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to save application"
    });

  }
});


// ===============================
// 4. Get All Applications
// ===============================

app.get("/api/applications", async (req, res) => {

  try {

    const result = await pool.query(
      `SELECT *
       FROM applications
       ORDER BY created_at DESC`
    );

    res.json(result.rows);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch applications"
    });

  }

});


// ===============================
// 5. Get Application by ID
// ===============================

app.get("/api/applications/:id", async (req, res) => {

  try {

    const { id } = req.params;


    const result = await pool.query(
      `SELECT *
       FROM applications
       WHERE application_id = $1`,
      [id]
    );


    if (result.rows.length === 0) {

      return res.status(404).json({
        message: "Application not found"
      });

    }


    res.json(result.rows[0]);


  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch application"
    });

  }

});


// ===============================
// 6. Get Approvals for Application
// ===============================

app.get("/api/applications/:id/approvals", async (req, res) => {

  try {

    const { id } = req.params;


    const result = await pool.query(
      `SELECT
        aa.application_approval_id,
        aa.application_id,
        aa.approval_id,
        aa.status,
        aa.submitted_at,
        aa.approved_at,
        a.service_name,
        a.approving_department,
        a.stage,
        a.sla_days,
        a.document_link,
        a.fees,
        a.governing_act_rule,
        a.website
       FROM application_approvals aa
       JOIN approval_services a
         ON aa.approval_id = a.approval_id
       WHERE aa.application_id = $1
       ORDER BY aa.application_approval_id`,
      [id]
    );


    res.json(result.rows);


  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch application approvals"
    });

  }

});


// ===============================
// 7. Get MAITRI Approval Services
// ===============================

app.get("/api/approvals", async (req, res) => {

  try {

    const { industry } = req.query;


    let query = `
      SELECT *
      FROM approval_services
    `;


    let values = [];


    if (industry) {

      query += `
        WHERE activity_name = $1
      `;

      values = [industry];

    }


    query += `
      ORDER BY approval_id
    `;


    const result = await pool.query(
      query,
      values
    );


    res.json(result.rows);


  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Failed to fetch approval services"
    });

  }

});


// ===============================
// 8. Start Server
// ===============================

const PORT = 5000;

app.listen(PORT, () => {

  console.log(
    `UdyogFlow backend running on http://localhost:${PORT}`
  );

});