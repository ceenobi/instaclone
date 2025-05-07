import { useForm } from "react-hook-form";
import MetaArgs from "../../components/MetaArgs";
import { useState } from "react";
import {
  validateConfirmPassword,
  validateNewPassword,
  validatePassword,
} from "../../utils/formValidate";
import { toast } from "sonner";
import { updateUserPassword } from "../../api/auth";
import handleError from "../../utils/handleError";
import { useAuth } from "../../store";

export default function UpdatePassword() {
  const [isVisibleA, setIsVisibleA] = useState(false);
  const [isVisibleB, setIsVisibleB] = useState(false);
  const [isVisibleC, setIsVisibleC] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { accessToken, handleLogout } = useAuth();

  const togglePassword = () => {
    setIsVisibleA((prev) => !prev);
  };
  const toggleNewPassword = () => {
    setIsVisibleB((prev) => !prev);
  };
  const toggleConfirmPassword = () => {
    setIsVisibleC((prev) => !prev);
  };

  const onFormSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New password and Confirm password are not a match");
    }
    try {
      const res = await updateUserPassword(data, accessToken);
      if (res.status === 200) {
        toast.success(res.data.message);
        const logout = setTimeout(() => {
          handleLogout();
        }, 1500);
        return () => {
          clearTimeout(logout);
        };
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <MetaArgs title="Update password" content="Update your password" />
      <h1 className="text-lg text-center mt-8 mb-4 font-bold">
        Update current password
      </h1>
      <div className="border-2 border-zinc-200 p-4 rounded-lg w-[85vw] md:w-[350px] mx-auto">
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="mb-4">
            <div className="relative">
              <label className="floating-label">
                <span>current Password</span>
                <input
                  type={isVisibleA ? "text" : "password"}
                  placeholder="Current Password"
                  className="input input-md w-full"
                  id="currentPassword"
                  {...register("currentPassword", {
                    validate: (value) =>
                      validatePassword(value, "Current password is required"),
                  })}
                />
              </label>
              <button
                type="button"
                className="absolute inset-y-0 right-2 text-sm cursor-pointer"
                onClick={togglePassword}
              >
                {isVisibleA ? "Hide" : "Show"}
              </button>
            </div>
            {errors.currentPassword && (
              <span className="text-xs text-red-600">
                {errors.currentPassword.message}
              </span>
            )}
          </div>
          <div className="mb-4">
            <div className="relative">
              <label className="floating-label">
                <span>New Password</span>
                <input
                  type={isVisibleB ? "text" : "password"}
                  placeholder="New Password"
                  className="input input-md w-full"
                  id="newPassword"
                  {...register("newPassword", {
                    validate: (value) =>
                      validateNewPassword(value, "New password is required"),
                  })}
                />
              </label>
              <button
                type="button"
                className="absolute inset-y-0 right-2 text-sm cursor-pointer"
                onClick={toggleNewPassword}
              >
                {isVisibleB ? "Hide" : "Show"}
              </button>
            </div>
            {errors.newPassword && (
              <span className="text-xs text-red-600">
                {errors.newPassword.message}
              </span>
            )}
          </div>
          <div className="mb-4">
            <div className="relative">
              <label className="floating-label">
                <span>Confirm Password</span>
                <input
                  type={isVisibleC ? "text" : "password"}
                  placeholder="Confirm Password"
                  className="input input-md w-full"
                  id="confirmPassword"
                  {...register("confirmPassword", {
                    validate: (value) =>
                      validateConfirmPassword(
                        value,
                        "Confirm password is required"
                      ),
                  })}
                />
              </label>
              <button
                type="button"
                className="absolute inset-y-0 right-2 text-sm cursor-pointer"
                onClick={toggleConfirmPassword}
              >
                {isVisibleC ? "Hide" : "Show"}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-xs text-red-600">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
          <button
            className="mt-2 btn bg-[#8D0D76] w-full text-white"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Update"
            )}
          </button>
        </form>
      </div>
    </>
  );
}
