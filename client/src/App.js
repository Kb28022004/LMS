import React from "react";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "react-hot-toast";
import Header from "./components/layout/header/Header";
import { useLoadUserQuery } from "./features/api/authApi";
import Loader from "./components/helper/loader/Loader";
const App = () => {
  const Custom = ({ children }) => {
    const { isLoading } = useLoadUserQuery();
    return <>{isLoading ? <Loader /> : <>{children}</>}</>;
  };

  return (
    <>
      <Router>
        <Toaster position="button-right" />
        <Header />
        <Custom>
          <AppRoutes />
        </Custom>
      </Router>
    </>
  );
};

export default App;
