// src/pages/Login.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/NewAuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);

  const { signInWithGoogle, login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Erreur connexion:', error);
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Erreur connexion Google:', error);
      setError('Erreur de connexion avec Google');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulation d'envoi d'email de réinitialisation
    setTimeout(() => {
      setLoading(false);
      alert(`Un email de réinitialisation a été envoyé à ${email}`);
      setIsResetMode(false);
    }, 1500);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <img 
              src="/images/favicon-cantoria.png" 
              alt="C.A.S.T. Logo"
              className="h-12 w-12"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div className="h-12 w-12 flex items-center justify-center text-white font-bold text-lg">
              🎵
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 font-serif">
            {isResetMode ? 'Réinitialisation' : 'Connexion'}
          </h2>
          <p className="mt-2 text-sm text-gray-600 font-serif">
            {isResetMode 
              ? 'Entrez votre email pour réinitialiser votre mot de passe'
              : 'Accédez à votre espace C.A.S.T.'
            }
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg font-serif">
            {error}
          </div>
        )}

        {!isResetMode ? (
          <>
            {/* Formulaire de connexion standard */}
            <form className="mt-8 space-y-6" onSubmit={handleEmailLogin}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-serif">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 font-serif transition duration-200"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 font-serif">
                  Mot de passe
                </label>
                <div className="mt-1 relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 pr-10 font-serif transition duration-200"
                    placeholder="Votre mot de passe"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition duration-200"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 font-serif">
                    Se souvenir de moi
                  </label>
                </div>

                <button
                  type="button"
                  onClick={() => setIsResetMode(true)}
                  className="text-sm text-green-600 hover:text-green-500 font-serif transition duration-200"
                >
                  Mot de passe oublié ?
                </button>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition duration-200 shadow-lg font-serif"
                >
                  {loading ? 'Connexion...' : 'Se connecter'}
                </button>
              </div>
            </form>

            {/* Séparateur */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-transparent text-gray-500 font-serif">Ou continuer avec</span>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition duration-200 font-serif"
                >
                  <img className="w-5 h-5 mr-2" src="/google-icon.svg" alt="Google" />
                  Google
                </button>
              </div>
            </div>

            <div className="text-center mt-4">
              <span className="text-sm text-gray-600 font-serif">
                Pas encore de compte ?{' '}
                <Link to="/register" className="font-medium text-green-600 hover:text-green-500 transition duration-200 font-serif">
                  S'inscrire
                </Link>
              </span>
            </div>
          </>
        ) : (
          /* Mode réinitialisation de mot de passe */
          <form className="mt-8 space-y-6" onSubmit={handlePasswordReset}>
            <div>
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 font-serif">
                Email
              </label>
              <input
                id="reset-email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:z-10 font-serif transition duration-200"
                placeholder="votre@email.com"
              />
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition duration-200 shadow-lg font-serif"
              >
                {loading ? 'Envoi...' : 'Réinitialiser'}
              </button>
              <button
                type="button"
                onClick={() => setIsResetMode(false)}
                className="flex-1 py-3 px-4 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 font-serif"
              >
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;