# QuickGear - Equipment Rental Platform

## Overview

QuickGear is a modern equipment rental platform that connects users with high-quality equipment for rent. The platform allows users to browse available items, make bookings, manage their rental history, and receive notifications about their bookings.

## Tech Stack

- **Frontend**: React.js with TailwindCSS
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Data Storage**: Local storage with simulated API calls
- **UI Components**: Custom components with FontAwesome icons

## Features

### User Features

- **Authentication**: Login, register, and profile management
- **Product Browsing**: Browse products by category with filtering options
- **Booking System**: Create and manage equipment bookings
- **Reviews**: Submit and view product reviews
- **Notifications**: Receive real-time notifications about booking status changes
- **User Dashboard**: View booking history and manage account settings

### Admin Features

- **Dashboard**: Overview of platform performance with analytics
- **Product Management**: Add, edit, and delete products
- **Booking Management**: Track and update booking statuses
- **User Management**: View and manage user accounts
- **Reports**: Generate and export data reports

## Project Progress

### Completed

- ✅ User authentication with session management
- ✅ Product browsing and filtering
- ✅ Booking creation and management
- ✅ Review submission system
- ✅ Notification system for booking updates
- ✅ Admin dashboard with analytics
- ✅ Responsive design for all screen sizes
- ✅ Role-based access control (user vs admin)

### In Progress

- 🔄 Payment processing integration
- 🔄 Backend API development with Express
- 🔄 MongoDB integration for persistent storage
- 🔄 Enhanced admin reporting features
- 🔄 Email notification system

## Implementation Details

### Frontend Architecture

The application uses React Context API for state management with the following contexts:

- `AuthContext`: Manages user authentication state
- `ProductContext`: Handles product data and operations
- `BookingContext`: Manages booking creation and status updates
- `NotificationContext`: Handles user notifications
- `ReviewContext`: Manages product reviews

### Simulated Backend

The current implementation uses a simulated backend with the following services:

- `ApiService`: Simulates API calls with local storage
- `AdminApiService`: Provides admin-specific functionality

## Future Enhancements

1. **Real Backend Implementation**

   - Replace simulated API with Express.js backend
   - Implement MongoDB for data persistence
   - Create RESTful API endpoints for all functionality

2. **Enhanced User Experience**

   - Implement real-time chat support
   - Add advanced search and filtering options
   - Develop a recommendation system based on user preferences

3. **Business Expansion**
   - Implement multi-vendor support
   - Add location-based product availability
   - Develop a mobile application

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies: `npm install` or `yarn install`
3. Start the development server: `npm run dev` or `yarn dev`
4. Access the application at `http://localhost:5173`

### Admin Access

- Login with admin credentials to access the admin dashboard
- Admin panel is available at `/admin` route (requires admin privileges)

## Project Structure

```
quick-gear-mern/
├── src/
│   ├── admin/             # Admin dashboard components and logic
│   ├── components/        # Reusable UI components
│   ├── context/           # React context for state management
│   ├── pages/             # Page components
│   ├── services/          # API and service layer
│   ├── staticDB/          # Local storage simulation
│   ├── assets/            # Static assets
│   ├── App.jsx            # Main application component
│   └── main.jsx           # Application entry point
└── public/                # Public assets
```
