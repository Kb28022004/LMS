import { Badge, Button, Card, CardMedia, Tooltip } from "@mui/material";
import "./CourseProgress.css";
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import {
  useGetCourseProgressQuery,
  useMarkAsCompletedMutation,
  useMarkAsInCompletedMutation,
  useUpdateLectureProgressMutation,
} from "../../../features/api/courseProgressApi";
import { useParams } from "react-router-dom";
import Loader from "../../../components/helper/loader/Loader";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

const CourseProgress = () => {
  const [currentLecture, setCurrentLecture] = useState(null);
  const { courseId } = useParams();

  const { data, isLoading, isError, isSuccess, error, refetch } =
    useGetCourseProgressQuery(courseId);
  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [
    markAsCompleted,
    {
      data: markAsCompletedData,
      isSuccess: markAsCompletedSuccess,
      isError: markAsCompletedIsError,
      error: markAsCompletedError,
    },
  ] = useMarkAsCompletedMutation();
  const [
    markAsInCompleted,
    {
      data: markAsInCompletedData,
      isSuccess: markAsInCompletedDataSuccess,
      isError: markAsInCompletedDataIsError,
      error: markAsInCompletedDataError,
    },
  ] = useMarkAsInCompletedMutation();

  const courseDetails = data?.data?.courseDetails;
  const progress = data?.data?.progress;
  const completed = data?.data?.completed;

  const handleUpdateLectureProgress = async (lectureId) => {
    try {
      await updateLectureProgress({ courseId, lectureId });
      refetch();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
  };

  const handleMarkAsCompleted = async () => {
    try {
      await markAsCompleted(courseId);
    } catch (error) {
      console.log(error);
    }
  };
  const handleMarkAsInCompleted = async () => {
    try {
      await markAsInCompleted(courseId);
    } catch (error) {
      console.log(error);
    }
  };

  const initialLecture =
    currentLecture || (courseDetails?.lectures && courseDetails.lectures[0]);

  const isLectureCompleted = (lectureId) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
  };


  useEffect(() => {
    if (isError && error) {
      toast.error(error?.data?.message);
    }
  }, [error, isError]);

  useEffect(() => {
    if (markAsCompletedSuccess && markAsCompletedData) {
      refetch();
      toast.success(markAsCompletedData?.message);
    }
    if (markAsInCompletedDataSuccess && markAsInCompletedData) {
      refetch();
      toast.success(markAsInCompletedData?.message);
    }
    if (markAsCompletedIsError && markAsCompletedError) {
      refetch();
      toast.error(markAsCompletedError?.data?.message);
    }
    if (markAsInCompletedDataIsError && markAsInCompletedDataError) {
      refetch();
      toast.error(markAsInCompletedDataError?.data?.message);
    }
  }, [
    markAsCompletedData,
    markAsInCompletedDataSuccess,
    markAsInCompletedData,
    markAsInCompletedDataIsError,
    markAsInCompletedDataError,
    markAsCompletedIsError,
    markAsCompletedError,
    markAsCompletedSuccess,
  ]);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="courseProgressMainContainer">
      <div className="courseProgressContainer">
        <div className="courseProgressContainer-leftSide">
          <h2>{courseDetails?.courseTitle}</h2>
          <div className="lectureImage-title">
            <Card sx={{ width: "100%", height: "80%", borderRadius: "15px" }}>
              <CardMedia
                style={{ height: "100%", borderRadius: "15px" }}
                component="video"
                onPlay={() => {
                  handleUpdateLectureProgress(
                    currentLecture?._id || initialLecture?._id
                  );
                }}
                src={currentLecture?.videoUrl || initialLecture?.videoUrl}
                controls
              />
            </Card>
            <h3>{`Lecture ${
              courseDetails.lectures.findIndex(
                (lec) => lec._id === (currentLecture?.id || initialLecture._id)
              ) + 1
            }: ${
              currentLecture?.lectureTitle || initialLecture.lectureTitle
            }`}</h3>
          </div>
        </div>
        <div className="courseProgressContainer-rightSide">
          <div className="courseProgressContainer-rightSide-section1">
            <h2>Course Lectures</h2>
            <Button
              onClick={
                completed ? handleMarkAsInCompleted : handleMarkAsCompleted
              }
            >
              {completed ? "Mark as an Incomplete" : "Mark as completed"}
            </Button>
          </div>

          {courseDetails?.lectures &&
            courseDetails?.lectures.map((lecture) => {
              return (
                <div
                  onClick={() => handleSelectLecture(lecture)}
                  className={
                    lecture?._id === currentLecture?._id
                      ? "courseProgressLectureCompletedHighlight"
                      : "courseProgresslecturesTittleCompleted"
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                    }}
                  >
                    {isLectureCompleted(lecture._id) ? (
                      <Tooltip title="Completed">
                        {" "}
                        <TaskAltOutlinedIcon color="success" />
                      </Tooltip>
                    ) : (
                      <Tooltip title="Not Completed">
                        {" "}
                        <PlayCircleFilledWhiteOutlinedIcon />
                      </Tooltip>
                    )}
                    <p style={{ fontWeight: "bold" }}>
                      Lecture 1 : {lecture?.lectureTitle}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;
