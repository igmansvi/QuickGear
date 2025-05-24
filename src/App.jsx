import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { ReviewProvider } from "./context/ReviewContext";
import { BookingProvider } from "./context/BookingContext";
import { NotificationProvider } from "./context/NotificationContext";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <div className="App">
      <AuthProvider>
        <ProductProvider>
          <ReviewProvider>
            <BookingProvider>
              <NotificationProvider>
                <AppRoutes />
              </NotificationProvider>
            </BookingProvider>
          </ReviewProvider>
        </ProductProvider>
      </AuthProvider>
    </div>
  );
};

export default App;