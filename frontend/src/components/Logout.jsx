import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/client";
import { clearUserSession } from "../utils/userSession";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        await api.get("/user-api/logout");
      } catch {
        // Still clear local session even if the API call fails
      } finally {
        clearUserSession();
        toast.success("Logged out successfully");
        navigate("/login", { replace: true });
      }
    };

    logout();
  }, [navigate]);

  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="mt-4 text-gray-500 text-sm">Logging out...</p>
      </div>
    </div>
  );
};

export default Logout;
