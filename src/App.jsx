import React, { useState, useEffect } from "react";
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
    // Clear expired session
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("loginTime");
    return false;
  }

  return true;
};

function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [bookings, setBookings] = useState(() => {
    try {
      const savedBookings = localStorage.getItem("salonBookings");
      return savedBookings ? JSON.parse(savedBookings) : [];
    } catch (error) {
      console.error("Error loading bookings:", error);
      return [];
    }
  });
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  // Initialize authentication state using the helper function
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    checkAdminSession()
  );

  const scrollToSection = (section) => {
    setActiveSection(section);
    setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleAdminClick = () => {
    if (isAuthenticated) {
      // Already logged in, toggle admin panel
      setIsAdminMode(!isAdminMode);
      if (!isAdminMode) {
        // Scroll to admin panel when opening
        setTimeout(() => {
          document
            .getElementById("admin")
            ?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      // Not logged in, show login modal
      setShowAdminLogin(true);
    }
  };

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("salonBookings", JSON.stringify(bookings));
      console.log("💾 Bookings saved to localStorage:", bookings.length);
    } catch (error) {
      console.error("Error saving bookings:", error);
    }
  }, [bookings]);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowAdminLogin(false);
    setIsAdminMode(true);
    // Scroll to admin panel
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

  const addBooking = (booking) => {
    const newBooking = {
      id: Date.now(),
      ...booking,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    setBookings((prevBookings) => [...prevBookings, newBooking]);
    console.log("✅ New booking added:", newBooking);

    setTimeout(() => {
      scrollToSection("status");
    }, 1000);
  };

  const updateBookingStatus = (id, status) => {
    setBookings((prevBookings) =>
      prevBookings.map((b) => (b.id === id ? { ...b, status } : b))
    );
    console.log(`✅ Booking ${id} status updated to: ${status}`);
  };

  const deleteBooking = (id) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      setBookings((prevBookings) => prevBookings.filter((b) => b.id !== id));
      console.log(`🗑️ Booking ${id} deleted`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* Admin Login Modal */}
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
      <BookingSection onBookingSubmit={addBooking} />
      <ReviewsSection />
      <ContactSection />

      {/* Booking Status - Available to ALL users */}
      <BookingStatus bookings={bookings} />

      {/* Admin Panel - Only visible when authenticated AND admin mode is active */}
      {isAuthenticated && isAdminMode && (
        <div id="admin">
          <AdminPanel
            bookings={bookings}
            updateBookingStatus={updateBookingStatus}
            deleteBooking={deleteBooking}
          />
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;
