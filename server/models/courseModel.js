import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  courseTitle: {
    type: String,
    required: [true, "course title is required"],
  },
  subTitle: {
    type: String,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: [true, "category  is required"],
  },
  courseLevel: {
    type: String,
    enum: ["Beginner", "Medium", "Advance"],
    default:"Beginner"
  },
  coursePrice: {
    type: Number,
  },
  courseThumbnail: {
    type: String,
  },
  enrolledStudents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  lectures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
    },
  ],
  creator: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", // 🔹 Reference to User Model
    required: true, 
  },
  isPublished:{
    type:Boolean,
    default:false
  }
},{timestamps:true});

export default mongoose.model('Course',courseSchema)
