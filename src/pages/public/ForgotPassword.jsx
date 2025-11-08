// src/pages/public/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../lib/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Veuillez entrer votre adresse email');
      return;
    }

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Un email de réinitialisation a été envoyé à votre adresse');
      setEmail('');
    } catch (error) {
      console.error('Erreur réinitialisation:', error);
      let errorMessage = 'Erreur lors de l\'envoi de l\'email';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'Aucun compte trouvé avec cette adresse email';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Adresse email invalide';
          break;
        default:
          errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cast-green to-cast-gold flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-cast-green">
            Mot de passe oublié
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Entrez votre email pour réinitialiser votre mot de passe
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {message && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              {message}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold focus:z-10"
              placeholder="adresse@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-cast-green hover:bg-cast-gold hover:text-cast-green transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cast-gold disabled:opacity-50"
            >
              {loading ? 'Envoi...' : 'Réinitialiser le mot de passe'}
            </button>
          </div>

          <div className="text-center">
            <Link 
              to="/login" 
              className="text-cast-green hover:text-cast-gold transition-colors font-medium"
            >
              ← Retour à la connexion
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;