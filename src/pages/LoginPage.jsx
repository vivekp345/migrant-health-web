import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiShield, FiUser, FiLock } from 'react-icons/fi';
import { signInWithEmailAndPassword } from 'firebase/auth'; // <-- Import Firebase auth function
import { auth } from '../firebase'; // <-- Import your Firebase auth instance

const LoginPage = () => {
  const [email, setEmail] = useState(''); // Changed from username to email
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // --- REAL FIREBASE LOGIN LOGIC ---
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Sign-in successful.
        console.log('Login successful:', userCredential.user);
        navigate('/dashboard'); // Redirect to the dashboard
      })
      .catch((error) => {
        // Handle Errors here.
        setError('Invalid email or password. Please try again.');
        console.error('Firebase Login Error:', error.message);
      });
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-blue font-sans">
      <header className="px-8 py-4">
        <div className="flex items-center space-x-2 text-primary">
          <FiShield size={24} />
          <span className="font-semibold text-lg">Kerala Health</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-center text-primary">Official Login</h2>
          <p className="text-center text-gray-500 mt-2 mb-6">Kerala Health Department Access Only</p>
          <form onSubmit={handleLogin}>
            <div className="relative mb-4">
              <FiUser className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                type="email" // Changed to email type
                placeholder="Email" // Changed placeholder
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            <div className="relative mb-4">
              <FiLock className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}
            <div className="flex items-center justify-between mb-6 text-sm">
              <label className="flex items-center text-gray-600">
                <input type="checkbox" className="mr-2" /> Remember Me
              </label>
              <a href="#" className="text-primary hover:underline">Forgot Password?</a>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white font-bold py-2 rounded-lg hover:bg-blue-800 transition duration-300"
            >
              Login
            </button>
          </form>
        </div>
      </main>
      <footer className="text-center py-4 text-gray-500 text-sm">
        Unauthorized access is prohibited. Data monitored by Kerala Govt.
      </footer>
    </div>
  );
};

export default LoginPage;