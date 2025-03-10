import Course from "../models/courseModel.js";
import CoursePurchase from "../models/purchaseModel.js";

import { deleteMediaFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

// create company

const createCourse = async (req, res) => {
  try {
    console.log("User from request:", req.user); // Debugging line

    const { courseTitle, category } = req.body;

    if (!courseTitle || !category) {
      return res.status(400).json({
        success: false,
        message: "Provide necessary credentials",
      });
    }

    if (!req.user || !req.user.id) {
      // Check if user exists
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const course = await Course.create({
      courseTitle,
      category,
      creator: req.user.id, // Storing user ID
    });

    res.status(201).json({
      success: true,
      message: "Course has been created successfully",
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get all courses

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ creator: req.user.id });
    if (!courses) {
      return res.status(404).json({
        success: false,
        message: "course not found",
      });
    }
    res.status(200).json({ success: true, nbCourses: courses.length, courses });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// edit course

const editCourse = async (req, res) => {
  try {
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;
    const thumbnail = req.file;
    const { courseId } = req.params;

    let course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    let courseThumbnail;
    if (thumbnail) {
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        await deleteMediaFromCloudinary(publicId); // delete old image if exits
      }
      // upload a new image on cloudinary
      courseThumbnail = await uploadMedia(thumbnail.path);
    }

    const updatedCourseDetails = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
      courseThumbnail: courseThumbnail?.secure_url,
    };

    course = await Course.findByIdAndUpdate(courseId, updatedCourseDetails, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Your course has been updated successfully",
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get course details by its id

const getSingleCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found with this courseId",
      });
    }
    res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// publish the course

const publishNewCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query;

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found with this id",
      });
    }

    // publish status based on query parameter

    course.isPublished = publish === "true";
    await course.save();

    const statusMessage = course.isPublished ? "Published" : "Unpublished";
    res.status(200).json({
      success: true,
      message: `Course has been ${statusMessage}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get all published courses

const getAllPublishedCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name profilePicture",
    });
    if (!courses) {
      return res.status(404).json({
        success: false,
        message: "Courses not found",
      });
    }
    res.status(200).json({
      success: true,
      nbCourses: courses.length,
      courses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get single published course

const getCourseDetailsWithPurchaseStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const course = await Course.findById(courseId)
    .populate({ path: "enrolledStudents" })
      .populate({ path: "creator" })
      .populate({ path: "lectures" });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // const purchased = await CoursePurchase.findOne({ userId, courseId });
    // console.log(purchased);
    

    res.status(200).json({
      success: true,
      course,
      // purchased:!!purchased,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// get all purchased course

const getAllPurchasedCourse = async (_, res) => {
  try {
    const purchasedCourse = await CoursePurchase.find({
      status: "completed",
    }).populate("courseId");

    if (!purchasedCourse) {
      return res.status(404).json({
        success: false,
        message: "purchased courses are not found",
      });
    }
    res.status(200).json({
      nbPurchasedCourse: purchasedCourse.length,
      success: true,
      purchasedCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// search courses

const searchCourses = async (req, res) => {
  try {
    const { query = "", categories = [], sortByPrice = "" } = req.query;

    // create search query

    const searchCriteria = {
      isPublished: true,
      $or: [
        { courseTitle: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    };

    // if categories selected

    if (categories.length > 0) {
      searchCriteria.category = { $in: categories };
    }

    // define sorting order

    const sortOptions = {};

    if (sortByPrice === "low") {
      sortOptions.coursePrice = 1; // sort by price in ascending
    } else if (sortByPrice === "low") {
      sortOptions.coursePrice = -1; // sort by price in descending
    }

    let courses = await Course.find(searchCriteria)
      .populate({ path: "creator", select: "name profilePhoto" })
      .sort(sortOptions);

    return res.status(200).json({
      success: true,
      courses: courses || []
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export {
  createCourse,
  getAllCourses,
  editCourse,
  getSingleCourseDetails,
  publishNewCourse,
  getAllPublishedCourses,
  getCourseDetailsWithPurchaseStatus,
  getAllPurchasedCourse,
  searchCourses,
};
