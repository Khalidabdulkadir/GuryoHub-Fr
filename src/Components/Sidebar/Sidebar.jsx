import React, { useState } from "react";
import { Nav } from "react-bootstrap";
import {
  FaHome,
  FaUser,
  FaCog,
  FaChartLine,
  FaSignOutAlt,
  FaHotel,
  FaPlus,
  FaImage,
  FaList,
} from "react-icons/fa"; // Import icons from React Icons
import { Link, useNavigate } from "react-router-dom"; // Use Link from react-router-dom for navigation
import { useDispatch, useSelector } from "react-redux"; // Redux hooks
import { setAuth } from "../../Redux/authSlice"; // Import your auth slice action
import "./Sidebar.css"; // Custom CSS for the sidebar

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false); // State to handle sidebar collapse
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.value); // Get authentication state from Redux

  // Toggle sidebar collapse
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  // Handle logout
  const handleLogout = () => {
    // Clear the token from cookies or local storage
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    dispatch(setAuth(false)); // Set authentication state to false
    navigate("/"); // Redirect to login page
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <h3>{collapsed ? "M" : "MyApp"}</h3>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {collapsed ? ">" : "<"}
        </button>
      </div>

      {/* Sidebar Menu */}
      <Nav className="flex-column">
        <Nav.Link as={Link} to="/dashboard">
          <FaHome className="icon" />
          {!collapsed && "Dashboard"}
        </Nav.Link>
        <Nav.Link as={Link} to="/hosts">
          <FaUser className="icon" />
          {!collapsed && "Hosts"}
        </Nav.Link>
        <Nav.Link as={Link} to="/hotel">
          <FaHotel className="icon" />
          {!collapsed && "Hotels"}
        </Nav.Link>
        <Nav.Link as={Link} to="/room">
          <FaHotel className="icon" />
          {!collapsed && "Rooms"}
        </Nav.Link>
        <Nav.Link as={Link} to="/add-room">
          <FaPlus className="icon" />
          {!collapsed && "Create Rooms"}
        </Nav.Link>
        <Nav.Link as={Link} to="/add-hotel">
          <FaPlus className="icon" />
          {!collapsed && "Create Hotel"}
        </Nav.Link>
        <Nav.Link as={Link} to="/property">
          <FaChartLine className="icon" />
          {!collapsed && "Create Properties"}
        </Nav.Link>
        <Nav.Link as={Link} to="/images">
          <FaImage className="icon" />
          {!collapsed && "Upload Images"}
        </Nav.Link>
        <Nav.Link as={Link} to="/listing">
          <FaList className="icon" />
          {!collapsed && "Listings"}
        </Nav.Link>
        <Nav.Link as={Link} to="/register">
          <FaUser className="icon" />
          {!collapsed && "Register"}
        </Nav.Link>
        {/* Logout Button */}
        {isAuthenticated && (
          <Nav.Link onClick={handleLogout}>
            <FaSignOutAlt className="icon" />
            {!collapsed && "Logout"}
          </Nav.Link>
        )}
      </Nav>
    </div>
  );
};

export default Sidebar;