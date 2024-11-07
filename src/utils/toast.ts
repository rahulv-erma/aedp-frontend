import { toast, Theme, ToastOptions } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type ToastType = "success" | "error" | "info" | "warning" | "default";

/**
 * Display a toast notification based on the type and message.
 */
export const showToast = (
  type: ToastType,
  message: string,
  theme: Theme = "light",
) => {
  const options: ToastOptions = { theme };

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "info":
      toast.info(message, options);
      break;
    case "warning":
      toast.warn(message, options);
      break;
    default:
      toast(message, options);
  }
};
