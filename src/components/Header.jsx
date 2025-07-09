import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path) =>
    location.pathname === path
      ? "bg-blue-700"
      : "bg-blue-500 hover:bg-blue-600";

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-blue-700">
          📂 QR Document Manager
        </h1>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          ☰
        </button>

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-3">
          <Link
            to="/"
            className={`text-white px-4 py-2 rounded-md text-sm font-medium ${isActive(
              "/"
            )}`}
          >
            🔍 Scan / Add QR
          </Link>

          <Link
            to="/list"
            className={`text-white px-4 py-2 rounded-md text-sm font-medium ${isActive(
              "/list"
            )}`}
          >
            👥 View Employees
          </Link>
        </nav>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <nav className="flex flex-col gap-2">
            <Link
              to="/"
              onClick={() => setMenuOpen(false)}
              className={`text-white px-4 py-2 rounded-md text-sm font-medium ${isActive(
                "/"
              )}`}
            >
              🔍 Scan / Add QR
            </Link>

            <Link
              to="/list"
              onClick={() => setMenuOpen(false)}
              className={`text-white px-4 py-2 rounded-md text-sm font-medium ${isActive(
                "/list"
              )}`}
            >
              👥 View Employees
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
