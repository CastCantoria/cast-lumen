// scripts/sendReminders.js (à déployer avec Cloud Functions ou cron job)
import { reminderService } from '../src/services/reminderService';

// Fonction appelée quotidiennement pour envoyer les rappels
export const scheduledReminder = async () => {
  console.log('🔔 Début de l\'envoi des rappels automatiques...');
  
  const result = await reminderService.checkAndSendEventReminders();
  
  if (result.success) {
    console.log(`✅ Rappels envoyés avec succès pour ${result.eventsProcessed} événements`);
  } else {
    console.error('❌ Erreur lors de l\'envoi des rappels:', result.error);
  }
  
  return result;
};