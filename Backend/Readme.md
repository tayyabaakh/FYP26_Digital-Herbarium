*****Phase 1 — Verify Database State

Before testing APIs, check what's currently in your database.

SELECT * FROM users;
SELECT * FROM botanist_applications;

You should know:

Is there an admin?
Is there a pending botanist application?
What is the application ID?

*****Phase 2 — Verify Authentication
Test A — Admin Login
POST /api/auth/login
{
  "email": "your_admin_email",
  "password": "your_admin_password"
}

Expected:

{
  "success": true,
  "token": "...",
  "user": {
    "role": "admin"
  }
}

If this fails:

check admin exists in DB
check password hash
check JWT_SECRET
Test B — /me without token
GET /api/auth/me

No Authorization header.

Expected:

{
  "success": false
}

If it succeeds:

❌ JWT middleware isn't working.

Test C — /me with admin token
GET /api/auth/me
Authorization: Bearer <admin_token>

Expected:

{
  "success": true,
  "user": {
    "role": "admin"
  }
}
*****Phase 3 — Verify Botanist Application Creation

Submit an application.

POST /api/auth/apply

Use a brand-new email.

Example:

{
  "name": "Ayesha",
  "email": "ayesha@test.com",
  "password": "12345678",
  "phone": "03001234567",
  "institution": "University of Karachi",
  "qualification": "BS Botany",
  "specialisation": "Ethnobotany",
  "experience_years": "2",
  "portfolio_url": "",
  "document_url": "certificate.pdf"
}

Expected:

{
  "success": true
}
Verify Database Immediately
SELECT * FROM users
WHERE email='ayesha@test.com';

Expected:

role = user
SELECT * FROM botanist_applications;

Expected:

status = pending
user_id = matching user
*****Phase 4 — Verify Pending User Cannot Access Admin Routes

Login as applicant.

POST /api/auth/login

If your requirements say pending botanists cannot login:

Expected:

{
  "success": false,
  "message": "Application under review"
}
*****Phase 5 — Verify Admin Can View Applications

Using admin token:

GET /api/admin/applications
Authorization: Bearer <admin_token>

Expected:

{
  "success": true,
  "data": [...]
}

You should see your newly created pending application.

*****Phase 6 — Verify Approval Flow

Approve application.

PUT /api/admin/applications/1/approve
Authorization: Bearer <admin_token>

Replace 1 with actual application ID.

Expected:

{
  "success": true
}
Verify Database Again

Application:

SELECT * FROM botanist_applications
WHERE id=1;

Expected:

status = approved

User:

SELECT role
FROM users
WHERE email='ayesha@test.com';

Expected:

role = botanist

This is the most important check.

*****Phase 7 — Verify Botanist Login

Now login again.

POST /api/auth/login
{
  "email": "ayesha@test.com",
  "password": "12345678"
}

Expected:

{
  "success": true,
  "token": "...",
  "user": {
    "role": "botanist"
  }
}
*****Phase 8 — Verify Role Protection

Use botanist token:

GET /api/admin/applications
Authorization: Bearer <botanist_token>

Expected:

{
  "success": false
}

or

{
  "message": "Access denied"
}

If it returns application data:

❌ Your role middleware is broken.

*****Phase 9 — Verify Rejection Flow

Create another application.

Reject it:

PUT /api/admin/applications/:id/reject
{
  "rejection_reason": "Credentials could not be verified."
}

Expected DB:

SELECT status,rejection_reason
FROM botanist_applications
WHERE id=?;

Expected:

status = rejected
rejection_reason = Credentials could not be verified.

Then login with that user.

Expected:

{
  "success": false,
  "message": "Application rejected"
}