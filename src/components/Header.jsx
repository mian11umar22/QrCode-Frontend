import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-blue-700"
      : "bg-blue-500 hover:bg-blue-600";

  return (
    <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-700">
        📂 QR Document Manager
      </h1>

      <div className="flex gap-3">
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
          className={`whitespace-nowrap text-white px-4 py-2 rounded-md text-sm font-medium ${isActive(
            "/list"
          )}`}
        >
          👥 View Employees
        </Link>
      </div>
    </header>
  );
}
