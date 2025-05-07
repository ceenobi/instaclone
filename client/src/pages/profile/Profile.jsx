import { useParams, Link, NavLink } from "react-router";
import { useAuth } from "../../store";
import MetaArgs from "../../components/MetaArgs";
import ProfileImage from "./components/ProfileImage";
import { followUser, getAUser } from "../../api/auth";
import useFetch from "../../hooks/useFetch";
import { DataSpinner } from "../../components/Spinner";
import EditProfile from "./components/EditProfile";
import { lazy, useState, Suspense } from "react";
import { toast } from "sonner";
import handleError from "../../utils/handleError";
const Posts = lazy(() => import("./components/Posts"));
const Saved = lazy(() => import("./components/Saved"));
const Likes = lazy(() => import("./components/Likes"));

export default function Profile() {
  const { username } = useParams();
  const { accessToken, user, setUser } = useAuth();
  const { data, loading, setData } = useFetch({
    apiCall: getAUser,
    params: [username, accessToken],
  });
  const [followLoading, setFollowLoading] = useState(false);
  const [active, setActive] = useState(0);
  console.log(data);

  const profileLinks = [
    {
      icon: <i className="ri-layout-grid-line"></i>,
      name: "Posts",
    },
    {
      icon: <i className="ri-heart-line"></i>,
      name: "Likes",
    },
    {
      icon: <i className="ri-bookmark-line"></i>,
      name: "Saved",
    },
  ];

  const toggleFollowUser = async (followerId) => {
    setFollowLoading(true);
    try {
      const res = await followUser(followerId, accessToken);
      if (res.status === 200) {
        toast.success(res.data.message);
        setUser(res.data.user);
        setData((prev) => ({
          ...prev,
          user: res.data.followedUser,
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
      <MetaArgs
        title={`Your InstaShots profile - (@${username})`}
        content="Profile page"
      />
      {loading ? (
        <DataSpinner />
      ) : (
        <>
          <div className="py-5 px-4 lg:px-8 max-w-[950px] xl:max-w-[1024px] mx-auto">
            <div className="mt-2 grid md:grid-cols-12 gap-4 md:gap-8 max-w-[700px] justify-center mx-auto px-4">
              <div className="md:col-span-4">
                <div className="flex gap-6">
                  <ProfileImage data={data} user={user} setData={setData} />
                  {/* mobile */}
                  <div className="md:hidden">
                    <h1 className="text-lg font-semibold">{username}</h1>
                    <div className="mt-2 flex items-center gap-4">
                      {user?.username === data?.user?.username && (
                        <EditProfile setData={setData} />
                      )}
                      {user?._id !== data?.user?._id && (
                        <button
                          className="btn bg-fuchsia-900 focus:outline-none w-[120px] text-white"
                          title={
                            data?.user?.followers?.includes(user?._id)
                              ? "Unfollow"
                              : "Follow"
                          }
                          onClick={() => toggleFollowUser(data?.user?._id)}
                          disabled={followLoading}
                        >
                          {followLoading ? (
                            <span className="loading loading-spinner loading-sm"></span>
                          ) : data?.user?.followers?.includes(user?._id) ? (
                            "Following"
                          ) : (
                            "Follow"
                          )}
                        </button>
                      )}
                      <button className="btn btn-soft btn-neutral focus:outline-none w-[120px] cursor-not-allowed">
                        Verified <i className="ri-verified-badge-fill"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="md:col-span-8">
                {/* large screen */}
                <div className="hidden md:flex items-center gap-4">
                  <h1 className="text-lg font-semibold flex-1">{username}</h1>
                  <div className="flex items-center gap-4">
                    {user?.username === data?.user?.username && (
                      <EditProfile setData={setData} />
                    )}
                    {user?._id !== data?.user?._id && (
                      <button
                        className="btn bg-fuchsia-900 focus:outline-none w-[120px] text-white"
                        title={
                          data?.user?.followers?.includes(user?._id)
                            ? "Unfollow"
                            : "Follow"
                        }
                        onClick={() => toggleFollowUser(data?.user?._id)}
                        disabled={followLoading}
                      >
                        {followLoading ? (
                          <span className="loading loading-spinner loading-sm"></span>
                        ) : data?.user?.followers?.includes(user?._id) ? (
                          "Following"
                        ) : (
                          "Follow"
                        )}
                      </button>
                    )}
                    <button className="btn btn-soft btn-neutral focus:outline-none w-[120px] cursor-not-allowed">
                      Verified <i className="ri-verified-badge-fill"></i>
                    </button>
                  </div>
                </div>
                <div className="hidden mt-6 md:flex items-center">
                  <h1 className="text-lg flex-1">
                    <span className="font-bold mr-2">
                      {data?.userPostsCreated?.length}
                    </span>
                    <span className="text-gray-500">Posts</span>
                  </h1>
                  <div className="flex items-center gap-4 text-center">
                    <Link to={`/profile/${username}/followers`}>
                      <h1 className="text-lg w-[130px] cursor-pointer">
                        <span className="font-bold">
                          {data?.user?.followers?.length}
                        </span>
                        <span className="text-gray-500 ml-1">Followers</span>
                      </h1>
                    </Link>
                    <Link to={`/profile/${username}/following`}>
                      <h1 className="text-lg w-[130px] cursor-pointer">
                        <span className="font-bold">
                          {data?.user?.following?.length}
                        </span>
                        <span className="text-gray-500 ml-1">Following</span>
                      </h1>
                    </Link>
                  </div>
                </div>
                <h1 className="text-sm font-bold my-2">
                  {data?.user?.fullname}
                </h1>
                <p className="text-md">
                  {data?.user?.bio || "Like what you see, my profile"}
                </p>
              </div>
            </div>
          </div>
          <div className="py-5 px-4 lg:px-8 max-w-[950px] mx-auto">
            <div className="flex justify-center items-center gap-6 px-4 md:px-0">
              {profileLinks.map(({ name, icon }, index) => (
                <div key={name}>
                  <div
                    className="flex flex-col justify-center items-center cursor-pointer"
                    role="button"
                    onClick={() => {
                      setActive(index);
                    }}
                  >
                    <span
                      className={`mb-2 mt-0 p-3 flex gap-2 items-center ${
                        active === index ? "font-semibold text-fuchsia-900" : ""
                      }`}
                    >
                      {icon}
                      {name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {/* Show posts if:
                1. Profile is public OR
                2. User is viewing their own profile OR
                4>If user profile is false, and owner is same still show
                3. User is following the profile owner */}
            {active === 0 && (
              <>
                <Suspense
                  fallback={
                    <div className="text-center mt-20">
                      <span className="loading loading-bars loading-md text-secondary"></span>
                    </div>
                  }
                >
                  <Posts posts={data?.userPostsCreated} />
                </Suspense>
              </>
            )}
            {active === 1 && (
              <Suspense
                fallback={
                  <div className="text-center mt-20">
                    <span className="loading loading-bars loading-md text-secondary"></span>
                  </div>
                }
              >
                <Likes
                  likedPosts={data?.userLikedPosts}
                  user={user}
                  profile={data.user}
                />
              </Suspense>
            )}
            {active === 2 && (
              <Suspense
                fallback={
                  <div className="text-center mt-20">
                    <span className="loading loading-bars loading-md text-secondary"></span>
                  </div>
                }
              >
                <Saved
                  savedPosts={data?.userSavedPosts}
                  user={user}
                  profile={data.user}
                />
              </Suspense>
            )}
          </div>
        </>
      )}
    </>
  );
}
