import { useState } from "react";
import { useAuth } from "../../store";
import MetaArgs from "../../components/MetaArgs";
import { updateUserPrivacy } from "../../api/auth";
import handleError from "../../utils/handleError";
import { toast } from "sonner";

export default function AccountPrivacy() {
  const [isPublic, setIsPublic] = useState(false);
  const { user, accessToken, setUser } = useAuth();

  const handleToggle = async () => {
    setIsPublic((prev) => !prev);
    try {
      const res = await updateUserPrivacy({ isPublic }, accessToken);
      if (res.status === 200) {
        toast.success(res.data.message);
        setUser(res.data.user);
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <MetaArgs title="Account Privacy" content="Update your account privacy" />
      <h1 className="text-xl text-center my-6 font-bold">Account Privacy</h1>
      <div className="border-2 border-zinc-200 p-4 rounded-lg w-[85vw] md:w-[500px] mx-auto">
        <div className="rounded-lg p-3">
          <p className="text-md font-semibold">Private account</p>
          <span className="text-sm mt-4">
            When your account is public, your profile and posts can be seen by
            anyone. When your account is private, only the followers can see
            what you share, including your photos or hashtag, and your followers
            and following lists. Certain info on your profile, like your profile
            picture and username, is visible to everyone on Instashots.
          </span>
        </div>
        <form className="w-full">
          <div className="mt-4 flex gap-4 items-center justify-end">
            <span className="text-black font-semibold">
              Toggle status: {user?.isPublic ? "Public" : "Private"}
            </span>
            <input
              type="checkbox"
              onChange={handleToggle}
              className="toggle"
              defaultChecked={user?.isPublic}
            />
          </div>
        </form>
      </div>
    </>
  );
}
