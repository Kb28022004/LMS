import express from "express";
import isAuthenticated from "../middleware/authMiddleware.js";
import {
  createCourseLecture,
  getPerticularCourseAllLectures,
  removeLectures,
  editLectures,
  getLectureById
} from "../controllers/lectureController.js";
import upload from "../utils/multer.js";
import { uploadMedia } from "../utils/cloudinary.js";

const router = express.Router();

router.route("/create/:id").post(isAuthenticated, createCourseLecture);
router.route("/get/:id").get(isAuthenticated, getPerticularCourseAllLectures);
router.route("/update/:lectureId/course/:courseId").post(isAuthenticated, editLectures);
router.route("/delete/:lectureId").delete(isAuthenticated, removeLectures);
router.route("/single/get/:lectureId").get(isAuthenticated, getLectureById);
router.route("/upload-video").post(upload.single("file"), async (req, res) => {
  try {
    const result = await uploadMedia(req.file.path);
    res
      .status(200)
      .json({
        success: true,
        message: "video uploaded succesfully",
        data: result,
      });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
});

export default router;
