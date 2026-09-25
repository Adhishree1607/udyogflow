const express = require("express");
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcryptjs");

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
// 3. Register New User
// ===============================

app.post("/api/register", async (req, res) => {
  try {

    const {
      fullName,
      businessName,
      email,
      password,
      district
    } = req.body;

    if (!fullName || !businessName || !email || !password) {
      return res.status(400).json({
        message: "Please provide all required registration details"
      });
    }

    // Check whether email already exists
    const existingUser = await pool.query(
      `SELECT user_id
       FROM users
       WHERE LOWER(email) = LOWER($1)`,
      [email.trim()]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "An account with this email already exists"
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Save user
    const result = await pool.query(
      `INSERT INTO users
      (
        full_name,
        business_name,
        email,
        password_hash,
        district
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING
        user_id,
        full_name,
        business_name,
        email,
        district,
        created_at`,
      [
        fullName.trim(),
        businessName.trim(),
        email.trim().toLowerCase(),
        passwordHash,
        district || null
      ]
    );

    res.status(201).json({
      message: "Registration successful",
      user: result.rows[0]
    });

  } catch (error) {

    console.error("Registration error:", error);

    res.status(500).json({
      message: "Failed to register user"
    });

  }
});


// ===============================
// 4. Login User
// ===============================

app.post("/api/login", async (req, res) => {
  try {

    const {
      email,
      password
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    // Find user
    const result = await pool.query(
      `SELECT *
       FROM users
       WHERE LOWER(email) = LOWER($1)`,
      [email.trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    const user = result.rows[0];

    // Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    // Do not send password hash to frontend
    delete user.password_hash;

    res.json({
      message: "Login successful",
      user: user
    });

  } catch (error) {

    console.error("Login error:", error);

    res.status(500).json({
      message: "Failed to login"
    });

  }
});


// ===============================
// 5. Save New Application
// ===============================

app.post("/api/applications", async (req, res) => {
  try {

    const {
      userId,
      businessName,
      industry,
      location,
      businessType,
      description
    } = req.body;


    // User ID is required
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required"
      });
    }


    // Check whether user exists
    const userResult = await pool.query(
      `SELECT user_id
       FROM users
       WHERE user_id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        message: "Invalid user"
      });
    }


    // Save application
    const applicationResult = await pool.query(
      `INSERT INTO applications
      (
        user_id,
        business_name,
        industry,
        location,
        business_type,
        project_description
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [
        userId,
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

    console.error("Application save error:", error);

    res.status(500).json({
      message: "Failed to save application"
    });

  }
});


// ===============================
// 6. Get Applications for User
// ===============================

app.get("/api/applications", async (req, res) => {

  try {

    const userId = req.query.userId || req.query.user_id;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required"
      });
    }

    const result = await pool.query(
      `SELECT *
       FROM applications
       WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json(result.rows);

  } catch (error) {

    console.error("Fetch applications error:", error);

    res.status(500).json({
      message: "Failed to fetch applications"
    });

  }

});


// ===============================
// 7. Get Application by ID
// ===============================

app.get("/api/applications/:id", async (req, res) => {

  try {

    const { id } = req.params;
    const { user_id } = req.query;


    if (!user_id) {
      return res.status(400).json({
        message: "User ID is required"
      });
    }


    const result = await pool.query(
      `SELECT *
       FROM applications
       WHERE application_id = $1
       AND user_id = $2`,
      [id, user_id]
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
// 8. Get Approvals for Application
// ===============================

app.get("/api/applications/:id/approvals", async (req, res) => {

  try {

    const { id } = req.params;
    const { user_id } = req.query;


    if (!user_id) {
      return res.status(400).json({
        message: "User ID is required"
      });
    }


    // First verify that this application belongs to the user
    const applicationCheck = await pool.query(
      `SELECT application_id
       FROM applications
       WHERE application_id = $1
       AND user_id = $2`,
      [id, user_id]
    );


    if (applicationCheck.rows.length === 0) {
      return res.status(404).json({
        message: "Application not found"
      });
    }


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
// 9. Get MAITRI Approval Services
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
// 10. Start Server
// ===============================

const PORT = 5000;

app.listen(PORT, () => {

  console.log(
    `UdyogFlow backend running on http://localhost:${PORT}`
  );

});