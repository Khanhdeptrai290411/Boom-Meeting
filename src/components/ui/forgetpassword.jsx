import React, { useState } from 'react';

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${socketServerURL}/api/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send reset password email.');
      }

      setMessage('Reset password email sent! Please check your inbox.');
    } catch (error) {
      console.error('Error during forgot password:', error);
      setMessage('Failed to send reset password email. Please try again.');
    }
  };

  return (
    <div className="w-full p-6 space-y-6 bg-white dark:bg-gray-800 shadow-md rounded-lg" style={{ margin: 'auto', width: '400px' }}>
      <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white">Forgot Password</h2>
      {message && <p className="text-sm text-red-500">{message}</p>}
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
}

export default ForgotPasswordForm;