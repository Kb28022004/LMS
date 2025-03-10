import React, { useState } from "react";
import "./Dashboard.css";
import { Outlet } from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import Header from "../../../components/layout/header/Header";

const Dashboard = () => {
  const [openSidebar, setopenSidebar] = useState(true);

  return (
    <div className="dashboardContainer">
 
      {openSidebar && (
        <div>
          <Sidebar openSidebar={openSidebar} setopenSidebar={setopenSidebar} />
        </div>
      )}
      
      <div className="dashboardHeader">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;