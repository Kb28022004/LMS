import React, { useEffect, useState } from "react";
import "./MyProfile.css";
import {
  Avatar,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  Box,
  Typography,
  DialogContent,
  TextField,
  DialogActions,
  CircularProgress,
  Grid2,
} from "@mui/material";
import CourseCard from "../../components/Card";
import CloseIcon from "@mui/icons-material/Close";
import {
  useLoadUserQuery,
  useUpdateUserMutation,
} from "../../features/api/authApi";
import Loader from "../../components/helper/loader/Loader";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";

const MyProfile = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);

  const { data, isLoading, refetch } = useLoadUserQuery();
  const [
    updateUser,
    {
      data: updateUserData,
      isLoading: updateUserLoading,
      isError: updatedError,
      isSuccess: updatedUserSuccess,
      error,
    },
  ] = useUpdateUserMutation();

  const user = data?.user;

  const handleClose = () => {
    setOpen(!open);
  };

  const handleUpdateUser = async () => {
    const formData = new FormData();
    formData.append("name", name);
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }
    setButtonLoading(true);
    await updateUser(formData);
  };

  const onFileChangeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  useEffect(() => {
    if (updatedUserSuccess && updateUserData) {
      toast.success(updateUserData.message);
      refetch();
      setOpen(false);
      setButtonLoading(false);
    }
    if (updatedError) {
      toast.error(error?.data?.message);
      setButtonLoading(false);
    }
  }, [
    updateUserLoading,
    updatedUserSuccess,
    updatedError,
    updateUserData,
    error,
  ]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setProfilePicture(user.profilePicture?.url || null);
    }
  }, [user]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="myProfileContainer">
          <div className="uppseSection">
            <div className="leftProfileContent">
              <h1>Profile</h1>
              <Avatar src={user?.profilePicture} alt="" />
            </div>
            <div className="rightProfileContent">
              <p>Name : {user?.name}</p>
              <p>Email : {user?.email}</p>
              <p>Role : {user?.role.toUpperCase()} </p>
              <Button
                onClick={handleClose}
                style={{ width: "35%" }}
                variant="contained"
                color="success"
              >
                Edit Profile
              </Button>
            </div>
          </div>
          <div className="MyProfilelowerSection">
            <h1>My Enrolled Courses</h1>
            <hr />
            <div className="enrolledCourses">
              <Grid2  container spacing={12} className="myLearningCourse">
                {user?.enrolledCourses?.length > 0 ? (
                  user?.enrolledCourses.map((curCourse, index) => (
                   <NavLink to={`/course/${curCourse?._id}`}> <CourseCard key={index} curCourse={curCourse} /></NavLink>
                  ))
                ) : (
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    width="100%"
                    height="100%"
                  >
                    <Typography variant="h5">
                      You haven't enrolled in any course yet.
                    </Typography>
                  </Box>
                )}
              </Grid2>
            </div>
          </div>
        </div>
      )}

      <Dialog fullWidth open={open} onClose={handleClose}>
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5">Edit Profile</Typography>
            <CloseIcon sx={{ cursor: "pointer" }} onClick={handleClose} />
          </Box>
          <Typography variant="body2">
            Make changes to your profile here. Click save when you're done.
          </Typography>
        </DialogTitle>
        <DialogContent fullWidth>
          <Box display="flex" flexDirection="column" gap="10px">
            <TextField
              margin="dense"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="Enter name to update"
            />

            <TextField
              margin="dense"
              onChange={onFileChangeHandler}
              fullWidth
              type="file"
              accept="image/*"
              placeholder="Select profile picture"
              name="profilePicture"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleUpdateUser}
            variant="contained"
            disabled={buttonLoading}
            sx={{ backgroundColor: "black" }}
          >
            {buttonLoading ? <CircularProgress size={20} /> : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MyProfile;
