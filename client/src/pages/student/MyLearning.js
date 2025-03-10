import React, { useEffect, useState } from "react";
import "./MyLearning.css";
import CourseCard from "../../components/Card";
import { Grid2 } from "@mui/material";
import { useLoadUserQuery } from "../../features/api/authApi";
import { NavLink, useParams } from "react-router-dom";
import Loader from "../../components/helper/loader/Loader";
import toast from "react-hot-toast";

const MyLearning = () => {
  const { data, isLoading, isSuccess, isError, error,refetch } = useLoadUserQuery();

  const enrolledCourses = data?.user?.enrolledCourses;

  useEffect(() => {
  if(isError && error){
    toast.error(error?.data?.message)
  }

  if(isSuccess && data){
    refetch()

  }
  }, [isError,error])
  

  return (
    <>
      <div className="myLearningContainer">
        <div className="myLearningTitle">
          <h1>My Learning</h1>
          <hr />
        </div>
        {isLoading ? (
          <Loader />
        ) : (
          <Grid2 container spacing={12} className="myLearningCourse">
            {enrolledCourses && enrolledCourses.length === 0 ? (
              <div><h2>Your're not  enrolled in any of the courses now 😃</h2></div>
            ) : (
              enrolledCourses.map((curEnrolledCourse) => {
                return <NavLink to={`/course/${curEnrolledCourse?._id}`} ><CourseCard key={curEnrolledCourse?._id} curCourse={curEnrolledCourse}  className="mylearningCard" /></NavLink>
              })
            )}
          </Grid2>
        )}
      </div>
    </>
  );
};

export default MyLearning;
