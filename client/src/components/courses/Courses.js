import React, { useEffect } from "react";
import "./Courses.css";
import CourseSkelation from "../helper/CourseSkelation";
import CourseCard from "../Card";
import { Grid2, Typography } from "@mui/material";
import { useGetAllPublishedCoursesQuery } from "../../features/api/courseApi";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";

const Courses = () => {
  const { data, isLoading, isSuccess, isError, error, refetch } =
    useGetAllPublishedCoursesQuery();

  useEffect(() => {
    if (isSuccess && data) {
      refetch();
    }
    if (isError && error) {
      toast.error(error?.data?.message);
    }
  }, [isSuccess, data, error, isError]);

  return (
    <div className="courseContainer">
      <h1>Our Courses</h1>

      {isLoading ? (
        <CourseSkelation />
      ) : (
        <Grid2 container spacing={12}>
          {data?.courses.length === 0 ? (
            <Typography style={{ fontWeight: "bold" }}>
              No Any Courses are published now
            </Typography>
          ) : (
            data?.courses.map((curCourse, index) => {
              return (
               <NavLink style={{textDecoration:"none"}} to={`/course/${curCourse._id}`} > <CourseCard key={index} curCourse={curCourse} /> </NavLink>
              );
            })
          )}
        </Grid2>
      )}
    </div>
  );
};

export default Courses;
