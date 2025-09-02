import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const navigate = useNavigate();

  const usernameValidation = (e) => {
    const value = e.target.value;
    setUsername(value);

    if (value.length < 6) {
      setIsUsernameValid(false);
      setUsernameError('Username must be at least 6 characters long');
    } else {
      setIsUsernameValid(true);
      setUsernameError('');
    }
  };

  const emailValidation = (e) => {
    const value = e.target.value;
    setEmail(value);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setIsEmailValid(false);
      setEmailError('Please enter a valid email address');
    } else {
      setIsEmailValid(true);
      setEmailError('');
    }
  };

  const passwordValidation = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (value.length < 8) {
      setIsPasswordValid(false);
      setPasswordError('Password must be at least 8 characters long');
    } else if (!/[A-Z]/.test(value)) {
      setIsPasswordValid(false);
      setPasswordError('Password must contain at least one uppercase letter');
    } else if (!/\d/.test(value)) {
      setIsPasswordValid(false);
      setPasswordError('Password must contain at least one number');
    } else {
      setIsPasswordValid(true);
      setPasswordError('');
    }
  };

  const confirmPasswordValidation = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (value !== password) {
      setIsConfirmPasswordValid(false);
      setConfirmPasswordError('Passwords do not match');
    } else {
      setIsConfirmPasswordValid(true);
      setConfirmPasswordError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate all fields before submission
    let hasErrors = false;

    if (username.length < 6) {
      setIsUsernameValid(false);
      setUsernameError('Username must be at least 6 characters long');
      hasErrors = true;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsEmailValid(false);
      setEmailError('Please enter a valid email address');
      hasErrors = true;
    }

    if (password.length < 8) {
      setIsPasswordValid(false);
      setPasswordError('Password must be at least 8 characters long');
      hasErrors = true;
    } else if (!/[A-Z]/.test(password)) {
      setIsPasswordValid(false);
      setPasswordError('Password must contain at least one uppercase letter');
      hasErrors = true;
    } else if (!/\d/.test(password)) {
      setIsPasswordValid(false);
      setPasswordError('Password must contain at least one number');
      hasErrors = true;
    }

    if (confirmPassword !== password) {
      setIsConfirmPasswordValid(false);
      setConfirmPasswordError('Passwords do not match');
      hasErrors = true;
    }

    if (hasErrors) return;

    // Check if username or email already exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = existingUsers.some(user => user.username === username || user.email === email);

    if (userExists) {
      if (existingUsers.some(user => user.username === username)) {
        setIsUsernameValid(false);
        setUsernameError('Username already exists');
      }
      if (existingUsers.some(user => user.email === email)) {
        setIsEmailValid(false);
        setEmailError('Email already exists');
      }
      return;
    }

    // Save user data
    const newUser = {
      username: username,
      email: email,
      password: password,
      profilePicture: '/src/assets/profile_icon.png', // default profile picture
      name: username
    };

    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    // Set current user
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    // Navigate to home and reload to update app state
    navigate('/');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-[#121212] p-8 rounded-lg w-full max-w-md">
        <h2 className="text-white text-2xl font-bold text-center mb-6">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Username
            </label>
            <input
              onChange={usernameValidation}
              type="text"
              value={username}
              placeholder="Enter your username"
              className={`w-full px-3 py-2 bg-[#2a2a2a] text-white rounded focus:outline-none focus:ring-2 ${
                isUsernameValid ? "focus:ring-blue-500" : "focus:ring-red-500 border border-red-500"
              }`}
            />
            {!isUsernameValid && (
              <span className="text-red-500 text-sm mb-2 block">
                {usernameError}
              </span>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Email
            </label>
            <input
              onChange={emailValidation}
              type="email"
              value={email}
              placeholder="Enter your email"
              className={`w-full px-3 py-2 bg-[#2a2a2a] text-white rounded focus:outline-none focus:ring-2 ${
                isEmailValid ? "focus:ring-blue-500" : "focus:ring-red-500 border border-red-500"
              }`}
            />
            {!isEmailValid && (
              <span className="text-red-500 text-sm mb-2 block">
                {emailError}
              </span>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Password
            </label>
            <input
              onChange={passwordValidation}
              type="password"
              value={password}
              placeholder="Enter your password"
              className={`w-full px-3 py-2 bg-[#2a2a2a] text-white rounded focus:outline-none focus:ring-2 ${
                isPasswordValid ? "focus:ring-blue-500" : "focus:ring-red-500 border border-red-500"
              }`}
            />
            {!isPasswordValid && (
              <span className="text-red-500 text-sm mb-2 block">
                {passwordError}
              </span>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-bold mb-2">
              Confirm Password
            </label>
            <input
              onChange={confirmPasswordValidation}
              type="password"
              value={confirmPassword}
              placeholder="Confirm your password"
              className={`w-full px-3 py-2 bg-[#2a2a2a] text-white rounded focus:outline-none focus:ring-2 ${
                isConfirmPasswordValid ? "focus:ring-blue-500" : "focus:ring-red-500 border border-red-500"
              }`}
            />
            {!isConfirmPasswordValid && (
              <span className="text-red-500 text-sm mb-2 block">
                {confirmPasswordError}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Register
          </button>
        </form>

        <p className="text-gray-400 text-center mt-4">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-400 hover:text-blue-300"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;
