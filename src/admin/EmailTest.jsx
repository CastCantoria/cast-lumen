// src/admin/EmailTest.jsx
import React, { useState } from 'react';
import { emailService } from '../services/emailService';

const EmailTest = () => {
  const [testEmail, setTestEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const sendTestEmail = async (type) => {
    if (!testEmail) {
      alert('Veuillez entrer une adresse email de test');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      let emailResult;

      switch (type) {
        case 'welcome':
          emailResult = await emailService.sendWelcomeEmail({
            email: testEmail,
            firstName: 'Test',
            role: 'member'
          });
          break;
        
        case 'password_reset':
          emailResult = await emailService.sendPasswordChangeEmail({
            email: testEmail,
            firstName: 'Test'
          }, 'reset');
          break;
        
        case 'booking':
          emailResult = await emailService.sendBookingConfirmationEmail(
            { id: 'TEST123', seats: 2 },
            { 
              title: 'Concert Test', 
              date: new Date(),
              location: 'Salle de Test',
              price: 20
            },
            { email: testEmail, firstName: 'Test' }
          );
          break;
        
        default:
          throw new Error('Type d\'email non supporté');
      }

      setResult({
        success: emailResult.success,
        message: emailResult.success ? 
          'Email envoyé avec succès !' : 
          `Erreur: ${emailResult.error}`
      });
    } catch (error) {
      setResult({
        success: false,
        message: `Erreur: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">🧪 Test des Emails</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email de test
        </label>
        <input
          type="email"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          placeholder="votre@email.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <button
          onClick={() => sendTestEmail('welcome')}
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          {loading ? 'Envoi...' : 'Email Bienvenue'}
        </button>
        
        <button
          onClick={() => sendTestEmail('password_reset')}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Envoi...' : 'Email Réinitialisation'}
        </button>
        
        <button
          onClick={() => sendTestEmail('booking')}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Envoi...' : 'Email Réservation'}
        </button>
      </div>

      {result && (
        <div className={`p-4 rounded-md ${
          result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {result.message}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Note :</strong> Ces emails seront envoyés à l'adresse spécifiée.</p>
        <p>Utilisez cette fonctionnalité pour tester l'apparence des emails.</p>
      </div>
    </div>
  );
};

export default EmailTest;