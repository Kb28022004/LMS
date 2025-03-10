import React, { useEffect, useState } from "react";
import "../Header.css";
import SchoolIcon from "@mui/icons-material/School";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  Avatar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "../../../features/api/authApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const {user}=useSelector(store=>store.auth)
  
  const navigate=useNavigate()

  const handleMouseEnter = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data.message || "log out successully");
      navigate('/login')
    }
  }, [isSuccess]);

  

  return (
    <nav id="navbar">
      <div style={{marginLeft:"150px"}} className="leftSection">
        <div className="section-1">
          <SchoolIcon fontSize="large" />
        </div>
        <div className="section-2">
         <NavLink style={{textDecoration:"none",color:"black"}} to='/' > <h1>E-LEARNING</h1></NavLink>
        </div>
      </div>
      <div className="rightSection">
        {
          user && (
            <div className="section-3">
          <Avatar src={user?.profilePicture} onMouseEnter={handleMouseEnter} sx={{ cursor: "pointer" }} />
          <Menu
            anchorEl={anchorEl}
            fullWidth
            sx={{ marginTop: "15px" }}
            open={Boolean(anchorEl)}
            onClose={handleMouseLeave}
            MenuListProps={{
              onMouseLeave: handleMouseLeave,
            }}
            anchorOrigin={{
              vertical: "bottom",
              gap: "12px",
              horizontal: "left",
            }}
          >
            <MenuItem>
              {" "}
              <NavLink
                to="/mylearning"
                style={{ color: "black", textDecoration: "none" }}
              >
                My Learning
              </NavLink>{" "}
            </MenuItem>
            <MenuItem>
              {" "}
              <NavLink
                to="/myProfile"
                style={{ color: "black", textDecoration: "none" }}
              >
                My Profile
              </NavLink>
            </MenuItem>
           
            <MenuItem
              sx={{ display: "flex", gap: "120px", alignItems: "center" }}
              onClick={handleLogout}
            >
              <Typography>Logout</Typography>
              <IconButton>
                <LogoutIcon />
              </IconButton>
            </MenuItem>
            {user?.role === "instructor" && (
              <MenuItem>
                <Button variant="outlined" fullWidth>
                  <NavLink
                    to="/admin/dashboard"
                    style={{ color: "black", textDecoration: "none" }}
                  >
                    Dashboard
                  </NavLink>
                </Button>
              </MenuItem>
            )}
          </Menu>
        </div>
          )
        }
        {!user && (
          <div className="section-4">
            <NavLink to="/register">
              {" "}
              <Button variant="contained">Register</Button>
            </NavLink>
            <NavLink to="/login">
              {" "}
              <Button variant="contained">Login</Button>
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
