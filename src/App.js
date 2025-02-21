import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import HomeRealEstate from "./Components/Hosts/Home";
import Hosts from "./Components/Hosts/Hosts";
import Properties from "./Components/Hosts/Property/CreateProperties";
import PropertyDetails from "./Components/Hosts/Property/PropertyDetails";
import PropertyImageUploadForm from "./Components/Hosts/Property/PropertyImageUploadForm";
import PropertyList from "./Components/Hosts/Property/Listings";
import Sidebar from "./Components/Sidebar/Sidebar";
import "./App.css"; // Add custom CSS for layout
import Dashboard from "./Components/Dashboard/Dashboard";
import ForSale from "./Components/Hosts/ForSale/ForSale";
import Register from "./authentications/Register";
import Login from "./authentications/Login";
import { Forgot } from "./authentications/Forgot";
import ProtectedRoute from "./authentications/ProtectedRoute";
import Land from "./Components/Hosts/LandForSale/Land";
import HotelsList from "./Components/Hotels/HotelListing";
import RoomsList from "./Components/Rooms/RoomList";
import CreateHotel from "./Components/Hotels/CreateHotel";
import RoomsListing from "./Components/Hosts/Rooms/RoomListing";
import CreateRoom from "./Components/Rooms/CreateRooms";
import RoomDetails from "./Components/Hosts/Rooms/RoomDetails";
import PageNotFound from "./NotFoundPge/PageNotFound";

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation(); // Get the current route location

  // Check if the current route is the root path ("/"), property details page ("/property/:id"), or "/for-sale"
  const isRootOrPropertyDetailsOrForSale =
    location.pathname === "/" ||
    location.pathname.startsWith("/property/") ||
    location.pathname.startsWith("/rooms/") ||
    location.pathname === "/for-sale" ||
    location.pathname === "/to-rent" ||
    location.pathname === "/land-for-sale" ||
    location.pathname === "/login" ||
    location.pathname === "/rooms" ||
    location.pathname === "/forgot";

  return (
    <div className="App">
      {/* Display Sidebar and main-content only if the route is not root, property details, or for-sale */}
      {!isRootOrPropertyDetailsOrForSale && (
        <>
          <Sidebar />
          <div className="main-content">
            {/* Navigation Links */}
            <Routes>

            <Route
          path="/dashboard"
          element={
              <Dashboard />
          }
        />
            <Route path="/hosts" element={<Hosts />} />
            <Route path="/property" element={<Properties />} />
            <Route path="/images" element={<PropertyImageUploadForm />} />
            <Route path="/listing" element={<PropertyList />} />
            <Route path="/hotel" element={<HotelsList />} />
            <Route path="/room" element={<RoomsList />} />
            <Route path="/add-hotel" element={<CreateHotel/>} />
            <Route path="/add-room" element={<CreateRoom/>} />
            <Route path="/register" element={<Register/>} />
            <Route path="*" element={<PageNotFound/>} />
            </Routes>
            {/* Routes */}
          </div>
        </>
      )}

      {/* Display HomeRealEstate only at the root path ("/") */}
      {location.pathname === "/" && <HomeRealEstate />}

      {/* Display PropertyDetails and ForSale outside the sidebar and main-content */}
      {isRootOrPropertyDetailsOrForSale && (
        <Routes>
          <Route path="/property/:id" element={<PropertyDetails />} />
          <Route path="/rooms/:id" element={<RoomDetails />} />
          <Route path="/for-sale" element={<ForSale />} />
          <Route path="/rooms" element={<RoomsListing />} />
          <Route path="/land-for-sale" element={<Land />} />
          <Route path="/to-rent" element={<HomeRealEstate/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/forgot" element={<Forgot/>} />
            
        </Routes>
      )}
    </div>
  );
}

export default App;
