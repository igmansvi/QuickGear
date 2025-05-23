import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Homepage from "../pages/Homepage";
import Browse from "../pages/Browse";
import Bookings from "../pages/Bookings";
import Profile from "../pages/Profile";
import ListItem from "../pages/ListItem";
import RentItem from "../pages/RentItem";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Header from "../components/ui/Header";
import Footer from "../components/ui/Footer";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import Admin from "../admin/pages/Admin";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes without Header/Footer */}
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        {/* Regular routes with Header/Footer */}
        <Route
          path="*"
          element={
            <>
              <Header />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Homepage />} />
                <Route
                  path="/browse"
                  element={
                    <ProtectedRoute>
                      <Browse />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/bookings"
                  element={
                    <ProtectedRoute>
                      <Bookings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/list-item"
                  element={
                    <ProtectedRoute>
                      <ListItem />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/rent-item/:id"
                  element={
                    <ProtectedRoute>
                      <RentItem />
                    </ProtectedRoute>
                  }
                />
              </Routes>
              <Footer />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
