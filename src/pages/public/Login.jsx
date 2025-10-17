import React from 'react';
import { Link } from 'react-router-dom';
import Login from '../../auth/Login';

// Simple wrapper qui redirige vers le composant existant
const LoginPage = () => {
  return <Login />;
};

export default LoginPage;