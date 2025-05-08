import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import Modal from "../../components/Modal";
import useFetch from "../../hooks/useFetch";
import { getAPost, updatePost } from "../../api/post";
import { useAuth } from "../../store";
import LazyLoadComponent from "../../components/LazyLoadImage";
import useTags from "../../hooks/useTags";
import { toast } from "sonner";
import handleError from "../../utils/handleError";

export default function EditPost() {
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname === `/post/edit/${id}`;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm();
  const { accessToken } = useAuth();
  const { data, loading } = useFetch({
    apiCall: getAPost,
    params: [id, accessToken],
  });
  const { tags, setTags, handleTags, removeTag } = useTags();

  useEffect(() => {
    if (path) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [path]);

  const { post } = data ?? {};

  useEffect(() => {
    if (post) {
      setValue("caption", post.caption);
      setValue("description", post.description);
    }
  }, [setValue, post]);

  useEffect(() => {
    if (post?.tags && post?.tags.length > 0) {
      setTags([...post.tags]);
    }
  }, [post?.tags, setTags]);

  const filterMedia =
    post?.media?.filter(
      (item) => !item.endsWith(".mp4") && !item.endsWith(".webm")
    ) || [];

  const updatePostDetails = async (data) => {
    try {
      const res = await updatePost(id, data, accessToken);
      if (res.status === 200) {
        toast.success(res.data.message, { id: "updatePost" });
        setIsOpen(false);
        setTags([]);
        navigate(`/post/${id}`);
      }
    } catch (error) {
      handleError(error);
    }
  };

  //delete post to refresh data
  //remove setData from useFetch
  //check create post modal

  return (
    <>
      <Modal
        isOpen={isOpen}
        id="editModalComment"
        classname="w-[90%] max-w-[1024px] mx-auto p-0"
      >
        {" "}
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          type="button"
          onClick={() => {
            setIsOpen(false);
            navigate(`/post/${id}`);
          }}
        >
          <i className="ri-close-line text-lg"></i>
        </button>
        {loading ? (
          <div className="flex justify-center items-center h-[700px]">
            <span className="loading loading-spinner"></span>
          </div>
        ) : (
          <div className="grid grid-cols-12 h-[700px] overflow-hidden">
            <div className="col-span-12 md:col-span-6">
              <>
                <LazyLoadComponent
                  image={filterMedia[0]}
                  classname="w-full h-[300px] lg:h-[700px] object-cover aspect-square shrink-0"
                />
              </>
            </div>
            <div className="mt-6 lg:mt-20 col-span-12 md:col-span-6 px-5 md:px-10 py-4">
              <h1 className="text-center font-bold mb-6">Edit post</h1>
              <form onSubmit={handleSubmit(updatePostDetails)}>
                <div>
                  <label className="floating-label">
                    <span>Caption</span>
                    <input
                      type="text"
                      placeholder="Caption"
                      className="input input-md w-full"
                      {...register("caption", { required: true })}
                    />
                  </label>
                  {errors?.caption && (
                    <span className="text-xs text-red-600">
                      Give your post a caption
                    </span>
                  )}
                </div>
                <div className="my-6">
                  <label className="floating-label">
                    <span>Description</span>
                    <textarea
                      placeholder="Description"
                      className="textarea textarea-md w-full"
                      id="description"
                      {...register("description")}
                    ></textarea>
                  </label>
                </div>
                <div>
                  <label className="floating-label">
                    <span>Tags</span>
                    <input
                      type="text"
                      className="input input-md w-full"
                      id="tags"
                      placeholder="Add Tags, press enter key to add a tag"
                      onKeyDown={handleTags}
                    />
                  </label>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag, index) => (
                    <div
                      className="badge bg-black gap-2 cursor-pointer text-gray-200"
                      key={index}
                      onClick={() => removeTag(index)}
                    >
                      {tag}
                      <span className="text-white">x</span>
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  className="btn bg-[#8D0D76] text-white w-full mt-8"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating post..." : "Update"}
                </button>
              </form>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
