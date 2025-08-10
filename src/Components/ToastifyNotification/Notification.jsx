import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Toast configuration
export const toastConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

// Toast functions
export const showSuccessToast = (message) => toast.success(message, toastConfig);
export const showErrorToast = (message) => toast.error(message, toastConfig);
export const showInfoToast = (message) => toast.info(message, toastConfig);
export const showWarningToast = (message) => toast.warn(message, toastConfig);
