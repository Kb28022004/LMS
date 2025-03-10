import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "password is require"],
      minLength: [8, "Password length should be greater than 8 characters"],
    },
    role: {
      type: String,
      enum: ["Instructor", "student"],
      default: "student",
    },
    enrolledCourses:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      }
    ],
    profilePicture: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);


