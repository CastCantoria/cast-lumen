import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const Join = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    voice: '',
    experience: '',
    message: '',
    birthDate: '',
    address: '',
    city: '',
    occupation: '',
    emergencyContact: '',
    healthInfo: '',
    availability: [],
    skills: [],
    customRole: '',
    heardAbout: '',
    consentNewsletter: false,
    consentData: false
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('info');
  const [selectedRole, setSelectedRole] = useState('');
  const [step, setStep] = useState(1);
  const [applicationId, setApplicationId] = useState('');
  
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Rôles disponibles avec descriptions détaillées
  const roles = [
    {
      id: 'choriste',
      title: '🎵 Choriste',
      description: 'Rejoignez nos pupitres et participez aux concerts',
      color: 'blue',
      requirements: ['Audition vocale', 'Disponibilité répétitions', 'Engagement annuel'],
      icon: '🎵'
    },
    {
      id: 'benevole',
      title: '🤝 Bénévole',
      description: 'Soutenez nos activités et événements',
      color: 'green',
      requirements: ['Motivation', 'Polyvalence', 'Esprit d\'équipe'],
      icon: '🤝'
    },
    {
      id: 'musicien',
      title: '🎼 Musicien Instrumentiste',
      description: 'Accompagnez notre chorale avec votre instrument',
      color: 'purple',
      requirements: ['Maîtrise instrumentale', 'Partitions', 'Répétitions'],
      icon: '🎼'
    },
    {
      id: 'technique',
      title: '🎤 Technicien',
      description: 'Aide à la sonorisation et régie',
      color: 'orange',
      requirements: ['Connaissances techniques', 'Disponibilité événements'],
      icon: '🎤'
    },
    {
      id: 'communication',
      title: '📢 Communication',
      description: 'Aide à la promotion et réseaux sociaux',
      color: 'pink',
      requirements: ['Compétences rédactionnelles', 'Réseaux sociaux'],
      icon: '📢'
    },
    {
      id: 'autre',
      title: '💫 Autre Rôle',
      description: 'Proposez votre talent spécifique',
      color: 'gray',
      requirements: ['Description du rôle', 'Compétences'],
      icon: '💫'
    }
  ];

  // Types de voix pour les choristes
  const voiceTypes = [
    { id: 'soprano', name: 'Soprano', description: 'Voix aiguë féminine' },
    { id: 'mezzo', name: 'Mezzo-Soprano', description: 'Voix medium féminine' },
    { id: 'alto', name: 'Alto', description: 'Voix grave féminine' },
    { id: 'tenor', name: 'Ténor', description: 'Voix aiguë masculine' },
    { id: 'baritone', name: 'Baryton', description: 'Voix medium masculine' },
    { id: 'basse', name: 'Basse', description: 'Voix grave masculine' }
  ];

  // Disponibilités
  const availabilityOptions = [
    { id: 'mercredi_soir', label: 'Mercredi soir (18h-20h)' },
    { id: 'samedi_aprem', label: 'Samedi après-midi (14h-16h)' },
    { id: 'dimanche', label: 'Dimanche' },
    { id: 'soirees', label: 'Soirées de semaine' },
    { id: 'weekend', label: 'Week-ends complets' },
    { id: 'ponctuel', label: 'Ponctuellement selon planning' }
  ];

  // Compétences
  const skillOptions = [
    { id: 'chant', label: 'Chant' },
    { id: 'solfège', label: 'Solfège' },
    { id: 'instrument', label: 'Instrument' },
    { id: 'composition', label: 'Composition' },
    { id: 'direction', label: 'Direction' },
    { id: 'arrangement', label: 'Arrangement' },
    { id: 'technique', label: 'Technique son/lumière' },
    { id: 'graphisme', label: 'Graphisme' },
    { id: 'photo', label: 'Photographie' },
    { id: 'video', label: 'Vidéo' },
    { id: 'reseau', label: 'Réseaux sociaux' },
    { id: 'organisation', label: 'Organisation' }
  ];

  // Comment avez-vous connu C.A.S.T. ?
  const heardAboutOptions = [
    { id: 'reseau', label: 'Réseaux sociaux' },
    { id: 'ami', label: 'Par un ami/membre' },
    { id: 'concert', label: 'Lors d\'un concert' },
    { id: 'site', label: 'Site internet' },
    { id: 'presse', label: 'Presse/médias' },
    { id: 'affiche', label: 'Affiche/flyer' },
    { id: 'autre', label: 'Autre' }
  ];

  // Pré-remplir l'email si utilisateur connecté
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      setFormData(prev => ({ 
        ...prev, 
        email: currentUser.email,
        firstName: currentUser.displayName?.split(' ')[0] || '',
        lastName: currentUser.displayName?.split(' ').slice(1).join(' ') || ''
      }));
    } else if (location.state?.email) {
      setFormData(prev => ({ ...prev, email: location.state.email }));
    }
  }, [isAuthenticated, currentUser, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation étendue
    if (!formData.firstName || !formData.lastName || !formData.email || !selectedRole) {
      setError('Veuillez remplir tous les champs obligatoires (*)');
      setLoading(false);
      return;
    }

    if (selectedRole === 'choriste' && !formData.voice) {
      setError('Veuillez sélectionner votre voix pour postuler comme choriste');
      setLoading(false);
      return;
    }

    if (!formData.consentData) {
      setError('Veuillez accepter le traitement de vos données personnelles');
      setLoading(false);
      return;
    }

    try {
      // Générer un ID d'application unique
      const appId = `CAST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setApplicationId(appId);

      // Enregistrement en base (joinRequests)
      const col = collection(db, 'joinRequests');
      await addDoc(col, {
        applicationId: appId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        birthDate: formData.birthDate || null,
        address: formData.address || null,
        city: formData.city || null,
        occupation: formData.occupation || null,
        emergencyContact: formData.emergencyContact || null,
        healthInfo: formData.healthInfo || null,
        voice: formData.voice || null,
        experience: formData.experience || null,
        message: formData.message || null,
        role: selectedRole,
        customRole: formData.customRole || null,
        availability: formData.availability,
        skills: formData.skills,
        heardAbout: formData.heardAbout || null,
        consentNewsletter: formData.consentNewsletter,
        consentData: formData.consentData,
        status: 'pending',
        createdAt: serverTimestamp(),
        createdBy: currentUser?.uid || 'anonymous'
      });

      setSuccess(true);
      setLoading(false);

      setTimeout(() => {
        navigate('/join/success', { 
          state: { 
            firstName: formData.firstName, 
            role: selectedRole,
            applicationId: appId,
            email: formData.email
          } 
        });
      }, 2000);
    } catch (err) {
      console.error('Erreur enregistrement demande:', err);
      setError('Erreur lors de l\'envoi de la candidature. Réessayez plus tard.');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleArrayChange = (arrayName, value, checked) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: checked 
        ? [...prev[arrayName], value]
        : prev[arrayName].filter(item => item !== value)
    }));
  };

  const startApplication = (role) => {
    setSelectedRole(role);
    setActiveTab('form');
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const getStepProgress = () => {
    return (step / 4) * 100;
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="animate-bounce text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Candidature envoyée !
          </h2>
          <p className="text-gray-600 mb-6">
            Votre demande d'adhésion <strong>#{applicationId}</strong> a été reçue. 
            L'administration de C.A.S.T. Cantoria va examiner votre demande et vous 
            contactera rapidement à <strong>{formData.email}</strong>.
          </p>
          <div className="bg-white rounded-lg p-4 mb-6 border border-green-200">
            <p className="text-sm text-gray-600">
              ✅ Vous recevrez un email de confirmation avec les prochaines étapes.
            </p>
          </div>
          <div className="animate-pulse text-sm text-gray-500">
            Redirection vers la page de confirmation...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* En-tête */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-serif">
              Rejoindre C.A.S.T. Cantoria
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Devenez membre de notre chorale artistique et spirituelle. 
              Votre talent et votre passion trouveront ici leur place.
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
            <div className="bg-white rounded-lg shadow-sm p-1 border border-gray-200">
              <button
                onClick={() => setActiveTab('info')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'info' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                📋 Découvrir les Rôles
              </button>
              <button
                onClick={() => activeTab === 'form' ? null : setActiveTab('form')}
                disabled={!selectedRole && activeTab !== 'form'}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'form' 
                    ? 'bg-green-600 text-white shadow-md' 
                    : selectedRole 
                    ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
                    : 'text-gray-400 cursor-not-allowed'
                }`}
              >
                📝 Postuler {selectedRole && `(${roles.find(r => r.id === selectedRole)?.title})`}
              </button>
            </div>
          </div>

          {activeTab === 'info' && (
            <div className="space-y-12">
              {/* Présentation des rôles */}
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Choisissez Votre Rôle</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  C.A.S.T. Cantoria c'est bien plus qu'une chorale. C'est une famille artistique 
                  où chaque talent trouve sa place. Découvrez comment vous pouvez contribuer.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {roles.map((role) => (
                  <div 
                    key={role.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group cursor-pointer transform hover:-translate-y-1"
                    onClick={() => startApplication(role.id)}
                  >
                    <div className={`bg-gradient-to-r from-${role.color}-500 to-${role.color}-600 p-6 text-white`}>
                      <div className="text-4xl mb-3">{role.icon}</div>
                      <h3 className="text-xl font-bold mb-2">{role.title}</h3>
                      <p className="text-blue-100 text-sm">{role.description}</p>
                    </div>
                    
                    <div className="p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Ce rôle implique :</h4>
                      <ul className="space-y-2 mb-4">
                        {role.requirements.map((req, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-3"></span>
                            {req}
                          </li>
                        ))}
                      </ul>
                      
                      <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition font-semibold group-hover:bg-blue-50 group-hover:text-blue-600">
                        Postuler →
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Statistiques et avantages */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">🏆 Pourquoi Nous Rejoindre ?</h3>
                  
                  <div className="space-y-6">
                    {[
                      { icon: '🎵', title: 'Excellence Musicale', desc: 'Répertoire sacré exigeant et formations régulières' },
                      { icon: '🙏', title: 'Dimension Spirituelle', desc: 'Allier art vocal et élévation spirituelle' },
                      { icon: '👥', title: 'Communauté Bienveillante', desc: 'Une famille musicale soudée et accueillante' },
                      { icon: '🎭', title: 'Prestations Prestigieuses', desc: 'Concerts dans les plus beaux lieux sacrés' },
                      { icon: '🌟', title: 'Développement Personnel', desc: 'Progresser musicalement et humainement' },
                      { icon: '🌍', title: 'Impact Culturel', desc: 'Contribuer à la vie culturelle et spirituelle' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl flex-shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
                          <p className="text-gray-600 text-sm">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Informations pratiques */}
                <div className="space-y-6">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6">
                    <h3 className="text-xl font-bold text-yellow-800 mb-4">ℹ️ Informations Pratiques</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-yellow-700 mb-2">🕒 Horaires des Répétitions</h4>
                        <ul className="text-yellow-600 text-sm space-y-1">
                          <li>• Mercredi : 18h00 - 20h00 (chorale principale)</li>
                          <li>• Samedi : 14h00 - 16h00 (ateliers et sections)</li>
                          <li>• Dimanche : 09h00 - 10h30 (répétition avant messe)</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-yellow-700 mb-2">📍 Lieux</h4>
                        <ul className="text-yellow-600 text-sm space-y-1">
                          <li>• Espace Andakana (répétitions principales)</li>
                          <li>• Cathédrale d'Andohalo (concerts et célébrations)</li>
                          <li>• Salle polyvalente (ateliers et formations)</li>
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-yellow-700 mb-2">📋 Engagement</h4>
                        <ul className="text-yellow-600 text-sm space-y-1">
                          <li>• Participation régulière aux répétitions</li>
                          <li>• Disponibilité pour les concerts (6-8 par an)</li>
                          <li>• Cotisation annuelle symbolique</li>
                          <li>• Investissement dans la vie associative</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Appel à l'action */}
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white text-center">
                    <h3 className="text-xl font-bold mb-3">Prêt à Nous Rejoindre ?</h3>
                    <p className="mb-4 text-blue-100">
                      {isAuthenticated 
                        ? "Vous êtes connecté, vous pouvez directement remplir le formulaire de candidature."
                        : "Créez un compte ou connectez-vous pour postuler en quelques minutes."
                      }
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      {!isAuthenticated && (
                        <>
                          <Link 
                            to="/register" 
                            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition shadow-md"
                          >
                            Créer un Compte
                          </Link>
                          <Link 
                            to="/login" 
                            className="bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition border border-blue-400"
                          >
                            Se Connecter
                          </Link>
                        </>
                      )}
                      <Link 
                        to="/contact" 
                        className="bg-transparent border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
                      >
                        Nous Contacter
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'form' && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* En-tête du formulaire */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">Formulaire de Candidature</h2>
                      <p className="text-blue-100">
                        Postulation en tant que : <strong>{roles.find(r => r.id === selectedRole)?.title}</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('info')}
                      className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition text-sm font-medium"
                    >
                      ← Changer de rôle
                    </button>
                  </div>

                  {/* Barre de progression */}
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div 
                      className="bg-green-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${getStepProgress()}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-blue-100 mt-2">
                    <span>Informations Personnelles</span>
                    <span>Expérience & Motivation</span>
                    <span>Disponibilités</span>
                    <span>Validation</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-8">
                  {/* Étape 1: Informations personnelles */}
                  {step === 1 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">👤 Informations Personnelles</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">
                            Prénom <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Votre prénom"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">
                            Nom <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Votre nom"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="votre@email.com"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">
                            Téléphone
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="+261 XX XX XXX XX"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">
                            Date de Naissance
                          </label>
                          <input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">
                            Profession
                          </label>
                          <input
                            type="text"
                            name="occupation"
                            value={formData.occupation}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Votre profession"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Adresse
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                          placeholder="Votre adresse"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">
                            Ville
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Votre ville"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">
                            Contact d'Urgence
                          </label>
                          <input
                            type="text"
                            name="emergencyContact"
                            value={formData.emergencyContact}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            placeholder="Nom et téléphone"
                          />
                        </div>
                      </div>

                      {selectedRole === 'choriste' && (
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">
                            Type de Voix <span className="text-red-500">*</span>
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {voiceTypes.map(voice => (
                              <label key={voice.id} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                                <input
                                  type="radio"
                                  name="voice"
                                  value={voice.id}
                                  checked={formData.voice === voice.id}
                                  onChange={handleChange}
                                  className="mr-3"
                                  required
                                />
                                <div>
                                  <div className="font-medium text-gray-900">{voice.name}</div>
                                  <div className="text-xs text-gray-500">{voice.description}</div>
                                </div>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {selectedRole === 'autre' && (
                        <div>
                          <label className="block text-gray-700 font-semibold mb-2">
                            Décrivez votre rôle proposé <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="customRole"
                            required
                            value={formData.customRole}
                            onChange={handleChange}
                            rows="3"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                            placeholder="Décrivez le rôle que vous souhaitez proposer et comment vous pouvez contribuer..."
                          />
                        </div>
                      )}

                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={nextStep}
                          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
                        >
                          Suivant →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Étape 2: Expérience et motivation */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">🎯 Expérience & Motivation</h3>
                      
                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          {selectedRole === 'choriste' 
                            ? 'Expérience Musicale' 
                            : 'Compétences & Expérience'
                          }
                        </label>
                        <textarea
                          name="experience"
                          rows="6"
                          value={formData.experience}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                          placeholder={
                            selectedRole === 'choriste'
                              ? "Parlez-nous de votre expérience musicale (chant, instrument, solfège, formations...)"
                              : "Décrivez vos compétences, votre expérience et ce que vous pouvez apporter à C.A.S.T."
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Pourquoi souhaitez-vous rejoindre C.A.S.T. Cantoria ?
                        </label>
                        <textarea
                          name="message"
                          rows="4"
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                          placeholder="Partagez vos motivations, vos attentes et ce qui vous attire dans notre projet..."
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-3">
                          Compétences (sélectionnez les vôtres)
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {skillOptions.map(skill => (
                            <label key={skill.id} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                              <input
                                type="checkbox"
                                checked={formData.skills.includes(skill.id)}
                                onChange={(e) => handleArrayChange('skills', skill.id, e.target.checked)}
                                className="mr-3"
                              />
                              <span className="text-gray-700">{skill.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Comment avez-vous connu C.A.S.T. Cantoria ?
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {heardAboutOptions.map(option => (
                            <label key={option.id} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                              <input
                                type="radio"
                                name="heardAbout"
                                value={option.id}
                                checked={formData.heardAbout === option.id}
                                onChange={handleChange}
                                className="mr-3"
                              />
                              <span className="text-gray-700">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="bg-gray-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition"
                        >
                          ← Précédent
                        </button>
                        <button
                          type="button"
                          onClick={nextStep}
                          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
                        >
                          Suivant →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Étape 3: Disponibilités */}
                  {step === 3 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">📅 Disponibilités & Engagement</h3>
                      
                      <div>
                        <label className="block text-gray-700 font-semibold mb-3">
                          Vos disponibilités (sélectionnez tout ce qui convient)
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {availabilityOptions.map(availability => (
                            <label key={availability.id} className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                              <input
                                type="checkbox"
                                checked={formData.availability.includes(availability.id)}
                                onChange={(e) => handleArrayChange('availability', availability.id, e.target.checked)}
                                className="mr-3"
                              />
                              <span className="text-gray-700">{availability.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                          Informations de santé (optionnel)
                        </label>
                        <textarea
                          name="healthInfo"
                          rows="3"
                          value={formData.healthInfo}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                          placeholder="Informations médicales importantes que nous devrions connaître (allergies, conditions particulières...)"
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          Ces informations sont confidentielles et utilisées uniquement pour votre sécurité.
                        </p>
                      </div>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h4 className="font-semibold text-yellow-800 mb-2">📋 Engagement requis</h4>
                        <ul className="text-yellow-700 text-sm space-y-1">
                          <li>• Participation régulière aux répétitions (minimum 75%)</li>
                          <li>• Disponibilité pour les concerts et représentations</li>
                          <li>• Respect du règlement intérieur et de l'éthique de C.A.S.T.</li>
                          <li>• Cotisation annuelle de 20 000 Ar (choristes)</li>
                          <li>• Investissement dans la vie associative</li>
                        </ul>
                      </div>

                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="bg-gray-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition"
                        >
                          ← Précédent
                        </button>
                        <button
                          type="button"
                          onClick={nextStep}
                          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
                        >
                          Suivant →
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Étape 4: Validation et consentements */}
                  {step === 4 && (
                    <div className="space-y-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-6">✅ Validation Finale</h3>
                      
                      {/* Récapitulatif */}
                      <div className="bg-gray-50 rounded-lg p-6 mb-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Récapitulatif de votre candidature</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <strong>Nom :</strong> {formData.firstName} {formData.lastName}
                          </div>
                          <div>
                            <strong>Email :</strong> {formData.email}
                          </div>
                          <div>
                            <strong>Rôle :</strong> {roles.find(r => r.id === selectedRole)?.title}
                          </div>
                          {formData.voice && (
                            <div>
                              <strong>Voix :</strong> {voiceTypes.find(v => v.id === formData.voice)?.name}
                            </div>
                          )}
                          <div>
                            <strong>Disponibilités :</strong> {formData.availability.length} sélectionnée(s)
                          </div>
                          <div>
                            <strong>Compétences :</strong> {formData.skills.length} sélectionnée(s)
                          </div>
                        </div>
                      </div>

                      {/* Consentements */}
                      <div className="space-y-4">
                        <label className="flex items-start space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                          <input
                            type="checkbox"
                            name="consentData"
                            checked={formData.consentData}
                            onChange={handleChange}
                            required
                            className="mt-1"
                          />
                          <div>
                            <div className="font-semibold text-gray-900">
                              Consentement au traitement des données *
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              J'autorise C.A.S.T. Cantoria à traiter mes données personnelles 
                              dans le cadre de ma candidature et de mon éventuelle adhésion. 
                              Mes données seront utilisées conformément à notre politique de confidentialité.
                            </p>
                          </div>
                        </label>

                        <label className="flex items-start space-x-3 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition">
                          <input
                            type="checkbox"
                            name="consentNewsletter"
                            checked={formData.consentNewsletter}
                            onChange={handleChange}
                            className="mt-1"
                          />
                          <div>
                            <div className="font-semibold text-gray-900">
                              Newsletter et communications
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Je souhaite recevoir la newsletter de C.A.S.T. Cantoria avec 
                              les actualités, événements et informations de la chorale.
                            </p>
                          </div>
                        </label>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-2">Prochaines étapes</h4>
                        <ul className="text-blue-700 text-sm space-y-1">
                          <li>• Examen de votre dossier sous 7 jours ouvrables</li>
                          <li>• Contact pour un éventuel entretien ou audition</li>
                          <li>• Réponse définitive sous 15 jours</li>
                          <li>• Intégration lors de la prochaine répétition</li>
                        </ul>
                      </div>

                      <div className="flex justify-between">
                        <button
                          type="button"
                          onClick={prevStep}
                          className="bg-gray-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-600 transition"
                        >
                          ← Précédent
                        </button>
                        <button
                          type="submit"
                          disabled={loading}
                          className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
                            '🚀 Envoyer ma Candidature'
                          )}
                        </button>
                      </div>
                    </div>
                  )}
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