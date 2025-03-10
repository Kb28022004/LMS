import React from "react";
import { Drawer, useMediaQuery } from "@mui/material";
import { NavLink, useNavigate } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";

import "./Sidebar.css";

const Sidebar = ({ openSidebar, setopenSidebar }) => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const listData = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <DashboardIcon /> },
    { name: "Courses", path: "/admin/courses", icon: <PeopleIcon /> },
  ];

  const handleLogout = async () => {};

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      anchor="left"
      open={openSidebar}
      onClose={() => setopenSidebar(false)}
      sx={{
        width: 234,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 234,
          boxSizing: "border-box",
boxShadow:"0 0 10px 0 black",
          background:
            "linear-gradient(to right, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
        },
      }}
    >
      <div className="drawerContainer">
        {/* Logo Section */}
        <div className="logoSection">
          <h1>LMS</h1>
          <hr />
        </div>

        {/* Menu Items */}
        <div className="itemSections">
          {listData.map((item, index) => (
            <NavLink
              style={{ color: "black", textDecoration: "none" }}
              to={item.path}
              key={index}
              className={({ isActive }) =>
                isActive ? "listData active" : "listData"
              }
              onClick={() => isMobile && setopenSidebar(false)}
            >
              <div className="listItem">
                {item.icon}
                <p>{item.name}</p>
              </div>
            </NavLink>
          ))}
        </div>

       
      </div>
    </Drawer>
  );
};

export default Sidebar;
