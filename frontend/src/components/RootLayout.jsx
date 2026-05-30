import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const dashboardPrefixes = ["/student/student-dashboard", "/student/academic-details", "/recruiter/recruiter-dashboard", "/recruiter/company-details", "/admin/dashboard"];

const RootLayout = () => {
  const location = useLocation();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const isDashboard = dashboardPrefixes.some((p) => location.pathname.startsWith(p));

  if (isDashboard) {
    return <Outlet />;
  }

  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-1 bg-gray-50 min-h-[calc(100vh-120px)]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default RootLayout;
