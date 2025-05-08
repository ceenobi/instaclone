import logo from "../../assets/logo1.svg";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import {
  validateEmail,
  validatefullname,
  validatePassword,
  validateUsername,
} from "../../utils/formValidate";
import { useState } from "react";
import MetaArgs from "../../components/MetaArgs";
import { registerUser } from "../../api/auth";
import { toast } from "sonner";
import { useAuth } from "../../store";
import handleError from "../../utils/handleError";

export default function Register() {
  const [isVisible, setIsVisible] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const { setAccessToken } = useAuth();
  const navigate = useNavigate();

  const togglePassword = () => {
    setIsVisible((prev) => !prev);
  };

  const onFormSubmit = async (data) => {
    try {
      const res = await registerUser(data);
      if (res.status === 201) {
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
        title="Sign up to InstaShots"
        content="Get access to InstaShots"
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
          <div className="mb-4">
            <label className="floating-label">
              <span>Email</span>
              <input
                type="email"
                placeholder="Email"
                className="input input-md w-full"
                id="email"
                {...register("email", {
                  validate: (value) => validateEmail(value),
                })}
              />
            </label>
            {errors.email && (
              <span className="text-xs text-red-600">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="mb-4">
            <label className="floating-label">
              <span>Fullname</span>
              <input
                type="text"
                placeholder="Full name"
                className="input input-md w-full"
                id="fullname"
                {...register("fullname", {
                  validate: (value) => validatefullname(value),
                })}
              />
            </label>
            {errors.fullname && (
              <span className="text-xs text-red-600">
                {errors.fullname.message}
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
            className="mt-6 btn  bg-[#8D0D76] w-full text-white"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? <span className="loading loading-spinner"></span> : "Sign Up"}
          </button>
          <p className="mt-5 text-center">
            By signing up, you agree to our Term, data policy
          </p>
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
