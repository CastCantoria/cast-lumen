import emailjs from '@emailjs/browser';

// Configuration EmailJS
const emailConfig = {
  SERVICE_ID: 'service_cast_lumen',
  TEMPLATE_ID: 'template_cast_lumen', 
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY_HERE',
};

// Templates EmailJS
const emailTemplates = {
  WELCOME: 'template_welcome_cast',
  PASSWORD_RESET: 'template_password_reset',
  ACCOUNT_ACCESS: 'template_account_access', 
  BOOKING_CONFIRMATION: 'template_booking_confirmation',
  EVENT_REMINDER: 'template_event_reminder'
};

// Service email principal
const emailService = {
  // Initialisation sécurisée
  init() {
    try {
      if (emailConfig.PUBLIC_KEY && emailConfig.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY_HERE') {
        emailjs.init(emailConfig.PUBLIC_KEY);
        console.log('✅ EmailJS initialisé');
      } else {
        console.warn('⚠️ EmailJS non configuré - mode simulation activé');
      }
    } catch (error) {
      console.warn('⚠️ EmailJS non configuré - mode simulation activé:', error.message);
    }
  },

  // Envoyer un email générique avec fallback
  async sendEmail(templateName, templateParams) {
    // Mode simulation en développement
    if (import.meta.env.DEV || emailConfig.PUBLIC_KEY === 'YOUR_PUBLIC_KEY_HERE') {
      console.log('📧 [DEV] Email simulé:', {
        template: templateName,
        to: templateParams.to_email,
        subject: templateParams.subject,
        params: templateParams
      });
      return { 
        success: true, 
        messageId: 'simulated-' + Date.now(),
        status: 200 
      };
    }

    // Envoi réel en production
    try {
      const result = await emailjs.send(
        emailConfig.SERVICE_ID,
        templateName,
        templateParams
      );
      
      console.log('✅ Email envoyé avec succès:', result);
      return { 
        success: true, 
        messageId: result.text,
        status: result.status 
      };
    } catch (error) {
      console.error('❌ Erreur envoi email:', error);
      return { 
        success: false, 
        error: error.text || error.message,
        status: error.status || 500
      };
    }
  },

  // Email de bienvenue pour nouvelle inscription
  async sendWelcomeEmail(userData) {
    const templateParams = {
      to_name: userData.displayName || userData.firstName || userData.email,
      to_email: userData.email,
      from_name: 'CAST LUMEN',
      from_email: 'castcantoria@outlook.fr',
      subject: 'Bienvenue dans la communauté CAST LUMEN !',
      message: `
        <h2>Bienvenue ${userData.displayName || userData.firstName || 'Cher Membre'} !</h2>
        <p>Votre inscription sur la plateforme CAST LUMEN a été confirmée avec succès.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3>📋 Vos informations de compte :</h3>
          <p><strong>Email :</strong> ${userData.email}</p>
          <p><strong>Rôle :</strong> ${userData.role || 'membre'}</p>
          <p><strong>Date d'inscription :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>

        <p>Vous pouvez maintenant :</p>
        <ul>
          <li>📖 Consulter notre répertoire musical</li>
          <li>🎫 Réserver vos places pour nos concerts</li>
          <li>📚 Accéder à nos ressources spirituelles</li>
          ${(userData.role && userData.role !== 'visitor') ? '<li>📁 Partager des médias avec la communauté</li>' : ''}
        </ul>

        <p><strong>Besoin d'aide ?</strong></p>
        <p>Contactez notre support : castcantoria@outlook.fr</p>

        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #2C5530; color: white; border-radius: 10px;">
          <h3>CAST LUMEN</h3>
          <p>Chœur Artistique Sacré & Tradition</p>
        </div>
      `,
      site_url: 'https://cast-lumen.vercel.app',
      support_email: 'castcantoria@outlook.fr'
    };

    return await this.sendEmail(emailTemplates.WELCOME, templateParams);
  },

  // Email de confirmation de changement de mot de passe
  async sendPasswordChangeEmail(userData, changeType = 'update') {
    const subject = changeType === 'reset' 
      ? 'Réinitialisation de votre mot de passe CAST LUMEN'
      : 'Confirmation de modification de mot de passe';

    const templateParams = {
      to_name: userData.displayName || userData.firstName || userData.email,
      to_email: userData.email,
      from_name: 'CAST LUMEN - Sécurité',
      from_email: 'castcantoria@outlook.fr',
      subject: subject,
      message: `
        <h2>${changeType === 'reset' ? 'Réinitialisation' : 'Modification'} du mot de passe</h2>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p><strong>🛡️ Action de sécurité détectée</strong></p>
          <p>Votre mot de passe a été ${changeType === 'reset' ? 'réinitialisé' : 'modifié'} avec succès.</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3>📋 Détails de l'opération :</h3>
          <p><strong>Compte :</strong> ${userData.email}</p>
          <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
          <p><strong>Type :</strong> ${changeType === 'reset' ? 'Réinitialisation' : 'Modification'}</p>
        </div>

        <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h4>🔒 Recommandations de sécurité :</h4>
          <ul>
            <li>Utilisez un mot de passe unique et fort</li>
            <li>Ne partagez jamais votre mot de passe</li>
            <li>Changez régulièrement votre mot de passe</li>
          </ul>
        </div>

        <p><strong>Vous n'êtes pas à l'origine de cette action ?</strong></p>
        <p>Contactez immédiatement notre support : castcantoria@outlook.fr</p>

        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #2C5530; color: white; border-radius: 10px;">
          <p>CAST LUMEN - Sécurité des comptes</p>
        </div>
      `,
      action_type: changeType,
      timestamp: new Date().toISOString()
    };

    return await this.sendEmail(
      changeType === 'reset' ? emailTemplates.PASSWORD_RESET : emailTemplates.ACCOUNT_ACCESS,
      templateParams
    );
  },

  // Email de notification d'accès
  async sendAccessNotificationEmail(userData, accessType, deviceInfo = {}) {
    const templateParams = {
      to_name: userData.displayName || userData.firstName || userData.email,
      to_email: userData.email,
      from_name: 'CAST LUMEN - Sécurité',
      from_email: 'castcantoria@outlook.fr',
      subject: `Nouvel accès détecté - ${accessType}`,
      message: `
        <h2>Nouvel accès à votre compte</h2>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p><strong>🔔 Notification de sécurité</strong></p>
          <p>Un nouvel accès à votre compte CAST LUMEN a été détecté.</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3>📋 Détails de l'accès :</h3>
          <p><strong>Type :</strong> ${accessType}</p>
          <p><strong>Compte :</strong> ${userData.email}</p>
          <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
          ${deviceInfo.browser ? `<p><strong>Navigateur :</strong> ${deviceInfo.browser}</p>` : ''}
          ${deviceInfo.os ? `<p><strong>Système :</strong> ${deviceInfo.os}</p>` : ''}
          ${deviceInfo.ip ? `<p><strong>Adresse IP :</strong> ${deviceInfo.ip}</p>` : ''}
        </div>

        <div style="background: #d4edda; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h4>✅ Cet accès vous semble légitime ?</h4>
          <p>Aucune action n'est requise. Cette notification vous informe simplement des activités sur votre compte.</p>
        </div>

        <div style="background: #f8d7da; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h4>🚨 Vous ne reconnaissez pas cet accès ?</h4>
          <p>Changez immédiatement votre mot de passe et contactez notre support.</p>
          <p><strong>Support :</strong> castcantoria@outlook.fr</p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #2C5530; color: white; border-radius: 10px;">
          <p>CAST LUMEN - Protection de votre compte</p>
        </div>
      `,
      access_type: accessType,
      device_info: JSON.stringify(deviceInfo)
    };

    return await this.sendEmail(emailTemplates.ACCOUNT_ACCESS, templateParams);
  },

  // Email de confirmation de réservation
  async sendBookingConfirmationEmail(bookingData, eventData, userData) {
    const templateParams = {
      to_name: userData.displayName || userData.firstName || userData.email,
      to_email: userData.email,
      from_name: 'CAST LUMEN - Réservations',
      from_email: 'castcantoria@outlook.fr',
      subject: `Confirmation de réservation - ${eventData.title}`,
      message: `
        <h2>🎉 Votre réservation est confirmée !</h2>
        
        <div style="background: #d4edda; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3>✅ Réservation confirmée</h3>
          <p>Votre place pour <strong>${eventData.title}</strong> a été réservée avec succès.</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3>📋 Détails de votre réservation :</h3>
          <p><strong>Référence :</strong> ${bookingData.id}</p>
          <p><strong>Événement :</strong> ${eventData.title}</p>
          <p><strong>Date :</strong> ${eventData.date?.toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          <p><strong>Lieu :</strong> ${eventData.location}</p>
          <p><strong>Nombre de places :</strong> ${bookingData.seats || 1}</p>
          ${eventData.price > 0 ? `<p><strong>Prix total :</strong> ${(eventData.price * (bookingData.seats || 1)).toFixed(2)}€</p>` : '<p><strong>Événement gratuit</strong></p>'}
        </div>

        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h4>📝 Informations importantes :</h4>
          <ul>
            <li>Présentez cette confirmation à l'entrée</li>
            <li>Arrivez 15 minutes avant le début</li>
            <li>Conservez cette confirmation</li>
          </ul>
        </div>

        <div style="background: #e2e3e5; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h4>📍 Adresse :</h4>
          <p>${eventData.location}</p>
          ${eventData.address ? `<p>${eventData.address}</p>` : ''}
        </div>

        <p><strong>Besoin d'annuler ou de modifier ?</strong></p>
        <p>Contactez-nous : castcantoria@outlook.fr</p>

        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #2C5530; color: white; border-radius: 10px;">
          <h3>CAST LUMEN</h3>
          <p>Nous avons hâte de vous accueillir !</p>
        </div>
      `,
      booking_reference: bookingData.id,
      event_title: eventData.title,
      event_date: eventData.date?.toISOString(),
      seats_count: bookingData.seats || 1,
      total_price: eventData.price * (bookingData.seats || 1)
    };

    return await this.sendEmail(emailTemplates.BOOKING_CONFIRMATION, templateParams);
  },

  // Email de rappel d'événement (24h avant)
  async sendEventReminderEmail(bookingData, eventData, userData) {
    const templateParams = {
      to_name: userData.displayName || userData.firstName || userData.email,
      to_email: userData.email,
      from_name: 'CAST LUMEN - Rappel',
      from_email: 'castcantoria@outlook.fr',
      subject: `📅 Rappel - ${eventData.title} demain !`,
      message: `
        <h2>📅 Rappel : ${eventData.title} a lieu demain !</h2>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3>⏰ Ne manquez pas l'événement</h3>
          <p>Nous vous rappelons votre réservation pour <strong>${eventData.title}</strong>.</p>
        </div>

        <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3>📋 Détails de l'événement :</h3>
          <p><strong>Date :</strong> ${eventData.date?.toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          <p><strong>Lieu :</strong> ${eventData.location}</p>
          <p><strong>Places réservées :</strong> ${bookingData.seats || 1}</p>
          <p><strong>Référence :</strong> ${bookingData.id}</p>
        </div>

        <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h4>💡 Conseils pratiques :</h4>
          <ul>
            <li>Arrivez 15 minutes avant le début</li>
            <li>Présentez votre confirmation à l'entrée</li>
            <li>Prévoyez du temps pour le stationnement</li>
          </ul>
        </div>

        <div style="background: #e2e3e5; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h4>📍 Adresse :</h4>
          <p>${eventData.location}</p>
          ${eventData.address ? `<p>${eventData.address}</p>` : ''}
        </div>

        <p><strong>Impossible de venir ?</strong></p>
        <p>Merci de nous prévenir : castcantoria@outlook.fr</p>

        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #2C5530; color: white; border-radius: 10px;">
          <h3>CAST LUMEN</h3>
          <p>Au plaisir de vous voir demain !</p>
        </div>
      `,
      event_title: eventData.title,
      event_date: eventData.date?.toISOString(),
      reminder_type: '24h_before'
    };

    return await this.sendEmail(emailTemplates.EVENT_REMINDER, templateParams);
  }
};

// Initialiser au chargement
emailService.init();

// Export par défaut pour la compatibilité
export default emailService;