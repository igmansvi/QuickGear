import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "../admin/pages/Admin";
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
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin/*"
          element={
            <AdminRoute>
              <Admin />
            </AdminRoute>
          }
        />

        <Route
          path="/"
          element={
            <>
              <Header />
              <Routes>
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
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
                <Route path="*" element={<NotFound />} />
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