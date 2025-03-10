import { useRoutes } from "react-router-dom";
import Login from "../components/login/Login";
import Register from "../components/register/Register";
import Home from "../pages/home/Home";
import MyLearning from "../pages/student/MyLearning";
import MyProfile from "../pages/student/MyProfile";
import EditProfile from "../pages/student/EditProfile";
import AddCourse from "../pages/admin/course/AddCourse";
import Dashboard from "../pages/admin/dashboard/Dashboard";
import AdminDashboard from "../pages/admin/adminDashboard/AdminDashboard";
import Courses from "../pages/admin/courses/Courses";
import EditCourse from "../pages/admin/courses/EditCourse";
import AddLectures from "../pages/admin/courses/AddLectures";
import EditLectures from "../pages/admin/courses/EditLectures";
import CourseDetails from "../pages/admin/courses/CourseDetails";
import CourseProgress from "../pages/admin/courses/CourseProgress";
import SearchPage from "../pages/admin/search/SearchPage";
import {
  AdminRoute,
  AuthencticatedUser,
  ProtectedRoute,
  PurchaseCourseProtectRoute,
} from "./ProtectedRoutes";

const AppRoutes = () => {
  const routes = [
    { path: "/", element: <Home /> },
    { path: "/register", element: <Register /> },
    {
      path: "/login",
      element: (
        <AuthencticatedUser>
          <Login />{" "}
        </AuthencticatedUser>
      ),
    },
    {
      path: "/mylearning",
      element: (
        <ProtectedRoute>
          <MyLearning />
        </ProtectedRoute>
      ),
    },
    {
      path: "/myProfile",
      element: (
        <ProtectedRoute>
          <MyProfile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/editProfile",
      element: (
        <ProtectedRoute>
          <EditProfile />
        </ProtectedRoute>
      ),
    },
    {
      path: "/course/:courseId",
      element: (
        <ProtectedRoute>
          <CourseDetails />
        </ProtectedRoute>
      ),
    },
    {
      path: "/course-progress/:courseId",
      element: (
        <ProtectedRoute>
          <PurchaseCourseProtectRoute>
            <CourseProgress />
          </PurchaseCourseProtectRoute>
        </ProtectedRoute>
      ),
    },
    {
      path: "/course/search",
      element: (
        <ProtectedRoute>
          <SearchPage />
        </ProtectedRoute>
      ),
    },

    {
      path: "/admin",
      element: (
        <AdminRoute>
          <Dashboard />
        </AdminRoute>
      ),
      children: [
        { path: "/admin/dashboard", element: <AdminDashboard /> },
        { path: "/admin/courses", element: <Courses /> },
        { path: "/admin/addcourse", element: <AddCourse /> },

        { path: "/admin/addlecture/:id", element: <AddLectures /> },
        { path: "/admin/course/edit/:courseId", element: <EditCourse /> },
        {
          path: "/admin/course/:courseId/lecture/edit/:lectureId",
          element: <EditLectures />,
        },
      ],
    },
  ];
  return useRoutes(routes);
};

export default AppRoutes;
