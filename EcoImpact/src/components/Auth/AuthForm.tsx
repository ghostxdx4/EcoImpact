import React, { useState } from 'react';
import { Mail, Lock, User, Leaf } from 'lucide-react';
import { useStore } from '../../store/useStore';

interface AuthFormProps {
  onSuccess?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser, setAuthenticated, isDarkMode } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const payload = isLogin
      ? { email, password }
      : { email, username, password };

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Authentication failed");
      }

      // Save token in localStorage if returned
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setUser(data.user);
      setAuthenticated(true);
      onSuccess?.();
    } catch (error) {
      console.error("Authentication failed:", error);
      alert((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-green-50 to-blue-50'} py-12 px-4 sm:px-6 lg:px-8`}>
    <div className="max-w-md w-full space-y-8">
    <div className="text-center">
    <div className="flex justify-center">
    <Leaf className="h-12 w-12 text-green-600" />
    </div>
    <h2 className={`mt-4 text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
    {isLogin ? 'Welcome back to EcoImpact' : 'Join EcoImpact'}
    </h2>
    <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
    {isLogin ? 'Sign in to your account' : 'Create your eco-warrior account'}
    </p>
    </div>

    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
    <div className="space-y-4">
    {!isLogin && (
      <div>
      <label htmlFor="username" className="sr-only">Username</label>
      <div className="relative">
      <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
      <input
      id="username"
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
        isDarkMode
        ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
      }`}
      placeholder="Username"
      required
      />
      </div>
      </div>
    )}

    <div>
    <label htmlFor="email" className="sr-only">Email</label>
    <div className="relative">
    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
    <input
    id="email"
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
      isDarkMode
      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
    }`}
    placeholder="Email address"
    required
    />
    </div>
    </div>

    <div>
    <label htmlFor="password" className="sr-only">Password</label>
    <div className="relative">
    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
    <input
    id="password"
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
      isDarkMode
      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
    }`}
    placeholder="Password"
    required
    />
    </div>
    </div>
    </div>

    <button
    type="submit"
    disabled={loading}
    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
    {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
    </button>

    <div className="text-center">
    <button
    type="button"
    onClick={() => setIsLogin(!isLogin)}
    className={`text-sm ${isDarkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-500'}`}
    >
    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
    </button>
    </div>
    </form>
    </div>
    </div>
  );
};

export default AuthForm;
