import Comment from "../model/comment.js";
import Post from "../model/post.js";
import User from "../model/user.js";
import createHttpError from "http-errors";

export const createComment = async (req, res, next) => {
  const { comment } = req.body;
  const { id: userId } = req.user;
  const { postId } = req.params;
  try {
    if (!postId) {
      return next(createHttpError(400, "Post id is required"));
    }
    //find post we want to comment on
    const post = await Post.findById(postId);
    if (!post) {
      return next(createHttpError(404, "Post not found"));
    }
    const newComment = await Comment.create({
      user: userId,
      postId: post._id,
      comment,
    });
    //populate user details
    await newComment.populate("user", "username profilePicture");
    res.status(201).json({
      success: true,
      message: "Comment posted",
      comment: newComment,
    });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  const { id: postId } = req.params;
  try {
    if (!postId) {
      return next(createHttpError(400, "Post id is required"));
    }
    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .populate("user", "username profilePicture");
    res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    next(error);
  }
};
