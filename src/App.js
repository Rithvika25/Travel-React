import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Components/LoginSignup/Login';
import Signup from './Components/LoginSignup/Signup';
import HotelList from './Components/HotelList/HotelList';
import BookingModal from './Components/BookingModal/BookingModal';
import MyBookings from './Components/MyBookings/MyBookings';
import Footer from './Components/Footer/Footer';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [showMyBookingsPage, setShowMyBookingsPage] = useState(false);

  // Fetch hotels and bookings from backend when user logs in
  useEffect(() => {
    if (user) {
      axios.get('https://localhost:7117/api/Package')
        .then(res => setHotels(res.data))
        .catch(() => setHotels([]));
      axios.get('https://localhost:7117/api/Booking')
        .then(res => setBookings(res.data))
        .catch(() => setBookings([]));
    }
  }, [user]);

  // Auth handlers
  // const handleLogin = (email) => {
  //   setUser({ email });
  // };
  const handleLogin = (userData) => {
  setUser({ userID: userData.userID, name: userData.name, email: userData.email });
};
  const handleSignup = ({ name, email }) => {
    setUser({ name, email });
  };

  // Booking handlers
  const handleBook = (hotel) => {
    setSelectedHotel(hotel);
    setShowBookingModal(true);
  };
  const handleSaveBooking = (booking) => {
    setBookings([...bookings, booking]);
    setShowBookingModal(false);
    setSelectedHotel(null);
  };

  // UI switching
  if (!user) {
    return showLogin ? (
      <Login onLogin={handleLogin} switchToSignup={() => setShowLogin(false)} />
    ) : (
      <Signup onSignup={handleSignup} switchToLogin={() => setShowLogin(true)} />
    );
  }

  if (showMyBookingsPage) {
    return (
      <MyBookings
        userID={user.userID}
        hotels={hotels}
        onBack={() => setShowMyBookingsPage(false)}
      />
    );
  }

  return (
    <div>
      <h1>Welcome {user.name || user.email}!</h1>
      <nav style={{padding: '16px', background: '#1976d2', color: '#fff', display: 'flex', justifyContent: 'space-between'}}>
        <span>Hotel Booking App</span>
        <button style={{background: '#fff', color: '#1976d2', border: 'none', borderRadius: '4px', padding: '6px 16px', cursor: 'pointer'}} onClick={() => setUser(null)}>
          Logout
        </button>
      </nav>
      <HotelList onBook={handleBook} />
      {showBookingModal && selectedHotel && (
        <BookingModal
          hotel={selectedHotel}
          onClose={() => setShowBookingModal(false)}
          onSave={handleSaveBooking}
          bookings={bookings}
          userID={user.userID}
          onRedirectToHotels={() => setShowBookingModal(false)}
          onGoToMyBookings={() => {
            setShowBookingModal(false);
            setShowMyBookingsPage(true);
          }}
        />
      )}
      <Footer />
    </div>
  );
}

export default App;
/////////////////////////////////////////////////////////////////
