// src/components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center bg-black py-4 px-8 shadow-md">
      <Link to="/" className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
        VOID CITY
      </Link>
      <div className="flex gap-4">
        <Link to="/" className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl hover:opacity-90">Home</Link>
        <Link to="/login" className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl hover:opacity-90">Login</Link>
        <Link to="/signup" className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl hover:opacity-90">Signup</Link>
      </div>
    </nav>
  );
}
