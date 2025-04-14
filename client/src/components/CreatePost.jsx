import { useState } from "react";
import CreatePostModal from "./CreatePostModal";

export default function CreatePost() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="tooltip tooltip-right flex gap-3 items-center p-2 cursor-pointer hover:font-bold hover:text-zinc-800 hover:transition duration-150 ease-out rounded-lg z-50 hover:bg-zinc-100"
        data-tip="Create Post"
        onClick={() => setIsModalOpen(true)}
      >
        <i className="ri-add-box-line text-2xl"></i>
        <span className="text-lg">Create post</span>
      </div>
      <CreatePostModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
