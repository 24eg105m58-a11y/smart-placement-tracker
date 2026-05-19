import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-slate-950 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        <h1 className="text-2xl font-bold tracking-wide">
          Career <span className="text-blue-400">Canopy</span>
        </h1>

        <nav className="flex gap-6 text-lg">
          <NavLink to="/" className="hover:text-blue-400 transition">
            Home
          </NavLink>

          <NavLink to="/register" className="hover:text-blue-400 transition">
            Register
          </NavLink>

          <NavLink to="/login" className="hover:text-blue-400 transition">
            Login
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
