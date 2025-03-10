import React, { useEffect } from "react";
import "./AdminDashboard.css";
import { Card, CardContent, Typography } from "@mui/material";
import {
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { useGetPurchasedCourseQuery } from "../../../features/api/purchaseApi";
import toast from "react-hot-toast";
import Loader from "../../../components/helper/loader/Loader";

const AdminDashboard = () => {
  const { data, isLoading, refetch, isError, error, isSuccess } = useGetPurchasedCourseQuery();

  console.log(data);

  // Safely handle purchased courses and revenue calculations
  const purchasedCourse = data?.purchasedCourse?.length || 0;
  const totalRevenue = data?.purchasedCourse?.reduce((accu, curPurchased) => {
    return accu + (curPurchased?.amount || 0);
  }, 0).toLocaleString("en-IN");

  // Mapping Course Data for Chart
  const courseData = (data?.purchasedCourse ?? []).map((curPurchasedCourse) => ({
    name: curPurchasedCourse.courseId?.courseTitle || "Unknown Course",
    price: curPurchasedCourse.courseId?.coursePrice || 0,
  }));

  useEffect(() => {
    if (isSuccess && data) {
      refetch();
    }
    if (isError && error) {
      toast.error(error?.data?.message || "Something went wrong!");
    }
  }, [isError, error, isSuccess, data, refetch]);

  return isLoading ? (
    <Loader />
  ) : (
    <div className="adminDashboardMainContainer">
      <div className="adminDashboardContainer">
        {/* Upper Section */}
        <div className="adminDashboardUpperSection">
          <Card className="adminDashboardUpperSection-card1">
            <h3>Total Sales</h3>
            <h1>{purchasedCourse}</h1>
          </Card>
          <Card className="adminDashboardUpperSection-card2">
            <h3>Total Revenue</h3>
            <h1>₹{totalRevenue}</h1>
          </Card>
        </div>

        {/* Lower Section with Chart */}
        <div className="adminDashboardLowerSection">
          <Card className="adminDashboardLowerSection-card1">
            <Typography variant="h6">Course Price Trends</Typography>
            <CardContent style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height={230}>
                <LineChart data={courseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip formatter={(value, name) => [`₹${value.toLocaleString("en-IN")}`, name]} />
                  <Line
                    type="monotone"
                    dataKey="price"
                    dot={{ stroke: "#4a90e2", strokeWidth: 2 }}
                    stroke="blueviolet"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
