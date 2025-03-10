import express from "express";
import {
  createCourse,
  editCourse,
  getAllCourses,
  getAllPublishedCourses,
  getSingleCourseDetails,
  getCourseDetailsWithPurchaseStatus,
  publishNewCourse,
  getAllPurchasedCourse,
  searchCourses,
} from "../controllers/courseController.js";
import isAuthenticated from "../middleware/authMiddleware.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.route("/create").post(isAuthenticated, createCourse);
router.route("/getall").get(isAuthenticated, getAllCourses);
router.route("/published").get(getAllPublishedCourses);
router.route("/search").get(isAuthenticated, searchCourses);
router.route("/detail-with-status/:courseId").get(isAuthenticated, getCourseDetailsWithPurchaseStatus);
router.route("/allpurchased").get(isAuthenticated, getAllPurchasedCourse);
router
  .route("/getsingle/:courseId")
  .get(isAuthenticated, getSingleCourseDetails);
router.route("/publish/:courseId").put(isAuthenticated, publishNewCourse);
router
  .route("/update/:courseId")
  .put(isAuthenticated, upload.single("courseThumbnail"), editCourse);

export default router;
