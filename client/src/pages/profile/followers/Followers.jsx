import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router";
import Modal from "../../../components/Modal";
import useFetch from "../../../hooks/useFetch";
import { useAuth } from "../../../store";
import { followUser, getUserFollowers } from "../../../api/auth";
import { toast } from "sonner";
import handleError from "../../../utils/handleError";

export default function Followers() {
  const [isOpen, setIsOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const { username } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { accessToken, user, setUser } = useAuth();
  const { data, loading } = useFetch({
    apiCall: getUserFollowers,
    params: [username, accessToken],
  });

  const path = location.pathname === `/profile/${username}/followers`;

  useEffect(() => {
    if (path) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [path]);

  const toggleFollowUser = async (followerId) => {
    setFollowLoading(true);
    try {
      const res = await followUser(followerId, accessToken);
      if (res.status === 200) {
        toast.success(res.data.message, { id: "follow" });
        setUser((prev) => ({
          ...prev,
          ...res.data.user,
        }));
      }
    } catch (error) {
      handleError(error);
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        id="followersModal"
        title="Followers"
        classname="w-[90%] max-w-[400px] mx-auto py-3 px-0"
      >
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          type="button"
          onClick={() => {
            setIsOpen(false);
            navigate(`/profile/${username}`);
          }}
        >
          <i className="ri-close-line text-lg"></i>
        </button>
        {loading ? (
          <div className="flex justify-center items-center h-[150px] my-4">
            <span className="loading loading-spinner text-center"></span>
          </div>
        ) : (
          <>
            {data?.followers?.length === 0 && (
              <p className="text-center p-3">No followers yet</p>
            )}
            {data?.followers?.map((item, index) => (
              <div
                className="my-3 flex justify-between items-center p-3"
                key={item._id}
              >
                <Link
                  to={`/profile/${item.username}`}
                  className="flex items-center gap-4"
                >
                  <div className=" avatar avatar-placeholder">
                    <div className="w-10 rounded-full border border-gray-300">
                      {item.profilePicture ? (
                        <img
                          src={item.profilePicture}
                          alt={item.username}
                          loading="lazy"
                        />
                      ) : (
                        <span className="text-3xl">
                          {item.username?.charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-start">
                    <p className="font-semibold">{item.username}</p>
                    <p className="text-sm">{item.fullname}</p>
                  </div>
                </Link>
                <button
                  disabled={user?._id === item._id}
                  className="btn bg-[var(--wine-red)] rounded-md w-[110px] text-white"
                  onClick={() => {
                    toggleFollowUser(item._id);
                    setActive(index);
                  }}
                >
                  {active === index && followLoading
                    ? "Updating..."
                    : user?.following?.includes(item._id)
                    ? "Unfollow"
                    : "Follow"}
                </button>
              </div>
            ))}
          </>
        )}
      </Modal>
    </>
  );
}
