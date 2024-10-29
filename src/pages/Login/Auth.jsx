import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function AuthPage({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true); // Quản lý trạng thái đăng nhập/đăng ký
  const toggleAuthMode = () => setIsLogin(!isLogin); // Chuyển đổi giữa đăng nhập và đăng ký

  return (
    <div className="w-full p-6 space-y-6 bg-white dark:bg-gray-800 shadow-md rounded-lg" style={{ margin: 'auto', width: '400px' }}>
      <h2 className="text-center text-2xl font-bold text-gray-800 dark:text-white">
        {isLogin ? 'Login' : 'Register'}
      </h2>

      {isLogin ? <LoginForm onLogin={onLogin} /> : <RegisterForm />}

      <p className="text-center text-sm text-gray-600 dark:text-gray-400">
        {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
        <button onClick={toggleAuthMode} className="font-medium text-blue-500 hover:underline">
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
}

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3009/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed!');
      }

      const data = await response.json();
      console.log('Login successful:', data);

      // Lưu token và thông tin người dùng vào local storage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user)); // Lưu thông tin người dùng

      // Gọi hàm onLogin để cập nhật trạng thái xác thực trong App
      onLogin(data.token);

      // Điều hướng đến main page sau khi đăng nhập
      navigate(`/chat?token=${data.token}`); // Thêm token vào URL
    } catch (error) {
      console.error('Error during login:', error);
      setMessage('Login failed. Please check your email and password.');
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {message && <p className="text-red-500 text-sm">{message}</p>}
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
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        Login
      </button>
    </form>
  );
}

function RegisterForm() {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Khởi tạo useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3009/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        throw new Error('Registration failed!');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      setMessage('Registration successful! Redirecting to login...');

      // Chuyển hướng đến trang đăng nhập sau khi đăng ký thành công
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error during registration:', error);
      setMessage('Registration failed. Please try again.');
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {message && <p className="text-red-500 text-sm">{message}</p>}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
        <input
          type="text"
          required
          value={username}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
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
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
      </div>
      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
      >
        Register
      </button>
    </form>
  );
}

export default AuthPage;
