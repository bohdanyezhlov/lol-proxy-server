import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025,
});

export const sendVerificationEmail = (user, token) => {
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

export const sendPasswordResetEmail = (user, token) => {
  const resetUrl = `${process.env.BACKEND_URL}/api/auth/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM_NO_REPLY,
    to: user.email,
    subject: "Password Reset",
    text: `Hello!\n\nYou requested a password reset. Please click the following link to reset your password: ${resetUrl}\n\nIf you did not request this, please ignore this email.\n\nThank you!`,
  };

  return transporter.sendMail(mailOptions);
};
