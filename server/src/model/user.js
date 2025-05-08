import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Username is required"],
      trim: true,
    },
    fullname: {
      type: String,
      required: [true, "Fullname is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false, //prevent this field from being sent to the client,
      minLength: [5, "Password must be at least 5 characters"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"], //predefined values specified that must be picked from
      default: "user",
    },
    verificationToken: {
      type: String,
      select: false,
    },
    verificationTokenExpires: {
      type: Date,
      select: false,
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetTokenExpires: {
      type: Date,
      select: false,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    profilePictureId: {
      type: String,
      default: "", //this to track the profilePic id comimng from cloudinary server in order to delete the old profilePic if the user updates to a new one.
    },
    bio: {
      type: String,
      maxLength: [150, "Bio cannot be more than 150 characters"],
    },
    followers: {
      type: [String],
    },
    following: {
      type: [String],
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } //Adds createdAt and updatedAt to a document
);

const User = model("User", userSchema);

export default User;
