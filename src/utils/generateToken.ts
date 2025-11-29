import crypto from "crypto";

const generateEmailVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const generatePasswordResetToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const generateEmailVerificationTokenExpires = () => {
  return new Date(Date.now() + 1000 * 60 * 60 * 24); 
};

const generatePasswordResetTokenExpires = () => {
  return new Date(Date.now() + 1000 * 60 * 60 * 24); 
};

export {
  generateEmailVerificationToken,
  generatePasswordResetToken,
  generateEmailVerificationTokenExpires,
  generatePasswordResetTokenExpires,
};
