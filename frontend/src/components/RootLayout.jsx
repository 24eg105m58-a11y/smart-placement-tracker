import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    // h-screen locks the outer layout container exactly to the viewport height
    // overflow-hidden prevents the outer page body from scrolling entirely
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header stays pinned at the top */}
      <Header />

      {/* Main viewport region takes up remaining space between Header and Footer */}
      <main className="flex-1 min-h-0 bg-gray-50 overflow-y-auto">
        <Outlet />
      </main>

      {/* Footer stays pinned at the bottom */}
      <Footer />
    </div>
  );
};

export default RootLayout;
