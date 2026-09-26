import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.post('http://localhost:4000/api/auth/forgot-password', { email });
      setMessage(response.data.message || 'Reset link sent! Check your email inbox.');
      setEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9f8] flex items-center justify-center p-6 font-sans">
      <div className="bg-white rounded-2xl p-10 w-full max-w-[440px] shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
        
        <div className="w-12 h-12 bg-[#e8f5e9] text-[#2d6a4f] rounded-xl flex items-center justify-center text-xl mb-6">
          🔑
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter the email address associated with your account, and we’ll send you a password reset link.
        </p>

        {message && (
          <div className="bg-emerald-50 border border-emerald-200 text-[#2d6a4f] rounded-lg p-4 text-sm mb-5">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-sm mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@unikarachi.edu.pk"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm bg-[#f0faf4] text-gray-900 outline-none focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f] transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#2d6a4f] hover:bg-[#245a41] text-white font-semibold py-3.5 rounded-lg text-sm transition-colors ${
              loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
            }`}
          >
            {loading ? 'Sending Request...' : 'Send Reset Link →'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-gray-500 hover:text-[#2d6a4f] transition-colors font-medium">
            ← Back to Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPasswordPage;