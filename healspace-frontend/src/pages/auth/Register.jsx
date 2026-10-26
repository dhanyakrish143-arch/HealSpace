import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { AuthContext } from '../../context/AuthContext';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/auth/register', { name, email, password });
      login(res.data.therapist, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-slate-50 p-4'>
      <form onSubmit={handleSubmit} className='bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4'>
        <h2 className='text-2xl font-bold text-slate-800 text-center'>HealSpace Therapist Signup</h2>
        {error && <p className='text-red-500 text-sm'>{error}</p>}
        <input className='w-full border p-2 rounded' placeholder='Full Name' value={name} onChange={(e) => setName(e.target.value)} required />
        <input className='w-full border p-2 rounded' type='email' placeholder='Email Address' value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className='w-full border p-2 rounded' type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type='submit' className='w-full bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded font-medium'>Create Practice</button>
        <p className='text-sm text-center text-slate-500'>Already have an account? <Link to='/login' className='text-emerald-600 underline'>Log in</Link></p>
      </form>
    </div>
  );
}
