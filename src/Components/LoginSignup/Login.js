// import React, { useState } from 'react';
// import './LoginSignup.css';

// function Login({ onLogin, switchToSignup }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = e => {
//     e.preventDefault();
//     if (!email || !password) {
//       setError('All fields are required.');
//     } else if (!/\S+@\S+\.\S+/.test(email)) {
//       setError('Invalid email format.');
//     } else {
//       setError('');
//       onLogin(email);
//     }
//   };

//   return (
//     <div className="form-container">
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
//         <input className="input-field" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
//         <input className="input-field" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
//         {error && <div className="error-message">{error}</div>}
//         <button className="button" type="submit">Login</button>
//       </form>
//       <p>
//         Don't have an account? <button className="button" style={{background: "#61dafb", color: "#222"}} onClick={switchToSignup}>Sign Up</button>
//       </p>
//     </div>
//   );
// }

// export default Login;
import React, { useState } from 'react';
import axios from 'axios';
import './LoginSignup.css';

function Login({ onLogin, switchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    if (!email || !password) {
      setError('All fields are required.');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Invalid email format.');
    } else {
      setError('');
      try {
        const response = await axios.post('https://localhost:7117/api/Auth/login', {
          email,
          password
        });
        // Save userId to localStorage if returned by backend
        if (response.data && response.data.userID) {
          localStorage.setItem('userId', response.data.userID);
        }
        // Handle successful login (e.g., save token, call onLogin)
        onLogin(email);
      } catch (err) {
        setError('Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="input-field"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="input-field"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <div className="error-message">{error}</div>}
        <button className="button" type="submit">Login</button>
      </form>
      <p>
        Don't have an account?{' '}
        <button
          className="button"
          style={{ background: "#61dafb", color: "#222" }}
          onClick={switchToSignup}
        >
          Sign Up
        </button>
      </p>
    </div>
  );
}

export default Login;