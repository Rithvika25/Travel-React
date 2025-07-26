import React, { useState } from 'react';
import axios from 'axios';
import './LoginSignup.css';

function Signup({ onSignup, switchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!name || !email || !password || !contactNumber) {
      setError('All fields are required.');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format.');
    } else if (password.length < 6) {
      setError('Password must be at least 6 characters.');
    } else {
      setError('');
      try {
        const response = await axios.post('https://localhost:7117/api/Auth/register', {
          name,
          email,
          password,
          contactNumber
        });
        setShowSuccess(true); // Show popup on successful signup
      } catch (err) {
        setError('Signup failed. Please try again.');
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <input className="input-field" type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="input-field" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="input-field" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <input className="input-field" type="text" placeholder="Contact Number" value={contactNumber} onChange={e => setContactNumber(e.target.value)} />
        {error && <div className="error-message">{error}</div>}
        <button className="button" type="submit">Sign Up</button>
      </form>
      <p>
        Already have an account? <button className="button" style={{background: "#61dafb", color: "#222"}} onClick={switchToLogin}>Login</button>
      </p>
      {showSuccess && (
        <div className="popup-modal">
          <div className="popup-content">
            <h3>User registered successfully!</h3>
            <button className="button" onClick={switchToLogin}>Go to Login</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;