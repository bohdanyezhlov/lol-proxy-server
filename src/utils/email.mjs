import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
});

const sendVerificationEmail = (user, token) => {
  const verificationUrl = `${process.env.BACKEND_URL}/api/auth/verify-email?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM_NO_REPLY,
    to: user.email,
    subject: "Email Verification",
    // text: `Hello ${user.username}!\n\nPlease verify your email by clicking the following link: ${verificationUrl}\n\nThank you!`,
    text: `Hello!\n\nPlease verify your email by clicking the following link: ${verificationUrl}\n\nThank you!`,
  };

  return transporter.sendMail(mailOptions);
};

export default sendVerificationEmail;
