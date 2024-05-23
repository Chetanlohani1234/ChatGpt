import React, { useState, useEffect, useRef } from 'react';
//import { useRouter } from 'next/router';
//import AuthService from '@/services/AuthService'; // Make sure to create this service
import AuthService from '../Services/auth.service';
//import styles from '@/styles/Login.module.css';
import style from '../styles/Login.css'
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const form = useRef(null);
  const checkBtn = useRef(null);
  //const router = useRouter();

  useEffect(() => {
    const auth = AuthService.getCurrentUser();
    if (auth) {
      //router.push('/dashboard');
    }
  }, []);

  

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    // Assuming form.current.validateAll() and checkBtn.current.context._errors.length are handled inside the AuthService
    try {
      const loginUsername = username; // Adjust this if you need phone code logic
      await AuthService.login(loginUsername, password);
      onLogin();
      //router.push('/dashboard');
    } catch (error) {
      const resMessage = error.response?.data?.message || error.message || error.toString();
      setLoading(false);
      setMessage(resMessage);
    }
  };

  return (
    <div className="login">
      <h4>Login</h4>
      <form onSubmit={handleLogin} ref={form}>
        <div className="text_area">
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="text_input"
          />
        </div>
        <div className="text_area">
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="text_input"
          />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Loading...' : 'LOGIN'}
        </button>
        {message && <div className="message">{message}</div>}
      </form>
      <a className="link" href="/signup">Sign Up</a>
    </div>
  );
};

export default Login;
