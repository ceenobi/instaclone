import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import MetaArgs from "../../components/MetaArgs";
import logo from "../../assets/logo1.svg";
import { validatePassword } from "../../utils/formValidate";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { toast } from "sonner";
import handleError from "../../utils/handleError";
import { resetPassword } from "../../api/auth";

export default function ResetPassword() {
  const [isVisible, setIsVisible] = useState(false);
  const { userId, passwordToken } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();

  const togglePassword = () => {
    setIsVisible((prev) => !prev);
  };

  const onFormSubmit = async (data) => { 
    if (data.newPassword !== data.confirmPassword) {
      toast.error("New password and confirm password do not match", {
        id: "Resetpassword",
      });
      return
    }
    try {
      const res = await resetPassword(userId, passwordToken, data);
      if (res.status === 200) {
        toast.success(res.data.message);
        navigate("/auth/login");
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <MetaArgs
        title="Reset your InstaShot password"
        content="Reset password page"
      />
      <div className="w-[90vw] md:w-[350px] border rounded-sm border-[#d7d3d3] py-[30px] px-[28px]">
        <div className="flex justify-center">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <h1 className="mt-6 text-xl font-semibold text-center">
          Reset your password
        </h1>
        <form
          className="md:max-w-[300px] mx-auto mt-6 bg-white"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <div className="mb-4">
            <div className="relative">
              <label className="floating-label">
                <span>New Password</span>
                <input
                  type={isVisible ? "text" : "password"}
                  placeholder="New password"
                  className="input input-md w-full"
                  id="newPassword"
                  {...register("newPassword", {
                    validate: (value) =>
                      validatePassword(value, "New password is required"),
                  })}
                />
              </label>
              <button
                type="button"
                className="absolute inset-y-0 right-2 text-sm cursor-pointer"
                onClick={togglePassword}
              >
                {isVisible ? "Hide" : "Show"}
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
                  type={isVisible ? "text" : "password"}
                  placeholder="Confirm password"
                  className="input input-md w-full"
                  id="confirmPassword"
                  {...register("confirmPassword", {
                    validate: (value) =>
                      validatePassword(value, "Confirm password is required"),
                  })}
                />
              </label>
              <button
                type="button"
                className="absolute inset-y-0 right-2 text-sm cursor-pointer"
                onClick={togglePassword}
              >
                {isVisible ? "Hide" : "Show"}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-xs text-red-600">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
          <button
            className="btn bg-[#8D0D76] w-full text-white"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </div>
      <div className="md:max-w-[350px] my-6 text-center border rounded-sm border-[#d7d3d3] flex items-center justify-center h-[60px]">
        <p>
          Already have an account?{" "}
          <span className="text-[#8D0D76] font-bold">
            <Link to="/auth/login">Log In</Link>
          </span>
        </p>
      </div>
    </>
  );
}
