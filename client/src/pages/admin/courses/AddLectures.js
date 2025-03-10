import { Button, CircularProgress, Typography } from "@mui/material";
import "./AddLectures.css";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import {
  useCreateLectureMutation,
  useGetPerticularCourseAllLecturesQuery,
} from "../../../features/api/lectureApi";

const AddLectures = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const { id } = useParams();

  const [createLecture, { data, isSuccess, isLoading, isError, error }] =
    useCreateLectureMutation();

  const {
    data: getLectureData,
    isLoading: getlecturesLoading,
    error: getLecturesError,
    refetch,
  } = useGetPerticularCourseAllLecturesQuery(id);

  const navigate = useNavigate();
  const goback = () => navigate(-1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!lectureTitle.trim()) {
      toast.error("Lecture title cannot be empty");
      return;
    }

    try {
      await createLecture({ values: { lectureTitle }, id });
    } catch (error) {
      console.log("Error while creating lecture:", error);
    }
  };

  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data?.message || "Lecture created successfully");
      setLectureTitle("");
      refetch();
    }
    if (isError && error) {
      toast.error(error?.data?.message || "Error in creating lecture");
    }

    if (getLecturesError) {
      toast.error(error?.data?.message || "Error in getting all lectures");
    }
  }, [isError, data, isSuccess, error, navigate]);

  return (
    <div className="addLectureContainer">
      <div className="section" id="section-1">
        <h1>Add a New Lecture</h1>
        <p>Provide the title for the new lecture.</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="section" id="section-2">
          <label htmlFor="lectureTitle">Title</label>
          <input
            type="text"
            name="lectureTitle"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            id="lectureTitle"
            placeholder="Your lecture name"
          />
        </div>
        <div className="section" id="section-4">
          <Button onClick={goback} type="button" variant="outlined">
            Back to lectures
          </Button>
          <Button disabled={isLoading} type="submit" variant="contained">
            {isLoading ? (
              <span style={{ display: "flex", gap: "20px" }}>
                <CircularProgress sx={{ color: "black" }} size={16} /> Adding...
              </span>
            ) : (
              "Add Lecture"
            )}
          </Button>
        </div>
      </form>

      {/* Displaying All Lectures */}
      <div className="allCourseLectures">
        {getlecturesLoading ? (
          <div className="loaderContainer">
            <CircularProgress sx={{ color: "black" }} size={50} />
          </div>
        ) : getLectureData?.lectures?.length === 0 ? (
          <Typography>No Lectures available</Typography>
        ) : (
          getLectureData.lectures.map((curLecture, index) => (
            <Typography key={index} variant="body1">
              <div className="menuItems">
                <h4>
                  Lecture: <span>{curLecture.lectureTitle}</span>{" "}
                </h4>
                <NavLink
                  style={{ color: "black" }}
                  to={`/admin/course/${id}/lecture/edit/${curLecture._id}`}
                >
                  <EditOutlinedIcon className="lectureEditIcon" />
                </NavLink>
              </div>
            </Typography>
          ))
        )}
      </div>
    </div>
  );
};

export default AddLectures;
