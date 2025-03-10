import React, { useEffect } from "react";
import { Button, Card, CardMedia, CircularProgress } from "@mui/material";
import { NavLink, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useCreateCheckoutSessionMutation } from "../../../features/api/purchaseApi";
import WarningIcon from "@mui/icons-material/Warning";
import PlayCircleFilledWhiteOutlinedIcon from "@mui/icons-material/PlayCircleFilledWhiteOutlined";
import "./CourseDetails.css";
import { useGetCourseDetailsWithPurchaseStatusQuery } from "../../../features/api/courseApi";
import Loader from "../../../components/helper/loader/Loader";
import { useLoadUserQuery } from "../../../features/api/authApi";

const CourseDetails = () => {
  const [
    createCheckoutSession,
    { data, isSuccess, isError, error, isLoading },
  ] = useCreateCheckoutSessionMutation();
  const { courseId } = useParams();

  const {
    data: singleCourseDetailsData,
    isLoading: singleCourseDetailsLoading,
    isError: singleCourseDetailsIsError,
    error: singleCourseDetailsError,
  } = useGetCourseDetailsWithPurchaseStatusQuery(courseId);

    const { data:LoadUserData} = useLoadUserQuery();
  

  const course = singleCourseDetailsData?.course;

  const isEnrolled = LoadUserData?.user?.enrolledCourses?.some(
    (curEnrolledCourse) => curEnrolledCourse?._id === courseId
  );
  
  

  const purchaseCourseHandler = async () => {
    try {
      await createCheckoutSession({ courseId }); // Fix: Pass as an object
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (isSuccess) {
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("Invalid response from server");
      }
    }
    if (isError && error) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  }, [data, isSuccess, isError, error]);

  useEffect(() => {
    if (singleCourseDetailsIsError && singleCourseDetailsError) {
      toast.error(singleCourseDetailsError?.data?.error);
    }
  }, [singleCourseDetailsIsError, singleCourseDetailsError]);

  return singleCourseDetailsLoading ? (
    <Loader />
  ) : (
    <div className="courseDetailsContainer">
      <div className="topContainer">
        <h2>{course?.category || 'N/A'}</h2>
        <p>{course?.courseTitle || 'N/A'}</p>
        <p>
          Created By{" "}
          <a style={{ color: "blue" }} href={`/`}>
            <i>{course?.creator?.name || 'N/A'}</i>
          </a>
        </p>
        <div>
          <WarningIcon />
          <p>Last Updated At {course?.createdAt?.split("T")[0] || 'N/A'}</p>
        </div>
        <p>
          Students enrolled:{" "}
          <span>{course?.enrolledStudents?.length || "N/A"}</span>
        </p>
      </div>
      <div className="downContainer">
        <div className="leftSectionDetailsContainer">
          <h3>Description</h3>
          <p dangerouslySetInnerHTML={{ __html: course?.description || 'N/A' }} />
          <div className="courseContentContainer">
            <h3>Course Content</h3>
            <h5>
              Number Of Lectures :- <span>{course?.lectures?.length || 'N/A'}</span>
            </h5>
            {course?.lectures?.map((curLecture) => (
              <div key={curLecture?._id}>
                <PlayCircleFilledWhiteOutlinedIcon />
                <p>{curLecture?.lectureTitle}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rightSectionDetailsContainer">
          <div style={{ width: "100%" }}>
            {" "}
            <CardMedia
              sx={{
                width: "85%",
                height: "100%",
                margin: "0px auto",
                borderRadius: "8px",
              }}
              component="video"
              controls
              src={course?.lectures[0]?.videoUrl}
            />
          </div>
          <h4>{course?.courseTitle}</h4> {/* Fix applied here */}
          <hr />
          <h3>₹{course?.coursePrice}</h3>
          {!isEnrolled ? (
            <Button disabled={isLoading} onClick={purchaseCourseHandler}>
              {isLoading ? (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <CircularProgress style={{ color: "white" }} size={16} />
                  <p>Please Wait</p>
                </div>
              ) : (
                "Purchase Course"
              )}
            </Button>
          ) : (
            <NavLink to={`/course-progress/${courseId}`}>
              <Button className="continueCourseButton" disabled={isLoading}>
                {isLoading ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <CircularProgress style={{ color: "white" }} size={16} />
                    <p>Please Wait</p>
                  </div>
                ) : (
                  "Continue Course"
                )}
              </Button>
            </NavLink>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
