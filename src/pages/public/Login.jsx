import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const { login, signInWithGoogle, googleLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 DÉTECTER SI L'UTILISATEUR VIENT D'UNE DÉCONNEXION
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const fromLogout = searchParams.get('fromLogout');
    
    if (fromLogout) {
      setSuccessMessage('✅ Vous avez été déconnecté avec succès');
    }
  }, [location]);

  // Récupérer la redirection prévue ou utiliser '/dashboard' par défaut
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validation
    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        // Redirection vers la page d'origine ou le dashboard
        navigate(from, { replace: true });
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Une erreur est survenue lors de la connexion');
      console.error('Erreur connexion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      setSuccessMessage('');
      
      console.log('🎯 Début connexion Google...');
      
      const result = await signInWithGoogle();
      
      if (result.success) {
        console.log('✅ Connexion Google réussie, redirection vers:', from);
        // Petit délai pour laisser voir la notification
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1500);
      }
    } catch (error) {
      console.error('❌ Erreur connexion Google:', error);
      setError(error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isGoogleLoading = googleLoading || loading;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cast-green to-cast-gold flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-cast-green">
            Connexion
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Accédez à votre compte C.A.S.T. Cantoria
          </p>
        </div>

        {/* 🔥 MESSAGE DE SUCCÈS APRÈS DÉCONNEXION */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* Bouton Google */}
        <div>
          <button
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <img className="w-5 h-5 mr-2" src="/google-icon.svg" alt="Google" />
            {isGoogleLoading ? 'Connexion en cours...' : 'Se connecter avec Google'}
          </button>
        </div>

        {/* Séparateur */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Ou</span>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
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
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe *
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className="relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold focus:z-10"
                placeholder="Votre mot de passe"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-cast-green"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-cast-green focus:ring-cast-gold border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="text-cast-green hover:text-cast-gold transition-colors">
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-cast-green hover:bg-cast-gold hover:text-cast-green transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cast-gold disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link 
                to="/register" 
                className="text-cast-green hover:text-cast-gold transition-colors font-medium"
              >
                S'inscrire
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;