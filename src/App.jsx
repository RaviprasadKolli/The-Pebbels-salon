import React, { useState, useEffect, useCallback } from "react";
import Navigation from "./components/Navigation";
import HeroSection from "./components/HeroSection";
import ServicesSection from "./components/ServicesSection";
import BookingSection from "./components/BookingSection";
import ReviewsSection from "./components/ReviewsSection";
import ContactSection from "./components/ContactSection";
import AdminPanel from "./components/AdminPanel";
import AdminLogin from "./components/AdminLogin";
import BookingStatus from "./components/BookingStatus";
import Footer from "./components/Footer";
import {
  getAllBookings,
  updateBookingStatus as updateBookingStatusInDB,
  deleteBooking as deleteBookingFromDB,
} from "./services/storageService";

// Helper function to check if admin session is valid
const checkAdminSession = () => {
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const loginTime = localStorage.getItem("loginTime");

  if (!isAdmin || !loginTime) {
    return false;
  }

  // Auto-logout after 8 hours
  const eightHours = 8 * 60 * 60 * 1000;
  const timeSinceLogin = Date.now() - new Date(loginTime).getTime();

  if (timeSinceLogin > eightHours) {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("loginTime");
    return false;
  }

  return true;
};

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    checkAdminSession()
  );

  // Load bookings from Firebase when app starts

  // Load bookings from Firebase
  const loadBookings = useCallback(() => {
    setIsLoadingBookings(true);

    // Get bookings from localStorage (synchronous)
    const bookings = getAllBookings();
    setBookings(bookings);
    console.log("📚 Loaded bookings:", bookings.length);

    setIsLoadingBookings(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBookings();
  }, [loadBookings]);

  const scrollToSection = (section) => {
    setActiveSection(section);
    setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleAdminClick = () => {
    if (isAuthenticated) {
      setIsAdminMode(!isAdminMode);
      if (!isAdminMode) {
        // Reload bookings when opening admin panel
        loadBookings();
        setTimeout(() => {
          document
            .getElementById("admin")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      setShowAdminLogin(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowAdminLogin(false);
    setIsAdminMode(true);
    loadBookings();
    setTimeout(() => {
      document.getElementById("admin")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("loginTime");
    setIsAuthenticated(false);
    setIsAdminMode(false);
    scrollToSection("home");
  };

  const handleBookingSuccess = () => {
    // Reload bookings after new booking
    loadBookings();
    setTimeout(() => {
      scrollToSection("status");
    }, 1000);
  };

  const updateBookingStatus = async (id, status) => {
    const result = await updateBookingStatusInDB(id, status);
    if (result.success) {
      // Update local state
      setBookings((prevBookings) =>
        prevBookings.map((b) => (b.id === id ? { ...b, status } : b))
      );
    } else {
      alert("Failed to update booking status: " + result.error);
    }
  };

  const deleteBooking = async (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      const result = await deleteBookingFromDB(id);
      if (result.success) {
        // Remove from local state
        setBookings((prevBookings) => prevBookings.filter((b) => b.id !== id));
      } else {
        alert("Failed to delete booking: " + result.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {showAdminLogin && (
        <AdminLogin
          onLoginSuccess={handleLoginSuccess}
          onCancel={() => setShowAdminLogin(false)}
        />
      )}

      <Navigation
        activeSection={activeSection}
        scrollToSection={scrollToSection}
        isAdminMode={isAdminMode}
        onAdminClick={handleAdminClick}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
      />

      <HeroSection scrollToSection={scrollToSection} />
      <ServicesSection />
      <BookingSection onBookingSuccess={handleBookingSuccess} />
      <ReviewsSection />
      <ContactSection />

      {/* Booking Status - Uses Firebase */}
      <BookingStatus />

      {isAuthenticated && isAdminMode && (
        <div id="admin">
          <AdminPanel
            bookings={bookings}
            isLoading={isLoadingBookings}
            updateBookingStatus={updateBookingStatus}
            deleteBooking={deleteBooking}
            onRefresh={loadBookings}
          />
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;
