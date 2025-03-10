import React, { useEffect } from "react";
import "./Login.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLoginUserMutation } from "../../features/api/authApi";
import { CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [loginUser, { data, isError, isSuccess, isLoading, error }] = useLoginUserMutation();
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    await loginUser(values);
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit, // ✅ Corrected
  });

  useEffect(() => {
    if (isSuccess && data) {
      toast.success(data?.message || "Login successful!");
      navigate("/"); 
    }

    if (isError && error) {
      toast.error(error?.data?.message || "Login failed. Please try again.");
    }
  }, [isSuccess, isError, data, error, navigate]);

  return (
    <div className="loginContainer">
      <div className="formContainer">
        <h1>Login Form</h1>
        <form onSubmit={formik.handleSubmit}>
          <div className="section-1">
            <label htmlFor="email">Email</label>
            <input
              placeholder="Enter valid email"
              type="email"
              name="email"
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && <p className="error">{formik.errors.email}</p>}
          </div>

          <div className="section-1">
            <label htmlFor="password">Password</label>
            <input
              placeholder="Enter password with at least 8 characters"
              type="password" // ✅ Fixed type
              name="password"
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && <p className="error">{formik.errors.password}</p>}
          </div>

          <div className="section-1">
            <button type="submit" disabled={isLoading}>
              {isLoading ? <CircularProgress size={18} /> : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
