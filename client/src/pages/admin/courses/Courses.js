import React from "react";
import "./Courses.css";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import { useGetAllCreatorCoursesQuery } from "../../../features/api/courseApi";
import Loader from "../../../components/helper/loader/Loader";
import EditIcon from "@mui/icons-material/Edit";


const Courses = () => {
  const { data, isError, isLoading, isSuccess, error } =
    useGetAllCreatorCoursesQuery();
  const courses = data?.courses || []; 

  console.log(data);

  const tableHeadData = ["Title", "Price", "Status", "Action"];

  return isLoading ? (
    <Loader />
  ) : (
    <div className="adminCoursesContainer">
      <NavLink to="/admin/addcourse">
        <Button
          variant="contained"
          style={{
            backgroundColor: "black",
            width: "25%",
            borderRadius: "10px",
          }}
        >
          Create New Course
        </Button>
      </NavLink>

      <TableContainer component={Paper} sx={{ margin: "auto", mt: 5 }}>
        <Table>
          <TableHead>
            <TableRow>
              {tableHeadData.map((data, index) => (
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    fontSize: "17px",
                    color: "grey",
                  }}
                  key={index}
                >
                  {data}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <TableRow key={course?._id}>
                  <TableCell>{course?.courseTitle}</TableCell>
                  <TableCell>₹{course?.coursePrice.toLocaleString("en-IN") || "N/A"}</TableCell>
                  <TableCell>{course?.isPublished ? 'Published':"Draft"}</TableCell>
                  <TableCell>
                  <Tooltip title='Edit Course' >
                 <NavLink to={`/admin/course/edit/${course?._id}`}>
                 <Button  variant="outlined" sx={{backgroundColor:"black"}} size="small">
                      <EditIcon sx={{color:"white"}} />
                    </Button>
                 </NavLink>
                  </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No courses available.
                </TableCell>{" "}
                
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Courses;
