import { useEffect, useRef, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import api from "../../api/client";
import { getFullName } from "../../utils/userSession";

const pageTitles = {
  "/admin/dashboard": "Dashboard",
  "/admin/dashboard/students": "Students",
  "/admin/dashboard/students/add": "Add Student",
  "/admin/dashboard/companies": "Companies",
  "/admin/dashboard/drives": "Job Drives",
  "/admin/dashboard/applications": "Applications",
  "/admin/dashboard/placements": "Placements",
  "/admin/dashboard/reports": "Reports & Analytics",
  "/admin/dashboard/users": "Users Management",
  "/admin/dashboard/settings": "Settings",
  "/admin/dashboard/profile": "Profile",
  "/student/student-dashboard": "Dashboard",
  "/student/student-dashboard/academic-profile": "Academic Profile",
  "/student/student-dashboard/resume": "Resume Management",
  "/student/student-dashboard/jobs": "Jobs",
  "/student/student-dashboard/applications": "Applications",
  "/student/student-dashboard/upcoming-drives": "Upcoming Drives",
  "/student/student-dashboard/interviews": "Interview Schedule",
  "/student/student-dashboard/notifications": "Notifications",
  "/student/student-dashboard/settings": "Settings",
  "/recruiter/recruiter-dashboard": "Dashboard",
  "/recruiter/recruiter-dashboard/jobs": "Jobs",
  "/recruiter/recruiter-dashboard/applicants": "Applicants",
  "/recruiter/recruiter-dashboard/interviews": "Interviews",
  "/recruiter/company-details": "Company Details",
};

const DashboardHeader = ({ role, onMenuClick }) => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Dashboard";
  const dropdownRef = useRef(null);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    api.get("/user-api/profile")
      .then((res) => {
        const profile = res.data.payload;
        setUser(profile);
        const fullName = getFullName(profile);
        if (fullName) {
          localStorage.setItem("userName", fullName);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const profilePath =
    role === "admin"
      ? "/admin/dashboard/profile"
      : role === "student"
        ? "/student/student-dashboard/settings"
        : "/recruiter/company-details";

  const fullName = getFullName(user) || localStorage.getItem("userName") || "";
  const initials = fullName
    ? fullName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : role?.[0]?.toUpperCase();

  return (
    <header className="relative z-50 bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between shrink-0 animate-slide-down">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600"
          aria-label="Open menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div>
          {fullName && (
            <p className="text-xs text-gray-400 hidden sm:block">
              Welcome, <span className="font-medium text-gray-600">{fullName}</span>
            </p>
          )}
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{title}</h2>
        </div>
      </div>

      <div className="relative" ref={dropdownRef}>
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="flex items-center gap-2 sm:gap-3 hover:bg-gray-50 rounded-xl px-2 sm:px-3 py-2 transition-colors"
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            {fullName || "My Profile"}
          </span>
          <svg className="hidden sm:block w-4 h-4 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.942l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.24a.75.75 0 0 1-1.06 0L5.21 8.29a.75.75 0 0 1 .02-1.08Z" clipRule="evenodd" />
          </svg>
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-3 w-72 rounded-2xl border border-gray-100 bg-white shadow-xl shadow-slate-200/60 overflow-hidden z-[70]">
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shrink-0">
                {user?.profileImageUrl ? (
                  <img src={user.profileImageUrl} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">{fullName || "My Profile"}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || ""}</p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-blue-600 mt-1">{user?.role || role}</p>
              </div>
            </div>

            <div className="p-2">
              <Link
                to={profilePath}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50"
              >
                View Profile
              </Link>
              <Link
                to="/logout"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50"
              >
                Logout
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
