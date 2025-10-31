import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';

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
      // Enregistrement en base (joinRequests)
      const col = collection(db, 'joinRequests');
      await addDoc(col, {
        firstName: formData.firstName,
        lastName: formData.lastName || null,
        email: formData.email,
        phone: formData.phone || null,
        voice: formData.voice || null,
        experience: formData.experience || null,
        message: formData.message || null,
        role: formData.role,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      // Feedback UX riche du backup
      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        navigate('/join/success', { state: { firstName: formData.firstName, role: formData.role } });
      }, 1200);
    } catch (err) {
      console.error('Erreur enregistrement demande:', err);
      setError('Erreur lors de l\'envoi de la candidature. Réessayez plus tard.');
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

          {activeTab === 'info' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Informations sur les rôles */}
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <h2 className="text-2xl font-bold text-blue-600 mb-6">🎵 Choriste</h2>
                  <ul className="space-y-3 text-gray-600 mb-6">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Participez à nos répétitions hebdomadaires
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Chantez dans des concerts prestigieux
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Développez votre technique vocale
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Rejoignez une communauté passionnée
                    </li>
                  </ul>
                  <button 
                    onClick={() => startApplication('choriste')}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-semibold"
                  >
                    Postuler comme Choriste
                  </button>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <h2 className="text-2xl font-bold text-green-600 mb-6">🤝 Bénévole</h2>
                  <ul className="space-y-3 text-gray-600 mb-6">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Aidez à l'organisation des événements
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Participez à la vie associative
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Soutenez notre mission artistique
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">•</span>
                      Rencontrez des passionnés de musique
                    </li>
                  </ul>
                  <button 
                    onClick={() => startApplication('benevole')}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    Devenir Bénévole
                  </button>
                </div>
              </div>

              {/* Informations pratiques et avantages */}
              <div className="space-y-8">
                <div className="bg-white p-8 rounded-2xl shadow-lg">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">🏆 Pourquoi nous rejoindre ?</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl flex-shrink-0">
                        🎵
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Pratique musicale exigeante</h4>
                        <p className="text-gray-600 text-sm">Perfectionnez votre art vocal avec un répertoire sacré de qualité</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xl flex-shrink-0">
                        🙏
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Expérience spirituelle</h4>
                        <p className="text-gray-600 text-sm">Vivez votre foi à travers la musique sacrée</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl flex-shrink-0">
                        👥
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Communauté bienveillante</h4>
                        <p className="text-gray-600 text-sm">Rejoignez une famille musicale unie par la même passion</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-xl flex-shrink-0">
                        🎭
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">Prestations publiques</h4>
                        <p className="text-gray-600 text-sm">Participez à des concerts dans les plus beaux lieux sacrés</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Informations pratiques */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-yellow-800 mb-3">ℹ️ Informations pratiques</h3>
                  <ul className="space-y-2 text-yellow-700 text-sm">
                    <li>• Répétitions : Mercredi 18h-20h et Samedi 14h-16h</li>
                    <li>• Lieu : Espace Andakana ...</li>
                    <li>• Engagement : Participation régulière aux répétitions et concerts</li>
                    <li>• Audition : Rencontre préalable avec le chef de chœur</li>
                  </ul>
                  
                  <div className="mt-4 pt-4 border-t border-yellow-200">
                    <p className="text-yellow-700 text-sm mb-3">
                      {isAuthenticated 
                        ? "Vous êtes connecté, vous pouvez directement remplir le formulaire."
                        : "Pour rejoindre C.A.S.T., vous pouvez créer un compte ou vous connecter."
                      }
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {!isAuthenticated && (
                        <>
                          <Link 
                            to="/register" 
                            className="bg-yellow-600 text-white px-4 py-2 rounded text-sm hover:bg-yellow-700 transition"
                          >
                            Créer un compte
                          </Link>
                          <Link 
                            to="/login" 
                            className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition"
                          >
                            Se connecter
                          </Link>
                        </>
                      )}
                      <Link 
                        to="/contact" 
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 transition"
                      >
                        Nous contacter
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'form' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Formulaire de candidature
                  </h2>
                  <button
                    onClick={() => setActiveTab('info')}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    ← Retour aux informations
                  </button>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-800 text-sm">
                    <strong>Postulation en tant que :</strong> {formData.role === 'choriste' ? 'Choriste 🎵' : 'Bénévole 🤝'}
                  </p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Prénom *</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Votre prénom"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Nom *</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Votre nom"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="votre@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Téléphone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+261 XX XX XXX XX"
                    />
                  </div>

                  {formData.role === 'choriste' && (
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Voix *</label>
                      <select
                        name="voice"
                        required
                        value={formData.voice}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Sélectionnez votre voix</option>
                        <option value="soprano">Soprano</option>
                        <option value="alto">Alto</option>
                        <option value="ténor">Ténor</option>
                        <option value="basse">Basse</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      {formData.role === 'choriste' ? 'Expérience musicale' : 'Compétences et motivations'}
                    </label>
                    <textarea
                      name="experience"
                      rows="4"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder={
                        formData.role === 'choriste' 
                          ? "Parlez-nous de votre expérience musicale (chant, instrument, solfège...)" 
                          : "Décrivez vos compétences et pourquoi vous souhaitez nous rejoindre"
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Message supplémentaire</label>
                    <textarea
                      name="message"
                      rows="3"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tout autre information que vous souhaitez partager..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Envoi en cours...
                      </>
                    ) : (
                      `Envoyer ma candidature ${formData.role === 'choriste' ? 'de choriste' : 'de bénévole'}`
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Join;