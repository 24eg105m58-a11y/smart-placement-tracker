import { NavLink } from "react-router-dom";

const Header = ({ isLoggedIn }) => {
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <NavLink to="/" className="text-xl font-bold text-blue-600">
          Smart Placement
        </NavLink>

        <div className="flex items-center gap-4 sm:gap-6">
          <NavLink to="/" className="text-sm text-gray-600 hover:text-blue-600 font-medium hidden sm:block">
            Home
          </NavLink>

          {!isLoggedIn ? (
            <>
              <NavLink
                to="/login"
                className="text-sm text-gray-600 hover:text-blue-600 font-medium"
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 font-medium transition-colors"
              >
                Register
              </NavLink>
            </>
          ) : (
            <NavLink
              to="/logout"
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Logout
            </NavLink>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
