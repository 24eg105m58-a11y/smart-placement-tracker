import React from "react";
import { Toaster } from "react-hot-toast";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

/* Layout */
import RootLayout from "./components/RootLayout";

/* Public */
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";

/* Student */
import StudentLayout from "./components/Dashboards/StudentLayout";
import StudentDashboard from "./components/Dashboards/StudentDashboard";
import AcademicProfile from "./components/AcademicProfile";
import AcademicDetails from "./components/AcademicDetails";

/* Student Pages */
import Resume from "./components/Resume";
import Applications from "./components/Applications";
import Notifications from "./components/Notifications";
import Settings from "./components/Settings";

/* Recruiter */
import DashboardLayout from "./components/Dashboards/DashboardLayout";
import RecruiterDashboard from "./components/Dashboards/RecruiterDashboard";
import CompanyDetails from "./components/CompanyDetails";

/* Admin */
import AdminDashboard from "./components/Dashboards/AdminDashboard";

const routerObj = createBrowserRouter([
  {
    path: "/",

    element: <RootLayout />,

    children: [
      /* ================= HOME ================= */

      {
        index: true,

        element: <Home />,
      },

      {
        path: "register",

        element: <Register />,
      },

      {
        path: "login",

        element: <Login />,
      },

      /* ================= STUDENT ================= */

      {
        path: "student",

        element: <StudentLayout />,

        children: [
          {
            path: "student-dashboard",

            children: [
              {
                index: true,

                element: <StudentDashboard />,
              },

              {
                path: "academic-profile",

                element: <AcademicProfile />,
              },

              {
                path: "academic-details",

                element: <AcademicDetails />,
              },

              {
                path: "resume",

                element: <Resume />,
              },

              {
                path: "applications",

                element: <Applications />,
              },

              {
                path: "notifications",

                element: <Notifications />,
              },

              {
                path: "settings",

                element: <Settings />,
              },
            ],
          },
        ],
      },

      /* ================= RECRUITER ================= */

      {
        path: "recruiter/dashboard",

        element: <DashboardLayout role="recruiter" />,

        children: [
          {
            index: true,

            element: <RecruiterDashboard />,
          },

          {
            path: "company-details",

            element: <CompanyDetails />,
          },
        ],
      },

      /* ================= ADMIN ================= */

      {
        path: "admin/dashboard",

        element: <DashboardLayout role="admin" />,

        children: [
          {
            index: true,

            element: <AdminDashboard />,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  return (
    <>
      <Toaster position="top-center" />

      <RouterProvider router={routerObj} />
    </>
  );
};

export default App;
