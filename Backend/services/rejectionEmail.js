// services/rejectionEmail.js (or utils/email.js)
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Existing function for botanist account applications
const sendRejectionEmail = async (toEmail, applicantName, reason) => {
  const plainTextReason = reason && reason.trim() !== "" 
    ? reason 
    : "Information submitted did not meet required criteria.";

  const mailOptions = {
    from: `"KUH Digital Herbarium" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Update Regarding Your Botanist Application",
    text: `Hello ${applicantName || "Applicant"},\n\nThank you for submitting your application for verified botanist status on Digital Herbarium.\n\nAfter reviewing your credentials, we regret to inform you that your application has been rejected.\n\nReason for Rejection: ${plainTextReason}\n\nIf you believe this decision was made in error or wish to update your credentials, feel free to submit a new application.\n\nBest regards,\nDigital Herbarium Team`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #e11d48; margin-top: 0;">Botanist Application Status</h2>
        <p>Dear <strong>${applicantName || "Applicant"}</strong>,</p>
        <p>Thank you for submitting your application for verified botanist status on our platform.</p>
        <p>After reviewing your submitted credentials, we regret to inform you that your application has been <strong>rejected</strong> at this time.</p>
        
        <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
          <strong style="color: #991b1b;">Reason for Rejection:</strong>
          <p style="margin: 4px 0 0 0; color: #7f1d1d;">${plainTextReason}</p>
        </div>

        <p>If you believe this decision was made in error or wish to update your qualification credentials, feel free to submit a new application.</p>
        <br/>
        <p style="font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 10px;">This is an automated notification from the Digital Herbarium platform.</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

// NEW: Helper function specifically for plant submission rejections
const sendSubmissionRejectionEmail = async (toEmail, botanistName, submissionId, speciesName, reason) => {
  const plainTextReason = reason && reason.trim() !== "" 
    ? reason 
    : "The submitted specimen record or image quality did not meet verification criteria.";

  const formattedSubId = `SUB-${String(submissionId).padStart(4, '0')}`;

  const mailOptions = {
    from: `"KUH Digital Herbarium" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Update Regarding Herbarium Submission ${formattedSubId}`,
    text: `Hello ${botanistName || "Botanist"},\n\nYour specimen submission for "${speciesName || "Unidentified Plant"}" (${formattedSubId}) has been reviewed by our administration team.\n\nStatus: Rejected\nReason for Rejection: ${plainTextReason}\n\nYou can review your submission history by logging into your account.\n\nBest regards,\nDigital Herbarium Team`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <h2 style="color: #e11d48; margin-top: 0;">Submission Verification Update</h2>
        <p>Dear <strong>${botanistName || "Botanist"}</strong>,</p>
        <p>Your specimen submission for <em style="font-weight: bold;">${speciesName || "Unidentified Plant"}</em> (<strong>${formattedSubId}</strong>) has been reviewed.</p>
        <p>We regret to inform you that the submission has been <strong>rejected</strong> during the verification process.</p>
        
        <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
          <strong style="color: #991b1b;">Reason for Rejection:</strong>
          <p style="margin: 4px 0 0 0; color: #7f1d1d;">${plainTextReason}</p>
        </div>

        <p>You can review and edit your submission details by logging into your botanist dashboard.</p>
        <br/>
        <p style="font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 10px;">This is an automated notification from KUH Digital Herbarium.</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = { 
  sendRejectionEmail, 
  sendSubmissionRejectionEmail 
};