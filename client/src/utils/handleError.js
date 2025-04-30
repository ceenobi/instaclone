import { toast } from "sonner";

const handleError = (error) => {
  console.error(error);
  //check for session expiration
  if (error && error?.response?.data?.error === "jwt expired") {
    toast.error("Session expired, logging you out", { id: "logout" });
    const redirect = setTimeout(() => {
      window.location.href = "/auth/login";
    }, 1500);
    //clean up function to remove from memory after running
    return () => {
      clearTimeout(redirect);
    };
  }
  if (error?.message === "Network Error") {
    return toast.error("Server is down, please try again in a moment", {
      id: "Network-Error",
    });
  }

  if (error) {
    return toast.error(
      error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.response?.data ||
        error?.message ||
        "An unexpected error has ocurred",
      { id: "response-Error" }
    );
  }
};

export default handleError;
