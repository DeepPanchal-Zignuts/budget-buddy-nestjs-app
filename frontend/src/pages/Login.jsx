import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import loginImage from '../Images/LoginImage.png';

import { useAuth } from '../context/UserContext';

const Login = () => {
  // States
  const navigate = useNavigate();
  const location = useLocation();
  const [auth, setAuth] = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Form Submit Logic
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/login`,
        { email, password }
      );
      localStorage.setItem('auth', JSON.stringify(res.data));

      if (res.data.success) {
        toast.success(res.data && res.data.message);

        setAuth({
          ...auth,
          user: res.data.user,
          token: res.data.token,
        });

        navigate(location.state || '/dashboard/account-page');
      } else {
        toast.error(res.data && res.data.message);
      }
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 401) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Something went wrong!');
      }
    }
  };

  // Protecting Routes
  useEffect(() => {
    if (localStorage.getItem('auth')) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <Layout>
      <div className="min-h-screen flex justify-center items-center bg-slate-950 p-5">
        <div className="bg-slate-700 p-8 rounded-xl shadow-lg  sm:w-96 lg:w-3/5 lg:grid lg:grid-cols-2 lg:gap-10 lg:items-center">
          <div>
            <img
              src={loginImage}
              alt="loginImage"
              className="bg-slate-600 rounded-xl w-full"
            />
          </div>
          <div className="pt-5 lg:p-0">
            <h2 className="text-2xl font-bold mb-4 text-center text-white">
              Login
            </h2>
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <div>
                <label htmlFor="email" className="block text-white font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full bg-slate-500  border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-slate-800 text-white"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block font-medium text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full bg-slate-500 border-gray-300 rounded-md py-2 px-3 focus:outline focus:border-slate-800 text-white"
                  placeholder="******"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
                >
                  Login
                </button>
              </div>
            </form>
            <div className="mt-4 text-center text-gray-100">
              New user?
              <Link
                to="/register"
                className="text-blue-400 hover:underline pl-2"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
