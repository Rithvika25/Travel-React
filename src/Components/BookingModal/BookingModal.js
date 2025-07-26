import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './BookingModal.css';

function BookingModal({ hotel, onClose, onSave, bookings, userID, onRedirectToHotels, onGoToMyBookings }) {
  const [startDate, setStartDate] = useState('');
  const [includeInsurance, setIncludeInsurance] = useState(false);
  const [error, setError] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [showMyBookingsBtn, setShowMyBookingsBtn] = useState(false);

  // Helper to calculate end date based on duration
  const getEndDate = (start, duration) => {
    if (!start || !duration) return '';
    const startDt = new Date(start);
    startDt.setDate(startDt.getDate() + Number(duration));
    return startDt.toISOString();
  };

  // Helper function to check date overlap
  const isOverlapping = (s1, e1, s2, e2) => {
    return (
      (new Date(s1) <= new Date(e2) && new Date(s1) >= new Date(s2)) ||
      (new Date(e1) <= new Date(e2) && new Date(e1) >= new Date(s2)) ||
      (new Date(s1) <= new Date(s2) && new Date(e1) >= new Date(e2))
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!startDate) {
      setError('Start date is required.');
      return;
    }

    const endDate = getEndDate(startDate, hotel.duration);

    // Payload matches backend DTO
    const payload = {
      BookingID: 0,
      UserID: 1,
      PackageID: Number(hotel.packageID),
      StartDate: new Date(startDate).toISOString(),
      EndDate: endDate,
      Status: "Confirmed",
      PaymentID: 0
    };

    // Check for overlapping bookings for this package
    const overlappingBooking = bookings.some(
      b =>
        b.packageID === hotel.packageID &&
        isOverlapping(startDate, endDate, b.startDate, b.endDate)
    );

    if (overlappingBooking) {
      setError("Oops! No more bookings available, Would you like to try for another date or hotel?");
      setShowOptions(true);
      return;
    }

    setError('');
    try {
      const bookingRes = await axios.post('https://localhost:7117/api/Booking', payload);
      if (includeInsurance) {
        await axios.post('https://localhost:7117/api/Insurance', {
          userID: payload.UserID,
          bookingID: bookingRes.data.bookingID
        });
        toast.success("Booking successful and insurance insured!");
      } else {
        toast.success("Booking successful!");
      }
      onSave({ packageID: hotel.packageID, userID, startDate, endDate });
      setShowMyBookingsBtn(true);
    } catch (err) {
      if (err.response?.data?.errors) {
        const errorMessages = Object.entries(err.response.data.errors)
          .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
          .join(' | ');
        toast.error(errorMessages);
      } else {
        const msg = err.response?.data?.title || err.response?.data?.message || err.response?.data || "Booking failed. Please try again.";
        toast.error(msg);
      }
      console.error('Booking error:', err.response?.data);
    }
  };

  return (
    <div className="modal">
      <ToastContainer />
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>Book at {hotel.title}</h2>
        <form onSubmit={handleSave}>
          <div>
            <label>Start Date:</label>
            <input
              className="input-field"
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label>End Date:</label>
            <input
              className="input-field"
              type="text"
              value={startDate && hotel.duration ? getEndDate(startDate, hotel.duration).split('T')[0] : ''}
              readOnly
            />
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={includeInsurance}
                onChange={e => setIncludeInsurance(e.target.checked)}
              />
              Include Insurance
            </label>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button className="button" type="submit">Book</button>
        </form>
        {showMyBookingsBtn && (
          <button className="button" onClick={onGoToMyBookings} style={{marginTop: '1rem'}}>
            Go to My Bookings
          </button>
        )}
      </div>
    </div>
  );
}

export default BookingModal;
/////////////////////////////////////////////////////
