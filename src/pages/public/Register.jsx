import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [inscriptionType, setInscriptionType] = useState('user'); // 'user' ou 'member'
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
    role: '', // Soprano, Alto, Tenor, Basse
    comment: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation de base
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (formData.email !== formData.confirmEmail) {
      setError('Les adresses email ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    // Validation spécifique pour les membres
    if (inscriptionType === 'member' && !formData.role) {
      setError('Veuillez sélectionner votre rôle vocal');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        userType: inscriptionType,
        ...(inscriptionType === 'member' && {
          role: formData.role,
          comment: formData.comment,
          status: 'pending' // En attente de validation
        })
      };

      const result = await register(formData.email, formData.password, userData);

      if (result.success) {
        // Redirection différente selon le type d'inscription
        if (inscriptionType === 'member') {
          navigate('/inscription-pending', { 
            state: { 
              message: 'Votre inscription en tant que membre choriste a été soumise. Elle sera validée par un administrateur.' 
            }
          });
        } else {
          navigate('/profile', {
            state: {
              message: 'Bienvenue ! Vous pouvez maintenant compléter votre profil.'
            }
          });
        }
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('Une erreur est survenue lors de l\'inscription');
      console.error('Erreur inscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    try {
      setLoading(true);
      const result = await signInWithGoogle();
      
      // Rediriger vers le profil pour compléter l'inscription
      navigate('/profile', {
        state: {
          message: 'Complétez votre inscription en tant que membre ou utilisateur',
          requiresProfileCompletion: true
        }
      });
    } catch (error) {
      console.error('Erreur inscription Google:', error);
      setError('Erreur lors de l\'inscription avec Google');
    } finally {
      setLoading(false);
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

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cast-green to-cast-gold flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-cast-green">
            Rejoindre C.A.S.T. Cantoria
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choisissez votre type d'inscription
          </p>
        </div>

        {/* Sélection du type d'inscription */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setInscriptionType('user')}
            className={`p-4 rounded-lg border-2 transition-all ${
              inscriptionType === 'user' 
                ? 'border-cast-green bg-green-50 text-cast-green' 
                : 'border-gray-300 bg-white text-gray-700 hover:border-cast-gold'
            }`}
          >
            <div className="text-lg font-semibold">👤 Utilisateur</div>
            <div className="text-sm mt-1">Commentaires & Blog</div>
          </button>
          
          <button
            type="button"
            onClick={() => setInscriptionType('member')}
            className={`p-4 rounded-lg border-2 transition-all ${
              inscriptionType === 'member' 
                ? 'border-cast-green bg-green-50 text-cast-green' 
                : 'border-gray-300 bg-white text-gray-700 hover:border-cast-gold'
            }`}
          >
            <div className="text-lg font-semibold">🎵 Membre Choriste</div>
            <div className="text-sm mt-1">Participer aux concerts</div>
          </button>
        </div>

        {/* Bouton Google */}
        <div>
          <button
            onClick={handleGoogleRegister}
            disabled={loading}
            className="w-full flex justify-center items-center px-4 py-3 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
          >
            <img className="w-5 h-5 mr-2" src="/google-icon.svg" alt="Google" />
            S'inscrire avec Google
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
          
          {/* Informations de base */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Prénom *
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold focus:z-10"
                placeholder="Votre prénom"
                value={formData.firstName}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Nom *
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold focus:z-10"
                placeholder="Votre nom"
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
          </div>

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
            <label htmlFor="confirmEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmation email *
            </label>
            <input
              id="confirmEmail"
              name="confirmEmail"
              type="email"
              autoComplete="email"
              required
              className="relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold focus:z-10"
              placeholder="Confirmez votre email"
              value={formData.confirmEmail}
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
                autoComplete="new-password"
                required
                className="relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold focus:z-10"
                placeholder="Minimum 6 caractères"
                value={formData.password}
                onChange={handleChange}
                minLength="6"
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirmer le mot de passe *
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                className="relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-cast-gold focus:border-cast-gold focus:z-10"
                placeholder="Retapez votre mot de passe"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-cast-green"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Champs spécifiques pour les membres */}
          {inscriptionType === 'member' && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800">Informations choriste</h3>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-blue-700 mb-1">
                  Rôle vocal *
                </label>
                <select
                  id="role"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-blue-300 bg-white text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sélectionnez votre voix</option>
                  <option value="Soprano">Soprano</option>
                  <option value="Alto">Alto</option>
                  <option value="Ténor">Ténor</option>
                  <option value="Basse">Basse</option>
                </select>
              </div>

              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-blue-700 mb-1">
                  Commentaire / Motivation
                </label>
                <textarea
                  id="comment"
                  name="comment"
                  rows={3}
                  value={formData.comment}
                  onChange={handleChange}
                  className="block w-full px-3 py-3 border border-blue-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Parlez-nous de votre expérience musicale, de votre motivation..."
                />
                <p className="text-xs text-blue-600 mt-1">
                  Cette information aide nos responsables à mieux vous connaître
                </p>
              </div>
            </div>
          )}

          {/* Informations sur les permissions */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Permissions selon le type de compte :</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {inscriptionType === 'user' ? (
                <>
                  <li>✅ Commenter les articles du blog</li>
                  <li>✅ Participer aux discussions</li>
                  <li>❌ Ne peut pas participer aux concerts</li>
                </>
              ) : (
                <>
                  <li>✅ Commenter les articles du blog</li>
                  <li>✅ Participer aux discussions</li>
                  <li>✅ Participer aux concerts (après validation)</li>
                  <li>✅ Accès au répertoire complet</li>
                </>
              )}
            </ul>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-cast-green hover:bg-cast-gold hover:text-cast-green transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cast-gold disabled:opacity-50"
            >
              {loading ? (
                <span>Inscription en cours...</span>
              ) : (
                <span>
                  {inscriptionType === 'member' ? 'S\'inscrire comme membre' : 'Créer mon compte'}
                </span>
              )}
            </button>
          </div>

          <div className="text-center">
            <Link 
              to="/login" 
              className="text-cast-green hover:text-cast-gold transition-colors font-medium"
            >
              Déjà un compte ? Se connecter
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;