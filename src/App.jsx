// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
// import Signup from "./pages/Signup";
import VoidCityAdminPanel from "./pages/AdminPanel";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('jwtToken');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<VoidCityAdminPanel />} />
        <Route path="/dashboard" element={<ProtectedRoute><VoidCityAdminPanel /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
