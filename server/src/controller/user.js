import User from "../model/user.js";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { sendMail } from "../config/emailService.js";
import { generateAccessToken } from "../config/generateToken.js";
import Post from "../model/post.js";
import Comment from "../model/comment.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../config/cloudinary.js";

export const registerUser = async (req, res, next) => {
  const { username, email, fullname, password } = req.body; //get info from client via form
  try {
    if (!username || !email || !fullname || !password) {
      return next(createHttpError(400, "All Fields are required"));
    }
    //check if user already exists in db
    const [existingUsername, existingEmail] = await Promise.all([
      User.findOne({ username: username }),
      User.findOne({ email: email }),
    ]);
    if (existingUsername) {
      return next(createHttpError(409, "Username already exists"));
    }
    if (existingEmail) {
      return next(createHttpError(409, "Email already exists"));
    }
    //proceed to register user if user dont exists
    const salt = await bcrypt.genSalt(10); //encryption mechanism for to handle password
    const hashedPassword = await bcrypt.hash(password, salt); //encrypt the user password
    //proceed to create the user
    const user = await User.create({
      username,
      email,
      fullname,
      password: hashedPassword,
    });
    //generate the verification token
    const verifyAccountToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = verifyAccountToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();
    //specify the verifyAccountlink
    const verifyAccountLink = `${process.env.CLIENT_URL}/verify-email/${user._id}/${user.verificationToken}`;
    //send email to user
    await sendMail({
      fullname: user.fullname,
      intro: [
        "Welcome to Instashots",
        "We are very excited to have you onboard",
      ],
      instructions: `To access our platform, please verify your email using this link: ${verifyAccountLink}. Link will expire after 24 hours.`,
      btnText: "Verify",
      subject: "Email Verification",
      to: user.email,
      link: `${process.env.CLIENT_URL}/verify-email/${user._id}/${user.verificationToken}`,
    });
    //generate accessToken
    const accessToken = generateAccessToken(user._id, user.role);
    //send a response to the client
    res.status(201).json({
      success: true,
      message:
        "Account created successfully, please check you mail in order to verify your account",
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return next(createHttpError(400, "Username or password is missing"));
    }
    //find user - password is hidden by default, using select method brings it back
    const user = await User.findOne({ username: username }).select("+password");
    if (!user) {
      return next(createHttpError(404, "Account not found"));
    }
    //handle password check
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(createHttpError(401, "Invalid credentials"));
    }
    //if all checks out, genrate and send accessToken
    const accessToken = generateAccessToken(user._id, user.role);
    res.status(200).json({
      success: true,
      accessToken,
      message: `Welcome ${user.username}`,
    });
  } catch (error) {
    next(error);
  }
};

