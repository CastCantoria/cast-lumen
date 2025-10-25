import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const Join = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    voice: '',
    experience: '',
    message: '',
    password: '',
    confirmPassword: '',
    role: 'choriste' // Nouveau champ pour le type de participation
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('info'); // 'info' ou 'form'
  
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Pré-remplir l'email si utilisateur connecté
  useEffect(() => {
    if (isAuthenticated && currentUser?.email) {
      setFormData(prev => ({ ...prev, email: currentUser.email }));
    } else if (location.state?.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }));
    }
  }, [isAuthenticated, currentUser, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.role) {
      setError('Veuillez remplir tous les champs obligatoires (*)');
      setLoading(false);
      return;
    }

    // Si choriste, la voix est obligatoire
    if (formData.role === 'choriste' && !formData.voice) {
      setError('Veuillez sélectionner votre voix pour postuler comme choriste');
      setLoading(false);
      return;
    }

    try {
      // Simulation d'envoi réussi
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
        
        // Redirection après succès
        setTimeout(() => {
          navigate('/join/success', { 
            state: { 
              firstName: formData.firstName,
              role: formData.role
            } 
          });
        }, 2000);
      }, 1500);

    } catch (error) {
      console.error('Erreur Join:', error);
      setError('Erreur lors de la demande d\'adhésion. Veuillez réessayer.');
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

  const startApplication = (role) => {
    setFormData(prev => ({ ...prev, role }));
    setActiveTab('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Demande envoyée !
          </h2>
          <p className="text-gray-600 mb-6">
            Votre demande d'adhésion a été reçue. L'administration de C.A.S.T. Cantoria 
            va examiner votre demande et vous contactera rapidement.
          </p>
          <div className="animate-pulse text-sm text-gray-500">
            Redirection en cours...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* En-tête */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Rejoindre C.A.S.T. Cantoria
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Devenez membre de notre chorale artistique et spirituelle
            </p>
          </div>

          {location.state?.message && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6 max-w-2xl mx-auto">
              {location.state.message}
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 max-w-2xl mx-auto">
              {error}
            </div>
          )}

          {/* Navigation par onglets */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg shadow-sm p-1">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === 'info' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📋 Informations
              </button>
              <button
                onClick={() => setActiveTab('form')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  activeTab === 'form' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📝 Formulaire
              </button>
            </div>
          </div>

          {/* ... contenu abrégé pour archive (voir original si besoin) ... */}
        </div>
      </div>
    </div>
  );
};

export default Join;
