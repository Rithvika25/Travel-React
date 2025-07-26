import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HotelList.css';

function HotelList({ onBook }) {
  const [packages, setPackages] = useState([]);
  const [filter, setFilter] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('https://localhost:7117/api/Package')
      .then(res => {
        setPackages(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Could not load packages.');
        setLoading(false);
      });
  }, []);

  const filteredPackages = packages.filter(pkg =>
    pkg.title.toLowerCase().includes(filter.toLowerCase()) &&
    (category === '' || pkg.category?.toLowerCase().includes(category.toLowerCase())) &&
    (price === '' || pkg.price === parseInt(price, 10)) &&
    (duration === '' || pkg.duration === parseInt(duration, 10))
  );

  return (
    <div>
      <div className="filter-bar">
        <input
          className="input-field"
          placeholder="Filter by package title"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Price"
          type="number"
          value={price}
          onChange={e => setPrice(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Duration (days)"
          type="number"
          value={duration}
          onChange={e => setDuration(e.target.value)}
        />
      </div>
      {loading && <p>Loading packages...</p>}
      {error && <div className="error-message">{error}</div>}
      <div className="hotel-list">
        {filteredPackages.map(pkg => (
          <div className="hotel-card" key={pkg.packageID}>
            <img src={pkg.image} alt={pkg.title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px' }} />
            <h3>{pkg.title}</h3>
            <p>Category: {pkg.category}</p>
            <p>Duration: {pkg.duration} days</p>
            <p>Price: ${pkg.price}</p>
            <button className="button" onClick={() => onBook(pkg)}>Book</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HotelList;