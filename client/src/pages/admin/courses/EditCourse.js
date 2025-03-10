import React, { useEffect, useState } from "react";
import "./EditCourses.css";
import { Button, CircularProgress } from "@mui/material";
import {
  useGetSingleCourseDetailsQuery,
  usePublisheNewCourseMutation,
  useUpdateCoursesMutation,
} from "../../../features/api/courseApi";
import toast from "react-hot-toast";
import { NavLink, useNavigate, useParams } from "react-router-dom";

const EditCourse = () => {
  const [input, setInput] = useState({
    courseTitle: "",
    subTitle: "",
    description: "",
    category: "",
    courseLevel: "",
    coursePrice: "",
    courseThumbnail: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  const { courseId } = useParams();
  const navigate = useNavigate();

  const [updateCourses, { data, isLoading, isError, isSuccess, error }] =
    useUpdateCoursesMutation();
  const { data: fetchSingleCourseData, refetch } =
    useGetSingleCourseDetailsQuery(courseId);

  const [
    publishNewCourse,
    {
      data: publishNewCourseData,
      isLoading: publishNewCourseLoading,
      isSuccess: publishNewCourseSuccess,
      error: publishNewCourseError,
      isError: publishNewCourseIsError,
    },
  ] = usePublisheNewCourseMutation();

  const {
    courseTitle,
    subTitle,
    description,
    category,
    courseLevel,
    coursePrice,
    courseThumbnail,
  } = input;

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }));
  };

  const onFileChangeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setInput((prev) => ({ ...prev, courseThumbnail: file }));
      setPreviewImage(URL.createObjectURL(file)); // Preview the selected image
    }
  };

  const courseLevelData = ["Beginner", "Medium", "Advance"];
  const categoryList = [
    "Next Js",
    "Data Science",
    "Frontend Development",
    "Full Stack Development",
    "MERN Stack Development",
    "Backend Development",
    "Javascript",
    
  ];

  const handleCancel = () => {
   navigate(-1)
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("courseTitle", courseTitle);
      formData.append("subTitle", subTitle);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("courseLevel", courseLevel);
      formData.append("coursePrice", coursePrice);
      if (courseThumbnail) {
        formData.append("courseThumbnail", courseThumbnail);
      }

      await updateCourses({ formData, courseId });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data?.message);
      navigate("/admin/courses");
      refetch();
    }

    if (isError) {
      toast.error(error?.data?.message || "An error occurred.");
    }
  }, [isError, isSuccess, data, error]);

  const singleCourseData = fetchSingleCourseData?.course;

  useEffect(() => {
    if (singleCourseData) {
      setInput({
        courseTitle: singleCourseData.courseTitle,
        subTitle: singleCourseData.subTitle,
        description: singleCourseData.description,
        category: singleCourseData.category,
        courseLevel: singleCourseData.courseLevel,
        coursePrice: singleCourseData.coursePrice,
        courseThumbnail: singleCourseData.courseThumbnail,
      });
    }
  }, [singleCourseData]);

  const publishStatusHandler = async (action) => {
    try {
      await publishNewCourse({ courseId, query: action });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (publishNewCourseSuccess && publishNewCourseData) {
      toast.success(publishNewCourseData?.message);
      refetch();
      navigate('/')
    }

    if (publishNewCourseIsError && publishNewCourseError) {
      toast.error(
        error?.publishNewCourseError?.message || "An error occurred."
      );
    }
  }, [
    publishNewCourseSuccess,
    publishNewCourseData,
    publishNewCourseIsError,
    publishNewCourseError,
  ]);
  return (
    <div className="editCourseContainer">
      <div className="upperSection">
        <h2>Add detailed information regarding the course</h2>
        <NavLink to={`/admin/addlecture/${courseId}`}>
          <Button variant="text">Go to lectures Page</Button>
        </NavLink>
      </div>
      <div className="lowerSection">
        <div className="content-1">
          <div className="leftContent">
            <h3>Basic Information</h3>
            <p>
              Make changes to your course here. Click save when you're done.
            </p>
          </div>
          <div className="rightContent">
            <Button
           disabled={singleCourseData?.lectures.length===0}
              onClick={() =>
                publishStatusHandler(
                  singleCourseData.isPublished ? "false" : "true"
                )
              }
              sx={{ boxShadow: "0 0 10px 0 black", color: "black" }}
            >
              {singleCourseData?.isPublished ? "Unpublished" : "Published"}
            </Button>
            <Button variant="contained" sx={{ backgroundColor: "black" }}>
              Remove Course
            </Button>
          </div>
        </div>
        <div className="content-2">
          <label htmlFor="courseTitle">Title</label>
          <input
            placeholder="Enter title"
            type="text"
            onChange={onChangeHandler}
            value={courseTitle}
            name="courseTitle"
            id="courseTitle"
          />
        </div>
        <div className="content-3">
          <label htmlFor="subTitle">Subtitle</label>
          <input
            placeholder="Enter subtitle"
            type="text"
            onChange={onChangeHandler}
            value={subTitle}
            name="subTitle"
            id="subTitle"
          />
        </div>
        <div className="content-4">
          <label htmlFor="description">Description</label>
          <textarea
            placeholder="Write description"
            rows={12}
            onChange={onChangeHandler}
            cols={12}
            type="text"
            value={description}
            name="description"
            id="description"
          />
        </div>
        <div className="content-5">
          <div className="content-5-1">
            <label htmlFor="category">Category</label>
            <select
              onChange={onChangeHandler}
              value={category}
              name="category"
              id="category"
            >
              <option value="">Choose Category</option>
              {categoryList.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="content-5-2">
            <label htmlFor="courseLevel">Course Level</label>
            <select
              onChange={onChangeHandler}
              value={courseLevel}
              name="courseLevel"
              id="courseLevel"
            >
              <option value="">Select Course Level</option>
              {courseLevelData.map((level, index) => (
                <option key={index} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>
          <div className="content-5-3">
            <label htmlFor="coursePrice">Price (INR)</label>
            <input
              onChange={onChangeHandler}
              value={coursePrice}
              name="coursePrice"
              type="number"
              placeholder="Enter Price"
            />
          </div>
        </div>
        <div className="content-6">
          <label htmlFor="courseThumbnail">Course Thumbnail</label>
          <input
            type="file"
            name="courseThumbnail"
            id="courseThumbnail"
            accept="image/*"
            onChange={onFileChangeHandler}
          />
        </div>
        <div className="content-7">
          {previewImage && (
            <img
              src={previewImage}
              alt="Course Thumbnail Preview"
              style={{
                maxWidth: "200px",
                maxHeight: "200px",
                marginTop: "10px",
                borderRadius: "10px",
                boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
              }}
            />
          )}
        </div>
        <div className="content-8">
          <Button
            sx={{ boxShadow: "0 0 10px 0 black", color: "black" }}
            variant="outlined"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            sx={{ backgroundColor: "black" }}
            variant="contained"
            onClick={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <CircularProgress size={20} /> Please Wait ....
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditCourse;
