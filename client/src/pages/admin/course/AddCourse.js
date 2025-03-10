import { Button, CircularProgress } from "@mui/material";
import "./AddCourse.css";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom"; // ✅ Fixed import
import Loader from "../../../components/helper/loader/Loader";
import { useCreateCourseMutation } from "../../../features/api/courseApi";
import toast from "react-hot-toast";

const AddCourse = () => {
  const [buttonLoading, setButtonLoading] = useState(false);
  const [createCourse, { data, isSuccess, isLoading, isError, error }] =
    useCreateCourseMutation(); // ✅ Fixed typo in `isSuccess`

  const navigate = useNavigate();
  const goback = () => {
    navigate(-1);
  };

  const handleSubmit = async (values) => {
    try {
      setButtonLoading(true);
      await createCourse(values);
      setButtonLoading(false);
    } catch (error) {
      console.log("Error in creating course", error);
      setButtonLoading(false);
    }
  };

  const validationSchema = Yup.object({
    courseTitle: Yup.string()
      .min(3, "Title length should be at least 2 characters")
      .required("Title of the course is required"),
    category: Yup.string().required("Category is required"),
  });

  const formik = useFormik({
    initialValues: {
      courseTitle: "",
      category: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  const categoryList = [
    "Next Js",
    "Data Science",
    "Frontend Development",
    "Full Stack Development",
    "MERN Stack Development",
    "Javascript",
    "Python",
    "Docker",
    "MongoDb",
    "HTML",
  ];

  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data?.message || "Course created successfully");
      navigate("/admin/courses");
    }
    if (isError && error) {
      toast.error(error?.data?.error || "Error in creating a new course");
      setButtonLoading(false);
    }
  }, [isError, data, isSuccess, error]);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="addCourseContainer">
      <div className="section" id="section-1">
        <h1>Let's add a course, add some basic details for your new course</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi, quia.
        </p>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="section" id="section-2">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="courseTitle"
            value={formik.values.courseTitle}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            id="title"
            placeholder="Your course Name"
          />
          {formik.touched.courseTitle && formik.errors.courseTitle && (
            <p className="error">{formik.errors.courseTitle}</p>
          )}
        </div>

        <div className="section" id="section-3">
          <label htmlFor="category">Category</label>
          <select
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="" disabled>
              Select a Category
            </option>
            {categoryList.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
          {formik.touched.category && formik.errors.category && (
            <p className="error">{formik.errors.category}</p>
          )}
        </div>

        <div className="section" id="section-4">
          <Button onClick={goback} type="button" variant="outlined">
            Back
          </Button>
          <Button disabled={buttonLoading} type="submit" variant="contained">
            {buttonLoading ? (
              <>
                <CircularProgress size={20} /> Please Wait ....
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;
