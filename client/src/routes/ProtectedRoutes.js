import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useGetCourseDetailsWithPurchaseStatusQuery } from "../features/api/courseApi";
import Loader from "../components/helper/loader/Loader";
import { useLoadUserQuery } from "../features/api/authApi";

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : null;
};

export const AuthencticatedUser = ({ children }) => {
  const { isAuthenticated } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return !isAuthenticated ? children : null;
};

export const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user?.role !== "instructor") {
      navigate("/");
    }
  }, [isAuthenticated, user, navigate]);

  return isAuthenticated && user?.role === "instructor" ? children : null;
};

export const PurchaseCourseProtectRoute = ({ children }) => {
  const { courseId } = useParams();
 
const {data,isLoading}=useLoadUserQuery()
const isEnrolled = data?.user?.enrolledCourses?.some(
  (curEnrolledCourse) => curEnrolledCourse?._id === courseId
);
console.log(isEnrolled);

  if (isLoading) return <Loader />;
  if (!data || !isEnrolled) return <Navigate to={`/course/${courseId}`} />;

  return children;
};
