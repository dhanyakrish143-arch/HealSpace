import FloatingChatWidget from './components/FloatingChatWidget';
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import LandingPage from "./pages/public/LandingPage";
import BookingPage from "./pages/client/BookingPage";
import PatientPortal from "./pages/client/PatientPortal";
import LoginPage from "./pages/auth/LoginPage";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-portal" element={<PatientPortal />} />
        <Route path="/:slug" element={<BookingPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}