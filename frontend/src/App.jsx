import React from "react";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./components/RootLayout";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Logout from "./components/Logout";

import StudentLayout from "./components/Dashboards/StudentLayout";
import StudentDashboard from "./components/Dashboards/StudentDashboard";
import AcademicProfile from "./components/AcademicProfile";
import AcademicDetails from "./components/AcademicDetails";
import Resume from "./components/Resume";
import Applications from "./components/Applications";
import StudentJobs from "./components/student/Jobs";
import AIInsights from "./components/student/AIInsights";
import Notifications from "./components/Notifications";
import Settings from "./components/Settings";
import UpcomingDrives from "./components/student/UpcomingDrives";
import Interviews from "./components/student/Interviews";

import RecruiterLayout from "./components/Dashboards/RecruiterLayout";
import RecruiterDashboard from "./components/Dashboards/RecruiterDashboard";
import CompanyDetails from "./components/CompanyDetails";
import RecruiterJobs from "./components/recruiter/Jobs";
import Applicants from "./components/recruiter/Applicants";
import RecruiterInterviews from "./components/recruiter/RecruiterInterviews";

import DashboardLayout from "./components/Dashboards/DashboardLayout";
import AdminDashboard from "./components/Dashboards/AdminDashboard";
import StudentsList from "./components/admin/StudentsList";
import AddStudent from "./components/admin/AddStudent";
import CompaniesList from "./components/admin/CompaniesList";
import JobDrives from "./components/admin/JobDrives";
import AdminApplications from "./components/admin/AdminApplications";
import Placements from "./components/admin/Placements";
import Reports from "./components/admin/Reports";
import UsersManagement from "./components/admin/UsersManagement";
import AdminSettings from "./components/admin/AdminSettings";
import AdminProfile from "./components/admin/AdminProfile";
import InterviewJobDetails from "./components/student/InterviewJobDetails";

import ApplicationDetails from "./components/student/ApplicationDetails";
const routerObj = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
      { path: "logout", element: <Logout /> },

      /* STUDENT */
      {
        path: "student",
        children: [
          { path: "academic-details", element: <AcademicDetails /> },
          {
            element: <StudentLayout />,
            children: [
              { path: "student-dashboard", element: <StudentDashboard /> },
              {
                path: "student-dashboard/academic-profile",
                element: <AcademicProfile />,
              },
              { path: "student-dashboard/resume", element: <Resume /> },
              { path: "student-dashboard/jobs", element: <StudentJobs /> },
              {
                path: "student-dashboard/ai-insights",
                element: <AIInsights />,
              },
              {
                path: "student-dashboard/applications",
                element: <Applications />,
              },
              {
                path: "student-dashboard/upcoming-drives",
                element: <UpcomingDrives />,
              },
              { path: "student-dashboard/interviews", element: <Interviews /> },
              {
                path: "student-dashboard/notifications",
                element: <Notifications />,
              },
              { path: "student-dashboard/settings", element: <Settings /> },
              {
                path: "student-dashboard/job/:jobId",
                element: <InterviewJobDetails />,
              },
              {
                path: "student-dashboard/application/:applicationId",
                element: <ApplicationDetails />,
              },
            ],
          },
        ],
      },

      /* RECRUITER */
      {
        path: "recruiter",
        children: [
          { path: "company-details", element: <CompanyDetails /> },
          {
            element: <RecruiterLayout />,
            children: [
              { path: "recruiter-dashboard", element: <RecruiterDashboard /> },
              { path: "recruiter-dashboard/jobs", element: <RecruiterJobs /> },
              {
                path: "recruiter-dashboard/applicants",
                element: <Applicants />,
              },
              {
                path: "recruiter-dashboard/interviews",
                element: <RecruiterInterviews />,
              },
              { path: "recruiter-dashboard/settings", element: <Settings /> },
            ],
          },
        ],
      },

      /* ADMIN */
      {
        path: "admin/dashboard",
        element: <DashboardLayout role="admin" />,
        children: [
          { index: true, element: <AdminDashboard /> },
          { path: "students", element: <StudentsList /> },
          { path: "students/add", element: <AddStudent /> },
          { path: "companies", element: <CompaniesList /> },
          { path: "drives", element: <JobDrives /> },
          { path: "applications", element: <AdminApplications /> },
          { path: "placements", element: <Placements /> },
          { path: "reports", element: <Reports /> },
          { path: "users", element: <UsersManagement /> },
          { path: "settings", element: <AdminSettings /> },
          { path: "profile", element: <AdminProfile /> },
        ],
      },
    ],
  },
]);

const App = () => {
  return (
    <>
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <RouterProvider router={routerObj} />
    </>
  );
};

export default App;
