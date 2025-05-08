import logo from "../../assets/logo1.svg";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { validatePassword, validateUsername } from "../../utils/formValidate";
import { useState } from "react";
import MetaArgs from "../../components/MetaArgs";
import { loginUser } from "../../api/auth";
import handleError from "../../utils/handleError";
import { toast } from "sonner";
import { useAuth } from "../../store";

export default function Login() {
  const [isVisible, setIsVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const navigate = useNavigate();
  const { setAccessToken } = useAuth();

  const togglePassword = () => {
    setIsVisible((prev) => !prev);
  };

  const onFormSubmit = async (data) => {
    try {
      const res = await loginUser(data);
      if (res.status === 200) {
        toast.success(res.data.message);
        setAccessToken(res.data.accessToken);
        navigate("/");
      }
    } catch (error) {
      handleError(error);
    }
  };
  return (
    <>
      <MetaArgs
        title="Login to InstaShots"
        content="Login to your InstaShots account"
      />
      <div className="w-[90vw] md:w-[350px] border rounded-sm border-[#d7d3d3] py-[30px] px-[28px]">
        <div className="flex justify-center">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <form
          className="md:max-w-[300px] mx-auto mt-6 bg-white"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <div className="mb-4">
            <label className="floating-label">
              <span>Username</span>
              <input
                type="text"
                placeholder="Username"
                className="input input-md w-full"
                id="username"
                {...register("username", {
                  validate: (value) => validateUsername(value),
                })}
              />
            </label>
            {errors.username && (
              <span className="text-xs text-red-600">
                {errors.username.message}
              </span>
            )}
          </div>
          <div className="relative">
            <label className="floating-label">
              <span>Password</span>
              <input
                type={isVisible ? "text" : "password"}
                placeholder="Password"
                className="input input-md w-full"
                id="password"
                {...register("password", {
                  validate: (value) =>
                    validatePassword(value, "Password is required"),
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
          {errors.password && (
            <span className="text-xs text-red-600">
              {errors.password.message}
            </span>
          )}
          <button
            className="mt-6 btn bg-[#8D0D76] w-full text-white"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Log in"
            )}
          </button>
          <p className="mt-5 text-center">
            <Link to="/auth/forgot-password">Forgot Password?</Link>
          </p>
        </form>
      </div>
      <div className="md:max-w-[350px] my-6 text-center border rounded-sm border-[#d7d3d3] flex items-center justify-center h-[60px]">
        <p>
          Don't have an account?{" "}
          <span className="text-[#8D0D76] font-bold">
            <Link to="/auth/register">Sign Up</Link>
          </span>
        </p>
      </div>
    </>
  );
}
