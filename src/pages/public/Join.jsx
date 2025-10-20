import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

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
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Pré-remplir l'email si fourni dans la navigation ou si utilisateur connecté
  useEffect(() => {
    if (location.state?.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }));
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.voice || !formData.password) {
      setError('Veuillez remplir tous les champs obligatoires (*)');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      const result = await register(formData.email, formData.password, formData);

      if (result.success) {
        setSuccess(true);
        // Rediriger après succès
        setTimeout(() => {
          navigate(result.redirectTo || '/join/pending', { replace: true });
        }, 3000);
      } else {
        setError(result.error || 'Erreur lors de la demande d\'adhésion');
      }
    } catch (error) {
      console.error('Erreur Join:', error);
      setError('Erreur lors de la demande d\'adhésion. Veuillez réessayer.');
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-primary mb-4">
            Demande envoyée !
          </h2>
          <p className="text-dark/70 mb-6">
            Votre demande d'adhésion a été reçue. L'administration de Cast Cantoria 
            va examiner votre demande et vous contactera rapidement.
          </p>
          <p className="text-sm text-dark/50">
            Redirection en cours...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* En-tête */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-5xl font-bold text-primary mb-4">Rejoindre le Chœur</h1>
            <p className="text-xl text-dark/70">
              Devenez membre du C.A.S.T. et participez à notre mission artistique et spirituelle
            </p>
          </div>

          {location.state?.message && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
              {location.state.message}
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Informations */}
            <div>
              <h2 className="font-serif text-3xl font-bold text-primary mb-6">Pourquoi nous rejoindre ?</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl">
                    🎵
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark mb-2">Pratique musicale exigeante</h3>
                    <p className="text-dark/70">Perfectionnez votre art vocal avec un répertoire sacré de qualité</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl">
                    🙏
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark mb-2">Expérience spirituelle</h3>
                    <p className="text-dark/70">Vivez votre foi à travers la musique sacrée</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl">
                    👥
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark mb-2">Communauté bienveillante</h3>
                    <p className="text-dark/70">Rejoignez une famille musicale unie par la même passion</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xl">
                    🎭
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark mb-2">Prestations publiques</h3>
                    <p className="text-dark/70">Participez à des concerts dans les plus beaux lieux sacrés</p>
                  </div>
                </div>
              </div>

              {/* Informations pratiques */}
              <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg">
                <h3 className="font-serif text-xl font-bold text-primary mb-4">Informations pratiques</h3>
                <ul className="space-y-2 text-dark/70">
                  <li>• Répétitions : Mercredi 18h-20h et Samedi 14h-16h</li>
                  <li>• Lieu : Paroisse Internationale Andohalo</li>
                  <li>• Engagement : Participation régulière aux répétitions et concerts</li>
                  <li>• Audition : Rencontre préalable avec le chef de chœur</li>
                </ul>
              </div>
            </div>

            {/* Formulaire */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="font-serif text-2xl font-bold text-primary mb-6">Formulaire de candidature</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-dark font-medium mb-2">Prénom *</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label className="block text-dark font-medium mb-2">Nom *</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-dark font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="votre@email.com"
                  />
                </div>

                <div>
                  <label className="block text-dark font-medium mb-2">Téléphone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    placeholder="+261 XX XX XXX XX"
                  />
                </div>

                <div>
                  <label className="block text-dark font-medium mb-2">Voix *</label>
                  <select
                    name="voice"
                    required
                    value={formData.voice}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="">Sélectionnez votre voix</option>
                    <option value="soprano">Soprano</option>
                    <option value="alto">Alto</option>
                    <option value="ténor">Ténor</option>
                    <option value="basse">Basse</option>
                  </select>
                </div>

                {/* Champs mot de passe */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-dark font-medium mb-2">Mot de passe *</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary pr-10"
                        placeholder="Minimum 6 caractères"
                        minLength="6"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
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

                  <div>
                    <label className="block text-dark font-medium mb-2">Confirmer le mot de passe *</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary pr-10"
                        placeholder="Retapez votre mot de passe"
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
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
                </div>

                <div>
                  <label className="block text-dark font-medium mb-2">Expérience musicale</label>
                  <textarea
                    name="experience"
                    rows="3"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Parlez-nous de votre expérience musicale (chant, instrument, solfège...)"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <div>
                  <label className="block text-dark font-medium mb-2">Message</label>
                  <textarea
                    name="message"
                    rows="3"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Pourquoi souhaitez-vous rejoindre le C.A.S.T. ?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent text-primary py-4 rounded-lg font-semibold hover:bg-accent/90 transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer ma candidature'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Join;