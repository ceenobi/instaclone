import { useNavigate } from "react-router";
import MetaArgs from "../../components/MetaArgs";
import { deleteAccount } from "../../api/auth";
import { useAuth } from "../../store";
import { toast } from "sonner";
import handleError from "../../utils/handleError";
import { useState } from "react";

export default function DeleteAccount() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { accessToken, handleLogout } = useAuth();
  const navigate = useNavigate();
  const redirect = () => {
    navigate("/");
  };

  const deleteUser = async () => {
    setIsSubmitting(true);
    try {
      const res = await deleteAccount(accessToken);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <MetaArgs title="Delete Account" content="Delete your account" />
      <h1 className="text-xl text-center my-6 font-bold">Delete Account</h1>
      <div className="border-2 border-zinc-200 p-4 rounded-lg w-[85vw] md:w-[500px] mx-auto">
        <div className="rounded-lg p-3">
          <p className="text-md font-semibold">Notice</p>
          <span className="text-sm mt-4">
            This action is irreversible and will delete your account and all of
            your posts, stories, and comments. This action cannot be undone.
          </span>
        </div>
        <div className="mt-4 flex gap-4 items-center justify-end">
          <button className="btn btn-neutral btn-outline" onClick={redirect}>
            Cancel
          </button>

          <button
            className="btn bg-red-700 rounded-md text-white w-[120px]"
            type="button"
            disabled={isSubmitting}
            onClick={deleteUser}
          >
            {isSubmitting ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </>
  );
}
