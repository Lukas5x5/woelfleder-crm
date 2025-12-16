// Verwende Supabase statt lokaler IndexedDB
import {
  supabaseCustomerService,
  supabaseReminderService,
  supabaseTaskService,
  supabaseStatisticsService,
} from './supabaseService';

// Re-exportiere die Services für Kompatibilität mit bestehenden Komponenten
export const customerService = supabaseCustomerService;
export const reminderService = supabaseReminderService;
export const taskService = supabaseTaskService;
export const statisticsService = supabaseStatisticsService;
