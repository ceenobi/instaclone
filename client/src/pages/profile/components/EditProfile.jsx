import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../store";
import Modal from "../../../components/Modal";
import {
  validateEmail,
  validatefullname,
  validateUsername,
} from "../../../utils/formValidate";
import { updateProfile } from "../../../api/auth";
import handleError from "../../../utils/handleError";
import { toast } from "sonner";

export default function EditProfile({ setData }) {
  const [isOpen, setIsOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();
  const { user, setUser, accessToken } = useAuth();

  useEffect(() => {
    setValue("username", user.username);
    setValue("email", user.email);
    setValue("fullname", user.fullname);
    setValue("bio", user.bio || "");
  }, [user, setValue]);

  const onFormSubmit = async (data) => {
    try {
      const res = await updateProfile(data, accessToken);
      if (res.status === 200) {
        toast.success(res.data.message);
        setUser(res.data.user);
        setData((prev) => ({
          ...prev,
          user: res.data.user,
        }));
        setIsOpen(false);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      {" "}
      <button
        className="btn bg-[var(--wine-red)] rounded-md text-white btn-soft focus:outline-none w-[120px]"
        onClick={() => setIsOpen(true)}
      >
        Edit profile
      </button>
      <Modal
        isOpen={isOpen}
        id="editProfileModal"
        title="Edit Profile"
        classname="w-[90%] max-w-[500px] mx-auto py-6 px-0"
      >
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          type="button"
          onClick={() => setIsOpen(false)}
        >
          <i className="ri-close-line text-lg"></i>
        </button>
        <form
          className="mt-6 w-[90%] max-w-[400px] mx-auto"
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
          <div className="mb-4">
            <label className="floating-label">
              <span>Bio</span>
              <textarea
                type="text"
                placeholder="Bio"
                className="textarea textarea-md w-full"
                id="bio"
                {...register("bio")}
              ></textarea>
            </label>
          </div>
          <button
            className="mt-6 btn  bg-[#8D0D76] w-full text-white"
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
      </Modal>
    </>
  );
}
