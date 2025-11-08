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

  // Récupérer la redirection prévue
  const from = location.state?.from?.pathname || '/dashboard';

  useEffect(() => {
    // Afficher un message de succès si redirection depuis l'inscription
    if (location.state?.fromRegister) {
      setSuccessMessage('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
    }
  }, [location.state]);

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
      console.log('🔐 Tentative de connexion avec:', formData.email);
      await login(formData.email, formData.password);
      console.log('✅ Connexion réussie, redirection vers:', from);
      
      navigate(from, { replace: true });
    } catch (error) {
      console.error('❌ Erreur de connexion:', error);
      
      // Messages d'erreur plus spécifiques
      if (error.code === 'auth/invalid-email') {
        setError('Adresse email invalide');
      } else if (error.code === 'auth/user-not-found') {
        setError('Aucun compte trouvé avec cette adresse email');
      } else if (error.code === 'auth/wrong-password') {
        setError('Mot de passe incorrect');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Trop de tentatives échouées. Veuillez réessayer plus tard.');
      } else {
        setError('Erreur de connexion: ' + error.message);
      }
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
        }, 1000);
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
    <div className="min-h-screen bg-gradient-to-br from-green-500 to-yellow-500 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8 bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Connexion
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Accédez à votre compte C.A.S.T. Cantoria
          </p>
        </div>

        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-sm sm:text-base">
            {successMessage}
          </div>
        )}

        {/* BOUTON GOOGLE FONCTIONNEL */}
        <div>
          <button
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="w-full flex justify-center items-center px-4 py-2.5 sm:py-3 border border-gray-300 shadow-sm text-sm sm:text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            {isGoogleLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700 mr-2"></div>
                Connexion en cours...
              </>
            ) : (
              <>
                <img className="w-4 h-4 sm:w-5 sm:h-5 mr-2" src="/google-icon.svg" alt="Google" />
                Se connecter avec Google
              </>
            )}
          </button>
        </div>

        {/* Séparateur */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 text-xs sm:text-sm">Ou</span>
          </div>
        </div>

        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-sm sm:text-base">
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
              className="relative block w-full px-3 py-2.5 sm:py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 text-sm sm:text-base"
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
                className="relative block w-full px-3 py-2.5 sm:py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 text-sm sm:text-base"
                placeholder="Votre mot de passe"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-green-600"
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
                className="h-4 w-4 text-green-600 focus:ring-yellow-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="text-green-600 hover:text-yellow-600 transition-colors">
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2.5 sm:py-3 px-4 border border-transparent text-sm sm:text-base font-medium rounded-lg text-white bg-green-600 hover:bg-yellow-600 hover:text-gray-900 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </div>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              Pas encore de compte ?{' '}
              <Link 
                to="/register" 
                className="text-green-600 hover:text-yellow-600 transition-colors font-medium"
              >
                S'inscrire
              </Link>
            </span>
          </div>

          <div className="text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Compte de test: <strong>ad-castcantoria@outlook.fr</strong>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;