export const authenticateUser = async (req, res, next) => {
  const { id: userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

export const resendEmailVerificationLink = async (req, res, next) => {
  const { id: userId } = req.user;
  try {
    const user = await User.findById(userId);
    //generate the verification token
    const verifyAccountToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = verifyAccountToken;
    user.verificationTokenExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();
    const verifyAccountLink = `${process.env.CLIENT_URL}/verify-email/${user._id}/${user.verificationToken}`;
    //send email to user
    await sendMail({
      fullname: user.fullname,
      intro: [
        "Welcome to Instashots",
        "We are very excited to have you onboard",
      ],
      instructions: `To access our platform, please verify your email using this link: ${verifyAccountLink}. Link will expire after 24 hours.`,
      btnText: "Verify",
      subject: "Email Verification",
      to: user.email,
      link: `${process.env.CLIENT_URL}/verify-email/${user._id}/${user.verificationToken}`,
    });
    res
      .status(200)
      .json({ success: true, message: "Email verification link sent " });
  } catch (error) {
    next(error);
  }
};

export const verifyEmailAccount = async (req, res, next) => {
  const { userId, verificationToken } = req.params;
  try {
    if (!userId || !verificationToken) {
      return next(
        createHttpError(400, "UserId or verificationToken not provided")
      );
    }
    //find user
    const user = await User.findOne({
      _id: userId,
      verificationToken: verificationToken,
    }).select("+verificationToken +verificationTokenExpires");
    if (!user) {
      return next(createHttpError(404, "Invalid User id or reset token"));
    }
    //check token expiry
    if (user.verificationTokenExpires < Date.now()) {
      user.verificationToken = null;
      user.verificationTokenExpires = null;
      await user.save();
      return next(
        createHttpError(
          401,
          "Verifcation link has expired, please request a new one"
        )
      );
    } else {
      user.isVerified = true;
      user.verificationToken = null;
      user.verificationTokenExpires = null;
      await user.save();
    }
    res
      .status(200)
      .json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    next(error);
  }
};

export const sendForgotPasswordMail = async (req, res, next) => {
  const { email } = req.body;
  try {
    if (!email) {
      return next(createHttpError(400, "Email not provided"));
    }
    const user = await User.findOne({ email });
    if (!user) {
      return next(createHttpError(404, "User account not found"));
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    user.passwordResetToken = resetToken;
    user.passwordResetTokenExpires = Date.now() + 30 * 60 * 1000;
    await user.save();
    const resetPasswordLink = `${process.env.CLIENT_URL}/auth/reset-password/${user._id}/${user.passwordResetToken}`;
    //send email to user
    await sendMail({
      fullname: user.fullname,
      intro: [
        "You have requested a password reset for your account",
        "If you did not make this request, kindly ignore this email",
      ],
      instructions: `Click here to reset your password: ${resetPasswordLink}. Link will expire after 30 minutes.`,
      btnText: "Reset Password",
      subject: "Password Reset",
      to: user.email,
      link: resetPasswordLink,
    });
    res.status(200).json({
      success: true,
      message: "Password reset link has been sent to your email",
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  const { newPassword, confirmPassword } = req.body;
  const { userId, passwordToken } = req.params;
  try {
    if (!newPassword || !confirmPassword) {
      return next(
        createHttpError(400, "New password or confirm password is missing")
      );
    }
    //find user
    const user = await User.findOne({
      _id: userId,
      passwordResetToken: passwordToken,
    }).select("+passwordResetToken +passwordResetTokenExpires");
    if (!user) {
      return next(createHttpError(404, "Invalid User id or reset token"));
    }
    //check token expiry
    if (user.passwordResetTokenExpires < Date.now()) {
      user.passwordResetToken = null;
      user.passwordResetTokenExpires = null;
      await user.save();
      return next(
        createHttpError(
          401,
          "Password reset link has expired, please request a new one"
        )
      );
    }
    //check newPassord and confirmPassword are same
    if (newPassword !== confirmPassword) {
      return next(
        createHttpError(400, "New password and confirm password do not match")
      );
    }
    //proceed to hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetTokenExpires = null;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Password has been updated" });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  res.status(200).json({ message: "Logged out successfully" });
};

export const followUser = async (req, res, next) => {
  const { id: userId } = req.user;
  const { id: followerId } = req.params;
  try {
    if (!followerId) {
      return next(createHttpError(400, "Follower id is required"));
    }
    const user = await User.findById(userId);
    if (user.following.map((id) => id.toString()).includes(followerId)) {
      user.following = user.following.filter(
        (id) => id.toString() !== followerId
      );
    } else {
      user.following.push(followerId);
    }
    //update the follower
    const followedUser = await User.findById(followerId);
    if (followedUser.followers.map((id) => id.toString()).includes(userId)) {
      followedUser.followers = followedUser.followers.filter(
        (id) => id.toString() !== userId
      );
    } else {
      followedUser.followers.push(userId);
    }
    await followedUser.save();
    await user.save();
    res.status(200).json({
      success: true,
      message: user.following.map((id) => id.toString()).includes(followerId)
        ? "User followed"
        : "User unfollowed",
      user,
      followedUser, //new
    });
  } catch (error) {
    next(error);
  }
};

export const getAUser = async (req, res, next) => {
  const { username } = req.params;
  try {
    if (!username) {
      return next(createHttpError(400, "Username is required"));
    }
    const user = await User.findOne({ username });
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    const [userPostsCreated, userSavedPosts, userLikedPosts] =
      await Promise.all([
        Post.find({ userId: user._id.toString() }),
        Post.find({ savedBy: user._id.toString() }),
        Post.find({ likes: user._id.toString() }),
      ]);
    res
      .status(200)
      .json({ user, userPostsCreated, userSavedPosts, userLikedPosts });
  } catch (error) {
    next(error);
  }
};

export const changeProfilePicture = async (req, res, next) => {
  const { profilePicture } = req.body;
  const { id: userId } = req.user;
  try {
    if (!profilePicture) {
      return next(createHttpError(400, "Profile picture file is required"));
    }
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    if (user.profilePictureId) {
      await deleteFromCloudinary(user.profilePictureId);
    }
    const uploadImage = await uploadToCloudinary(profilePicture, {
      folder: "InstaShots/profile",
      transformation: [
        { width: 500, height: 500, crop: "fill" },
        { quality: "auto" },
        { fetch_format: "webp" },
      ],
    });
    user.profilePicture = uploadImage.url || user.profilePicture;
    user.profilePictureId = uploadImage.public_id || user.profilePictureId;
    await user.save();
    res.status(200).json({
      success: true,
      message: "Profile updated",
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (req, res, next) => {
  const { fullname, bio, email, username } = req.body;
  const { id: userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    const data = {
      fullname: fullname || user.fullname,
      bio: bio || user.bio,
      email: email || user.email,
      username: username || user.username,
    };
    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      new: true,
    });
    res.status(200).json({
      success: true,
      message: "Profile updated",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

export const getRandomUsers = async (req, res, next) => {
  const { id: userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    // Get all users except current user and those they follow
    const randomUsers = await User.find({
      _id: {
        $nin: [userId, ...user.following],
      },
    }).limit(5); // Limit to 5 random users

    res.status(200).json({
      success: true,
      randomUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserFollowers = async (req, res, next) => {
  const { username } = req.params;
  try {
    if (!username) {
      return next(createHttpError(400, "Username is required"));
    }
    const user = await User.findOne({ username });
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    const followers = await User.find({ _id: { $in: user.followers } });
    res.status(200).json({
      success: true,
      followers,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserFollowing = async (req, res, next) => {
  const { username } = req.params;
  try {
    if (!username) {
      return next(createHttpError(400, "Username is required"));
    }
    const user = await User.findOne({ username });
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    const following = await User.find({ _id: { $in: user.following } });
    res.status(200).json({
      success: true,
      following,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const { id: userId } = req.user;
  try {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return next(createHttpError(400, "Form fields are required"));
    }
    const user = await User.findById(userId).select("+password");
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordValid) {
      return next(createHttpError(401, "Invalid current password"));
    }
    if (newPassword !== confirmPassword) {
      return next(
        createHttpError(401, "New password and confirm password do not match")
      );
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Password updated!, Login again",
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserPrivacy = async (req, res, next) => {
  const { isPublic } = req.body;
  const { id: userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }

    // Ensure isPublic is saved as a boolean value
    user.isPublic = Boolean(isPublic);
    await user.save();

    res.status(200).json({
      success: true,
      user,
      message: "Privacy updated!",
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  const { id: userId } = req.user;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(createHttpError(404, "User not found"));
    }
    // Delete profile photo if it exists
    if (user.profilePhotoId) {
      await deleteFromCloudinary(user.profilePhotoId);
    }
    //find all user posts
    const userPosts = await Post.find({ userId: userId.toString() });
    //delete all posts by user
    for (const posts of userPosts) {
      if (posts.mediaPublicIds && posts.mediaPublicIds.length > 0) {
        await Promise.all(
          posts.mediaPublicIds.map((id) => deleteFromCloudinary(id))
        );
      }
    }
    await User.findByIdAndDelete(userId);
    await Post.deleteMany({ userId: userId });
    await Comment.deleteMany({ user: userId });
    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const searchUsers = async (req, res, next) => {
  const query = req.query.q;
  try {
    const users = await User.find({
      $or: [
        { username: { $regex: query.trim(), $options: "i" } },
        { fullname: { $regex: query.trim(), $options: "i" } },
      ],
    });
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    next(error);
  }
};
