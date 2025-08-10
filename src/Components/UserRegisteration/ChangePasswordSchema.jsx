// 📁 src/validation/ChangePasswordSchema.js
import * as Yup from "yup";

const ChangePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required("Current password is required")
    .min(6, "Must be at least 6 characters"),

  newPassword: Yup.string()
    .required("New password is required")
    .notOneOf([Yup.ref("currentPassword")], "New password must be different from current password")
    .matches(
      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
      "Password must be at least 8 characters long, include one uppercase, one lowercase, one number, and one special character"
    ),
});

export default ChangePasswordSchema;
