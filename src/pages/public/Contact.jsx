import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    contactType: 'general'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const contactTypes = [
    { value: 'general', label: 'Information Générale', icon: 'ℹ️' },
    { value: 'join', label: 'Rejoindre C.A.S.T.', icon: '👥' },
    { value: 'concert', label: 'Information Concerts', icon: '🎵' },
    { value: 'partnership', label: 'Partenariat', icon: '🤝' },
    { value: 'media', label: 'Presse & Médias', icon: '📰' },
    { value: 'other', label: 'Autre', icon: '💬' }
  ];

  const contactInfo = [
    {
      icon: '📧',
      title: 'Email',
      value: 'castcantoria@gmail.com',
      description: 'Nous répondons sous 24h'
    },
    {
      icon: '📞',
      title: 'Téléphone',
      value: '+261 34 11 361 57 ou +261 32 91 828 83',
      description: 'Lun-Ven 9h-17h'
    },
    {
      icon: '🏛️',
      title: 'Adresse',
      value: 'Paroisse Internationale Andohalo',
      description: 'Antananarivo 101, Madagascar'
    },
    {
      icon: '🕒',
      title: 'Répétitions',
      value: 'Mercredi 18h-20h & Samedi 14h-16h',
      description: 'Visiteurs bienvenus'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulation d'envoi
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        contactType: 'general'
      });
    }, 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Message Envoyé !</h2>
            <p className="text-gray-600 mb-6">
              Merci pour votre message. Nous vous répondrons dans les plus brefs délais.
            </p>
            <div className="space-y-3">
              <Link 
                to="/"
                className="block w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Retour à l'Accueil
              </Link>
              <button 
                onClick={() => setSuccess(false)}
                className="block w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:border-blue-600 hover:text-blue-600 transition font-semibold"
              >
                Nouveau Message
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-900 to-blue-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6 font-serif">Contactez-Nous</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-teal-100">
            Une question ? Un projet ? Nous serions ravis d'échanger avec vous
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/about" 
              className="bg-white text-teal-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Découvrir C.A.S.T.
            </Link>
            <Link 
              to="/join" 
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-teal-900 transition"
            >
              Nous Rejoindre
            </Link>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Informations de Contact */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-8 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Nos Coordonnées</h2>
              
              <div className="space-y-6 mb-8">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 text-xl">
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{info.title}</h3>
                      <p className="text-gray-700">{info.value}</p>
                      <p className="text-sm text-gray-500">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Suivez-Nous</h3>
                <div className="flex space-x-4">
                  <Link to="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition">
                    <span className="text-sm">f</span>
                  </Link>
                  <Link to="#" className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center text-white hover:bg-pink-700 transition">
                    <span className="text-sm">📷</span>
                  </Link>
                  <Link to="#" className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition">
                    <span className="text-sm">t</span>
                  </Link>
                  <Link to="#" className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition">
                    <span className="text-sm">▶</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Formulaire de Contact */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Envoyez-nous un message</h2>
              <p className="text-gray-600 mb-8">
                Remplissez le formulaire ci-dessous et nous vous recontacterons rapidement
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Type de contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Objet de votre message *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {contactTypes.map(type => (
                      <label
                        key={type.value}
                        className={`flex flex-col items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.contactType === type.value
                            ? 'border-teal-600 bg-teal-50 text-teal-700'
                            : 'border-gray-200 hover:border-teal-400'
                        }`}
                      >
                        <input
                          type="radio"
                          name="contactType"
                          value={type.value}
                          checked={formData.contactType === type.value}
                          onChange={handleChange}
                          className="hidden"
                        />
                        <span className="text-2xl mb-2">{type.icon}</span>
                        <span className="text-sm font-medium text-center">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Informations personnelles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                      Prénom *
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="+261 XX XX XXX XX"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Objet de votre message"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="6"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
                    placeholder="Décrivez-nous votre demande..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-teal-600 text-white py-4 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Envoi en cours...
                    </>
                  ) : (
                    'Envoyer le Message'
                  )}
                </button>
              </form>
            </div>

            {/* FAQ Rapide */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Questions Fréquentes</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900">Comment rejoindre C.A.S.T. ?</h4>
                  <p className="text-gray-600 text-sm">
                    Rendez-vous sur notre page <Link to="/join" className="text-teal-600 hover:text-teal-700">Nous Rejoindre</Link> 
                    pour postuler. Une audition est requise.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Quand ont lieu les répétitions ?</h4>
                  <p className="text-gray-600 text-sm">
                    Mercredi 18h-20h et Samedi 14h-16h à la Paroisse Internationale Andohalo.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Comment assister à un concert ?</h4>
                  <p className="text-gray-600 text-sm">
                    Consultez notre <Link to="/events" className="text-teal-600 hover:text-teal-700">calendrier des concerts</Link> 
                    pour les prochaines dates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Visitez-Nous</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Vous êtes les bienvenus à nos répétitions pour découvrir l'ambiance C.A.S.T.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/events"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Voir nos Horaires
            </Link>
            <Link 
              to="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
            >
              Obtenir l'Itinéraire
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;