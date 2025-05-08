import { useAuth, usePosts } from "../../store";
import MetaArgs from "../../components/MetaArgs";
import Container from "../../components/Container";
import Skeleton from "../../components/Skeleton";
import { lazy, Suspense, useEffect, useState } from "react";
import { Link } from "react-router";
import { followUser, getRandomUsers } from "../../api/auth";
import useFetch from "../../hooks/useFetch";
import { toast } from "sonner";
import handleError from "../../utils/handleError";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
const Card = lazy(() => import("./components/Card"));

export default function Home() {
  const { posts, loading, setPage, data: postsData, page, error } = usePosts();
  const { user, handleLogout, accessToken, setUser } = useAuth();
  const { data } = useFetch({
    apiCall: getRandomUsers,
    params: [accessToken],
  });
  const [active, setActive] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);
  const [allPosts, setAllPosts] = useState(posts || []);
  const lastPostRef = useInfiniteScroll({
    loading: loadingMorePosts,
    hasMore: postsData?.pagination?.hasMore,
    setPage: (pageUpdater) => {
      setLoadingMorePosts(true);
      setPage((prev) => {
        const next =
          typeof pageUpdater === "function" ? pageUpdater(prev) : pageUpdater;
        return next;
      });
    },
  });

  useEffect(() => {
    if (!loading) setLoadingMorePosts(false);
  }, [allPosts, loading]);

  useEffect(() => {
    if (!postsData?.posts) return;

    if (page === 1) {
      setAllPosts(postsData.posts);
    } else {
      setAllPosts((prev) => {
        const existingPostIds = new Set(prev.map((post) => post._id));
        const postsToAdd = postsData.posts.filter(
          (post) => !existingPostIds.has(post._id)
        );
        return [...prev, ...postsToAdd];
      });
    }
  }, [postsData?.posts, page]);

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
      <MetaArgs title="Your Instashot feed" content="discover posts" />
      <Container classname="container">
        <div className="grid grid-cols-12 gap-4 justify-between">
          {/* post card div*/}
          <div className="col-span-12 lg:col-span-8">
            <div className="w-full max-w-[600px] 2xl:max-w-[700px] mx-auto">
              {loading ? (
                <Skeleton />
              ) : (
                <div className="w-full md:max-w-[450px] 2xl:max-w-[600px] mx-auto">
                  {allPosts?.length > 0 ? (
                    <Suspense fallback={<Skeleton />}>
                      {allPosts?.map((post, index) => {
                        const isLast = index === allPosts.length - 1;
                        return (
                          <div
                            ref={isLast ? lastPostRef : undefined}
                            key={post._id}
                          >
                            <Card post={post} />
                          </div>
                        );
                      })}
                      {loadingMorePosts && (
                        <div className="flex justify-center my-4">
                          <span className="loading loading-spinner loading-md text-secondary"></span>
                        </div>
                      )}
                    </Suspense>
                  ) : (
                    <p className="my-8 text-center text-lg font-bold">
                      No posts to display
                    </p>
                  )}
                </div>
              )}
              {error && (
                <span className="text-center text-red-500 my-4 text-sm">{error}</span>
              )}
            </div>
          </div>
          {/* //other */}
          <div className="hidden lg:block col-span-12 lg:col-span-4">
            <div className="mt-2 flex justify-between items-center">
              <Link
                to={`/profile/${user?.username}`}
                className="flex items-center gap-4"
              >
                <div className="avatar avatar-placeholder">
                  <div
                    className={`w-10 rounded-full ${
                      !user?.profilePicture ? "border-secondary" : ""
                    }`}
                  >
                    {user?.profilePicture ? (
                      <img src={user?.profilePicture} alt={user?.username} />
                    ) : (
                      <span className="text-3xl">
                        {user?.username?.charAt(0)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-start">
                  <p className="font-semibold">{user?.username}</p>
                  <p className="text-sm">{user?.fullname}</p>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                className="btn bg-red-700 rounded-md text-white"
              >
                Logout
              </button>
            </div>
            {data?.randomUsers?.length > 0 && (
              <div className="mt-10">
                <h1 className="text-gray-600 font-semibold">
                  Suggested for you
                </h1>
                {data?.randomUsers.map((item, index) => (
                  <div
                    className="my-4 flex justify-between items-center"
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
              </div>
            )}
            <h1 className="mt-10 text-sm text-gray-600">
              &copy; {new Date().getFullYear()} Instashots from Cobi
            </h1>
          </div>
        </div>
      </Container>
    </>
  );
}
