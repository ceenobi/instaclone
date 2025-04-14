import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import handleError from "../utils/handleError";
import { createPost } from "../api/post";

export default function CreatePostModal({ isOpen, onClose }) {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm();

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/") || file.type.startsWith("video/");
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      if (!isValidType) {
        toast.error("Only images and videos are allowed");
        return false;
      }
      if (!isValidSize) {
        toast.error("File size must be less than 10MB");
        return false;
      }
      return true;
    });

    setMediaFiles(validFiles);
    
    // Create preview URLs
    const urls = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removeMedia = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    if (mediaFiles.length === 0) {
      toast.error("Please select at least one media file");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("caption", data.caption);
      formData.append("description", data.description);
      formData.append("isPublic", data.isPublic);
      formData.append("tags", data.tags || "");
      
      // Append each media file
      mediaFiles.forEach((file) => {
        formData.append("media", file);
      });

      const res = await createPost(formData);
      if (res.status === 200) {
        toast.success("Post created successfully");
        reset();
        setMediaFiles([]);
        setPreviewUrls([]);
        onClose();
      }
    } catch (error) {
      handleError(error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create New Post</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Media Files
            </label>
            <input
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleMediaChange}
              className="w-full"
            />
            {previewUrls.length > 0 && (
              <div className="mt-2 grid grid-cols-3 gap-2">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeMedia(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      <i className="ri-close-line"></i>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Caption
            </label>
            <input
              type="text"
              {...register("caption", { required: "Caption is required" })}
              className="w-full p-2 border rounded"
            />
            {errors.caption && (
              <span className="text-red-500 text-sm">{errors.caption.message}</span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              {...register("description", { required: "Description is required" })}
              className="w-full p-2 border rounded"
              rows={3}
            />
            {errors.description && (
              <span className="text-red-500 text-sm">
                {errors.description.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (space separated)
            </label>
            <input
              type="text"
              {...register("tags")}
              placeholder="e.g. travel nature photography"
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              {...register("isPublic")}
              className="mr-2"
              defaultChecked
            />
            <label className="text-sm text-gray-700">Make post public</label>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#8D0D76] text-white rounded"
            >
              {isSubmitting ? "Creating..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 