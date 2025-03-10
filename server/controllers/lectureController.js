import Lecture from "../models/lectureModel.js";
import Course from "../models/courseModel.js";
import { deleteVideoFromCloudinary } from "../utils/cloudinary.js";

const createCourseLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;

    const { id } = req.params;

    if (!lectureTitle || !id) {
      return res.status(400).json({
        success: false,
        message: "lecture title is required",
      });
    }

    const lecture = await Lecture.create({ lectureTitle });

    const course = await Course.findById(id);

    if (course) {
      course.lectures.push(lecture._id);
      await course.save();
    }

    res.status(201).json({
      success: true,
      message: "lecture created successfully",
      lecture,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getPerticularCourseAllLectures = async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id).populate("lectures");
    if (!course) {
      return res.status(400).json({
        success: false,
        message: "course not found",
      });
    }

    const lectures = course.lectures;

    res.status(200).json({
      success: true,
      nbLectures: lectures.length,
      lectures,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// edit lectures

const editLectures = async (req, res) => {
  try {
    const { lectureTitle, videoInfo, isPreviewFree } = req.body;

    if (!lectureTitle && !videoInfo && typeof isPreviewFree === "undefined") {
      return res.status(400).json({
        success: false,
        message: "Kindly provide required credentials",
      });
    }

    const { courseId, lectureId } = req.params;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    // Update lecture fields
    if (lectureTitle) lecture.lectureTitle = lectureTitle;
    if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
    if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
    if (typeof isPreviewFree !== "undefined") lecture.isPreviewFree = isPreviewFree;

    await lecture.save();

    // Find the course and ensure the lecture is in the course
    const course = await Course.findById(courseId);
    if (course && !course.lectures.includes(lecture._id)) {
      course.lectures.push(lecture._id);
      await course.save();
    }

    res.status(200).json({
      success: true,
      message: "Lecture has been updated successfully",
      lecture,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// remove lectures

const removeLectures = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const lecture = await Lecture.findByIdAndDelete(lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "lecture not found with this id",
      });
    }

    // delete video from cloudinary

    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }

    // remove the lecture reference from the associated course

    await Course.updateOne(
      {
        lectures: lectureId,
      },
      {
        $pull: {
          lectures: lectureId,
        },
      }
    );

    res
      .status(200)
      .json({ success: true, message: "lecture has been deleted suceesfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get lecture by id

const getLectureById=async(req,res)=>{
  try {
    const {lectureId}=req.params
    const lecture=await Lecture.findById(lectureId)
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "lecture not found with this lectureId",
      });
    }
    res
    .status(200)
    .json({ success: true, lecture });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
}
export {
  createCourseLecture,
  getPerticularCourseAllLectures,
  editLectures,
  removeLectures,
  getLectureById
};
