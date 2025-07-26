import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MyBookings({ userID, hotels, onBack }) {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (userID) {
      axios.get(`https://localhost:7117/api/Booking/user/${userID}`)
        .then(res => setBookings(res.data))
        .catch(() => setBookings([]));
    }
  }, [userID]);

  // Helper to get hotel title by packageID
  const getHotelTitle = (packageID) => {
    const hotel = hotels.find(h => h.packageID === packageID);
    return hotel ? hotel.title : packageID;
  };

  return (
    <div style={{padding: '2rem'}}>
      <h2>My Bookings</h2>
      <button className="button" onClick={onBack} style={{marginBottom: '1rem'}}>Back</button>
      <table style={{width: '100%', borderCollapse: 'collapse'}}>
        <thead>
          <tr>
            <th style={{border: '1px solid #ccc', padding: '8px'}}>Title</th>
            <th style={{border: '1px solid #ccc', padding: '8px'}}>Start Date</th>
            <th style={{border: '1px solid #ccc', padding: '8px'}}>End Date</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map(b => (
            <tr key={b.bookingID}>
              <td style={{border: '1px solid #ccc', padding: '8px'}}>{getHotelTitle(b.packageID)}</td>
              <td style={{border: '1px solid #ccc', padding: '8px'}}>{b.startDate.split('T')[0]}</td>
              <td style={{border: '1px solid #ccc', padding: '8px'}}>{b.endDate.split('T')[0]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MyBookings;