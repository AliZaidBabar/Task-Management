import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { RiErrorWarningLine } from 'react-icons/ri';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('role', response.data.role);
      localStorage.setItem('token', response.data.token); 
      localStorage.setItem('username', response.data.username);


      console.log("role of user is",response.data.role);
      console.log("token is",response.data.token);
      navigate('/');
    } catch (error) {
      if (error.response) {
        setError(error.response.data.error);
      } else if (error.request) {
        setError('Server is not responding. Please try again later.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-semibold text-center mb-4">Login</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline"><RiErrorWarningLine className="inline-block mr-2" />{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
