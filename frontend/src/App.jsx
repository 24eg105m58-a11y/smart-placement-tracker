import React from "react";
import { Toaster } from "react-hot-toast";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

/* Layout */
import RootLayout from "./components/RootLayout";

/* Public Pages */
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";

/* Student */
import StudentDashboard from "./components/Dashboards/StudentDashboard";

/* Recruiter */
import RecruiterDashboard from "./components/Dashboards/RecruiterDashboard";

/* Admin / TPO */
import AdminDashboard from "./components/Dashboards/AdminDashboard";

/* Academic Details */
import AcademicDetails from "./components/AcademicDetails";

// Company Details
import CompanyDetails from "./components/CompanyDetails";

const App = () => {
  const routerObj = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,

      children: [
        /* HOME */
        {
          path: "",
          element: <Home />,
        },

        /* AUTH */
        {
          path: "register",
          element: <Register />,
        },

        {
          path: "login",
          element: <Login />,
        },

        /* STUDENT ROUTES */
        {
          path: "student",

          children: [
            {
              path: "dashboard",
              element: <StudentDashboard />,
            },

            {
              path: "academic-details",
              element: <AcademicDetails />,
            },
          ],
        },

        /* RECRUITER ROUTES */
        {
          path: "recruiter",

          children: [
            {
              path: "dashboard",
              element: <RecruiterDashboard />,
            },
            {
              path: "company-details",
              element: <CompanyDetails />,
            },
          ],
        },

        /* ADMIN / TPO ROUTES */
        {
          path: "admin",

          children: [
            {
              path: "dashboard",
              element: <AdminDashboard />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <div>
      {/* TOAST NOTIFICATIONS */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* ROUTER */}
      <RouterProvider router={routerObj} />
    </div>
  );
};

export default App;
