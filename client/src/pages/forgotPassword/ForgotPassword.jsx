import { useForm } from "react-hook-form";
import MetaArgs from "../../components/MetaArgs";
import logo from "../../assets/logo1.svg";
import { validateEmail } from "../../utils/formValidate";
import { Link } from "react-router";
import { sendForgotPasswordMail } from "../../api/auth";
import handleError from "../../utils/handleError";
import { toast } from "sonner";

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onFormSubmit = async (data) => {
    try {
      const res = await sendForgotPasswordMail(data);
      if (res.status === 200) {
        toast.success(res.data.message);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <MetaArgs
        title="Forgot your InstaShot password"
        content="Recover your InstaShots account"
      />
      <div className="w-[90vw] md:w-[350px] border rounded-sm border-[#d7d3d3] py-[30px] px-[28px]">
        <div className="flex justify-center">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <h1 className="mt-6 text-xl font-semibold text-center">
          Forgot your password
        </h1>
        <p className="text-sm text-center">
          Enter your email to recover your account
        </p>
        <form
          className="md:max-w-[300px] mx-auto mt-6 bg-white"
          onSubmit={handleSubmit(onFormSubmit)}
        >
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
          <button
            className="btn bg-[var(--wine-red)] rounded-md w-full text-white"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Recover"
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
