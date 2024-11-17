import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    is_email_verified: { type: Boolean, default: false },
    email_verification_token: { type: String },
    email_verification_expires: { type: Date },
    reset_password_token: { type: String },
    reset_password_expires: { type: Date },
    //
    mainChampion: { type: String, default: null },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (e) {
    next(e);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateEmailVerificationToken = function () {
  const token = crypto.randomBytes(20).toString("hex");
  this.email_verification_token = token;
  this.email_verification_expires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

  return token;
};

userSchema.methods.generatePasswordResetToken = function () {
  const token = crypto.randomBytes(20).toString("hex");
  this.reset_password_token = token;
  this.reset_password_expires = Date.now() + 3600000; // 1 hour

  return token;
};

const User = mongoose.model("User", userSchema);

export default User;
