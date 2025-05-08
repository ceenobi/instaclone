import { useLocation, useParams, useNavigate, Link } from "react-router";
import { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import useFetch from "../../hooks/useFetch";
import {
  getAPost,
  deletePost,
  handlePostLikes,
  handleSavePost,
} from "../../api/post";
import { useAuth, usePosts } from "../../store";
import MetaArgs from "../../components/MetaArgs";
import useSlideControl from "../../hooks/useSlideControl";
import LazyLoadComponent from "../../components/LazyLoadImage";
import TimeAgo from "timeago-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import handleError from "../../utils/handleError";
import { createComment, deleteComment, likeComment } from "../../api/comment";

export default function Comments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [optionsModal, setOptionsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();
  const path = location.pathname === `/post/${id}`;
  const { accessToken, user } = useAuth();
  const { setPosts } = usePosts();
  const {
    data,
    setData,
    loading: isLoading,
  } = useFetch({
    apiCall: getAPost,
    params: [id, accessToken],
  });
  const { comments, post } = data ?? {};
  const [isPostLiked, setIsPostLiked] = useState(false);
  const [isPostSaved, setIsPostSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const { currentImageIndex, handlePrevious, handleNext } = useSlideControl(
    post?.media
  );

  useEffect(() => {
    if (post) {
      setIsPostLiked(post.likes.some((id) => id._id === user?._id));
      setIsPostSaved(post.savedBy.some((id) => id._id === user?._id));
      setLikeCount(post.likes.length || 0);
    }
  }, [post, user?._id]);

  useEffect(() => {
    if (path) {
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
      navigate("/");
    }
  }, [navigate, path]);

  const handleClose = () => {
    setIsModalOpen(false);
    navigate("/");
  };

  const formatTime = (time) => {
    return <TimeAgo datetime={time} locale="en-US" />;
  };

  const deleteAPost = async () => {
    setLoading(true);
    try {
      const res = await deletePost(id, accessToken);
      if (res.status === 200) {
        toast.success(res.data.message);
        setPosts((prevPosts) => prevPosts.filter((p) => p._id !== id));
        navigate("/");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const postComment = async (data) => {
    try {
      const res = await createComment(id, data, accessToken);
      if (res.status === 201) {
        toast.success(res.data.message);
        reset({ comment: "" });
        setData((prev) => ({
          ...prev,
          comments: [res.data.comment, ...(prev?.comments || [])],
        }));
      }
    } catch (error) {
      handleError(error);
    }
  };

  const deleteUserComment = async (commentId) => {
    setLoading(true);
    try {
      const res = await deleteComment(commentId, accessToken);
      if (res.status === 200) {
        toast.success(res.data.message);
        setData((prev) => ({
          ...prev,
          comments: prev.comments.filter((c) => c._id !== commentId),
        }));
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const likeAComment = async (commentId) => {
    try {
      const res = await likeComment(commentId, accessToken);
      if (res.status === 200) {
        setData((prev) => ({
          ...prev,
          comments: prev.comments.map((c) =>
            c._id === commentId
              ? {
                  ...c,
                  likes: res.data.comment.likes,
                }
              : c
          ),
        }));
      }
    } catch (error) {
      handleError(error);
    }
  };

  const likePost = async () => {
    try {
      const res = await handlePostLikes(id, accessToken);
      if (res.status === 200) {
        toast.success(res.data.message, { id: "likePost" });
        setIsPostLiked(res.data.post.likes.some((id) => id._id === user?._id));
        setLikeCount(res.data.post.likes.length);
        setPosts((prev) =>
          prev.map((post) => (post._id === id ? res.data.post : post))
        );
      }
    } catch (error) {
      handleError(error);
    }
  };

  const savePost = async () => {
    try {
      const res = await handleSavePost(id, accessToken);
      if (res.status === 200) {
        toast.success(res.data.message, { id: "savePost" });
        setIsPostSaved(
          res.data.post.savedBy.some((id) => id._id === user?._id)
        );
        setPosts((prev) =>
          prev.map((post) => (post._id === id ? res.data.post : post))
        );
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <MetaArgs
        title={post?.userId?.username - post?.caption}
        content="View post details"
      />
      <Modal
        isOpen={isModalOpen}
        id="postModalComent"
        classname="w-[90%] max-w-[1024px] mx-auto p-0"
      >
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-30"
          type="button"
          onClick={handleClose}
        >
          <i className="ri-close-line text-xl"></i>
        </button>
        {isLoading ? (
          <div className="flex justify-center items-center h-[700px]">
            <span className="loading loading-spinner"></span>
          </div>
        ) : (
          <div className="grid grid-cols-12 h-[700px] overflow-hidden">
            <div className="col-span-12 lg:col-span-6">
              <figure className="relative overflow-hidden">
                {post?.media?.map((item, index) => (
                  <div
                    key={index}
                    className={`transition-transform duration-300 ease-in-out transform ${
                      index === currentImageIndex
                        ? "fade-enter fade-enter-active"
                        : "fade-exit fade-exit-active"
                    }`}
                  >
                    {index === currentImageIndex && (
                      <>
                        {item.endsWith(".mp4") || item.endsWith(".webm") ? (
                          <>
                            <video
                              src={item}
                              controls={false}
                              loop
                              playsInline
                              autoPlay
                              className="w-full h-full lg:h-[550px] object-contain aspect-sqaure md:rounded-md"
                            />
                          </>
                        ) : (
                          <LazyLoadComponent
                            image={item}
                            classname="w-full h-[300px] lg:h-[700px] object-cover aspect-square shrink-0"
                          />
                        )}
                      </>
                    )}
                  </div>
                ))}
                <>
                  {currentImageIndex < post?.media?.length - 1 && (
                    <button
                      onClick={handleNext}
                      className="absolute right-2 top-1/2 btn btn-circle btn-sm opacity-75 hover:opacity-100"
                    >
                      <i className="ri-arrow-right-s-line text-lg"></i>
                    </button>
                  )}
                </>
                <>
                  {currentImageIndex > 0 && (
                    <button
                      onClick={handlePrevious}
                      className="absolute left-2 top-1/2 btn btn-circle btn-sm opacity-75 hover:opacity-100"
                    >
                      <i className="ri-arrow-left-s-line text-lg"></i>
                    </button>
                  )}
                </>
                {post?.media?.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                    {post?.media?.map((_, index) => (
                      <div
                        key={index}
                        className={`w-[8px] h-[8px] rounded-full ${
                          index === currentImageIndex
                            ? "bg-fuchsia-900"
                            : "bg-white"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </figure>
            </div>
            <div className="col-span-12 lg:col-span-6 lg:relative h-auto overflow-auto">
              <div className="p-4 w-full mb-1 flex items-center justify-between border-b border-gray-300">
                <Link
                  className="flex gap-2 items-center"
                  to={`/profile/${post?.userId?.username}`}
                >
                  <div className="avatar avatar-placeholder">
                    <div className="w-10 rounded-full border border-gray-300">
                      {post?.userId?.profilePicture ? (
                        <img
                          src={post?.userId?.profilePicture}
                          alt={post?.userId?.username}
                        />
                      ) : (
                        <span className="text-3xl">
                          {post?.userId?.username?.charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="font-bold">{post?.userId?.username}</p>
                </Link>
                {user?._id === post?.userId?._id && (
                  <i
                    className="ri-more-line text-2xl cursor-pointer lg:mr-10"
                    role="button"
                    title="see options"
                    onClick={() => setOptionsModal(true)}
                  ></i>
                )}
                <Modal
                  isOpen={optionsModal}
                  id="options_Modal"
                  classname="w-[90%] max-w-[400px] mx-auto p-0"
                  onClose={() => setOptionsModal(false)}
                >
                  <div className="text-center p-3">
                    <p
                      onClick={deleteAPost}
                      className="cursor-pointer"
                      role="button"
                    >
                      {loading ? "Deleting..." : "Delete"}
                    </p>
                    <div className="divider my-2"></div>
                    <Link to={`/post/edit/${id}`}>Edit</Link>
                    <div className="divider my-2"></div>
                    <p
                      className="font-medium cursor-pointer"
                      role="button"
                      onClick={() => setOptionsModal(false)}
                    >
                      Cancel
                    </p>
                  </div>
                </Modal>
              </div>
              <div className="mt-4 px-4 h-[470px] overflow-auto">
                <div className="flex items-start gap-3">
                  <div className="avatar avatar-placeholder">
                    <div className="w-10 rounded-full border border-gray-300">
                      {post?.userId?.profilePicture ? (
                        <img
                          src={post?.userId?.profilePicture}
                          alt={post?.userId?.username}
                        />
                      ) : (
                        <span className="text-3xl">
                          {post?.userId?.username?.charAt(0)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <div>
                      <Link
                        to={`/profile/${post?.userId?.username}`}
                        className="text-sm font-bold mb-0 mr-2"
                      >
                        {post?.userId?.username}
                      </Link>
                      <span className="text-sm mb-0 font-medium">
                        {post?.caption}{" "}
                        {post?.description ? `- ${post?.description}` : ""}
                      </span>
                    </div>
                    {post?.tags && (
                      <div className="flex flex-wrap items-center gap-2">
                        {post?.tags.map((tag, index) => (
                          <Link
                            to={`/tag/${tag}`}
                            className="text-fuchsia-900 text-sm"
                            key={index}
                          >
                            #{tag}
                          </Link>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-gray-500">
                      {formatTime(post?.createdAt)}
                    </p>
                  </div>
                </div>
                {comments?.length === 0 && (
                  <p className="text-center text-sm my-8">
                    No comments yet. Be the first to make a comment.
                  </p>
                )}
                {comments?.map((comment) => (
                  <div key={comment._id} className="my-4 px-1">
                    <div className="flex gap-4">
                      <Link to={`/profile/${comment?.user?.username}`}>
                        <div className="avatar avatar-placeholder">
                          <div className="w-9 rounded-full border border-gray-300">
                            {comment?.user?.profilePicture ? (
                              <img
                                src={comment?.user?.profilePicture}
                                alt={comment?.user?.username}
                                loading="lazy"
                              />
                            ) : (
                              <span className="text-xl">
                                {comment?.user?.username?.charAt(0)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                      <div className="flex-1">
                        <div>
                          <Link className="text-sm font-semibold mb-0 mr-2">
                            {comment?.user?.username}
                          </Link>
                          <span className="text-sm mb-0 font-medium">
                            {comment?.comment}
                          </span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <p className="text-xs text-gray-500">
                            {formatTime(comment?.createdAt)}
                          </p>
                          <p className="text-xs text-gray-500 font-semibold">
                            {comment?.likes?.length} likes
                          </p>
                          {comment?.user?._id === user?._id && (
                            <i
                              className="ri-delete-bin-7-line cursor-pointer text-gray-500"
                              role="button"
                              title="Delete comment"
                              onClick={() => deleteUserComment(comment._id)}
                            ></i>
                          )}
                        </div>
                      </div>
                      <i
                        className={`${
                          comment?.likes?.includes(user?._id)
                            ? "ri-heart-fill text-red-700"
                            : "ri-heart-line"
                        } cursor-pointer`}
                        role="button"
                        onClick={() => likeAComment(comment._id)}
                      ></i>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white relative z-30 w-full border-t border-gray-300 py-2">
                <div className="px-4 flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <i
                      className={`${
                        isPostLiked
                          ? "ri-heart-fill text-red-700"
                          : "ri-heart-line"
                      } cursor-pointer text-2xl`}
                      role="button"
                      title={isPostLiked ? "Unlike" : "Like"}
                      onClick={likePost}
                    ></i>
                    <label htmlFor="comment">
                      <i
                        className="ri-chat-3-line text-2xl cursor-pointer"
                        title="comment"
                      ></i>
                    </label>
                  </div>
                  <i
                    className={`${
                      isPostSaved
                        ? "ri-bookmark-fill text-[var(--wine-red)]"
                        : "ri-bookmark-line"
                    } cursor-pointer text-2xl`}
                    role="button"
                    title={isPostSaved ? "Unsave" : "Save"}
                    onClick={savePost}
                  ></i>
                </div>
                <div className="mt-2 px-4 flex gap-2">
                  {post?.likes?.slice(0, 1).map((like, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Link to={`/profile/${like?.username}`}>
                        <div className="avatar-group -space-x-6">
                          <div className="avatar avatar-placeholder rounded-full border border-gray-300">
                            <div className="w-5">
                              {like?.profilePicture ? (
                                <img
                                  src={like?.profilePicture}
                                  alt={like?.username}
                                />
                              ) : (
                                <span>{like?.username?.charAt(0)}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Link>
                      <p className="text-sm">
                        liked by{" "}
                        <Link
                          to={`/profile/${like?.username}`}
                          className="font-medium"
                        >
                          {like?.username}
                        </Link>{" "}
                        and{" "}
                        <span>{likeCount > 1 ? likeCount - 1 : 0} others</span>
                      </p>
                    </div>
                  ))}
                </div>
                <form
                  className="relative px-4 mt-4"
                  onSubmit={handleSubmit(postComment)}
                >
                  <textarea
                    className="w-full border-0 h-[40px] focus:border-0 focus:outline-none text-sm"
                    placeholder="Add a comment..."
                    id="comment"
                    name="comment"
                    {...register("comment", { required: true })}
                  ></textarea>
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="btn btn-ghost text-[var(--wine-red)] font-bold absolute inset-y-0 right-0"
                  >
                    {isSubmitting ? "Posting..." : "Post"}
                  </button>
                </form>
                {errors?.comment && (
                  <p className="text-xs text-red-600 px-4">
                    Comment is required
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
