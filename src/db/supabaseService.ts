import { supabase } from '../lib/supabase';
import type { Customer, Reminder, Task, Activity, WorkflowStep, FilterOptions, Statistics } from '../types';

// Helper: Konvertiere Supabase-Daten zu App-Format
function convertFromDB(dbCustomer: any): Customer {
  return {
    id: dbCustomer.id,
    firma: dbCustomer.firma,
    vorname: dbCustomer.vorname,
    nachname: dbCustomer.nachname,
    email: dbCustomer.email,
    telefon: dbCustomer.telefon,
    adresse: dbCustomer.adresse,
    plz: dbCustomer.plz,
    ort: dbCustomer.ort,
    auftragstyp: dbCustomer.auftragstyp,
    prioritaet: dbCustomer.prioritaet,
    status: dbCustomer.status,
    beschreibung: dbCustomer.beschreibung,
    anforderungen: dbCustomer.anforderungen,
    notizen: dbCustomer.notizen,
    workflowSchritte: (dbCustomer.workflow_schritte || []).map((s: any) => ({
      ...s,
      erreichtAm: new Date(s.erreichtAm),
    })),
    termine: (dbCustomer.termine || []).map((t: any) => ({
      ...t,
      datum: new Date(t.datum),
    })),
    dokumente: dbCustomer.dokumente || [],
    aktivitaeten: (dbCustomer.aktivitaeten || []).map((a: any) => ({
      ...a,
      datum: new Date(a.datum),
    })),
    erinnerungen: (dbCustomer.erinnerungen || []).map((r: any) => ({
      ...r,
      faelligAm: new Date(r.faelligAm),
    })),
    aufgaben: (dbCustomer.aufgaben || []).map((t: any) => ({
      ...t,
      faelligAm: new Date(t.faelligAm),
      erstelltAm: new Date(t.erstelltAm),
    })),
    erstKontakt: new Date(dbCustomer.erst_kontakt),
    letztKontakt: dbCustomer.letzt_kontakt ? new Date(dbCustomer.letzt_kontakt) : undefined,
    kontaktiert: dbCustomer.kontaktiert,
    archiviert: dbCustomer.archiviert,
    archivierungsgrund: dbCustomer.archivierungsgrund,
    archiviertAm: dbCustomer.archiviert_am ? new Date(dbCustomer.archiviert_am) : undefined,
    erstelltAm: new Date(dbCustomer.erstellt_am),
    aktualisiertAm: new Date(dbCustomer.aktualisiert_am),
  };
}

// Helper: Konvertiere App-Daten zu DB-Format
function convertToDB(customer: Partial<Customer>): any {
  return {
    firma: customer.firma,
    vorname: customer.vorname,
    nachname: customer.nachname,
    email: customer.email,
    telefon: customer.telefon,
    adresse: customer.adresse,
    plz: customer.plz,
    ort: customer.ort,
    auftragstyp: customer.auftragstyp,
    prioritaet: customer.prioritaet,
    status: customer.status,
    beschreibung: customer.beschreibung,
    anforderungen: customer.anforderungen,
    notizen: customer.notizen,
    workflow_schritte: customer.workflowSchritte || [],
    termine: customer.termine || [],
    dokumente: customer.dokumente || [],
    aktivitaeten: customer.aktivitaeten || [],
    erinnerungen: customer.erinnerungen || [],
    aufgaben: customer.aufgaben || [],
    erst_kontakt: customer.erstKontakt,
    letzt_kontakt: customer.letztKontakt,
    kontaktiert: customer.kontaktiert,
    archiviert: customer.archiviert,
    archivierungsgrund: customer.archivierungsgrund,
    archiviert_am: customer.archiviertAm,
  };
}

// Customer Service
export const supabaseCustomerService = {
  // Alias für Kompatibilität mit Dashboard
  async getCustomers(filter?: FilterOptions): Promise<Customer[]> {
    return this.getAll(filter);
  },

  async getAll(filter?: FilterOptions): Promise<Customer[]> {
    let query = supabase.from('customers').select('*');

    // Archivierte Kunden nur anzeigen, wenn explizit gewünscht
    if (!filter?.zeigArchivierte) {
      query = query.eq('archiviert', false);
    }

    // Filter anwenden
    if (filter?.auftragstyp && filter.auftragstyp !== 'alle') {
      query = query.eq('auftragstyp', filter.auftragstyp);
    }

    if (filter?.prioritaet && filter.prioritaet !== 'alle') {
      query = query.eq('prioritaet', filter.prioritaet);
    }

    if (filter?.status && filter.status !== 'alle') {
      query = query.eq('status', filter.status);
    }

    if (filter?.nurOffene) {
      query = query.not('status', 'eq', 'abgeschlossen');
    }

    // Sortierung
    query = query.order('aktualisiert_am', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('Fehler beim Laden der Kunden:', error);
      throw error;
    }

    let customers = (data || []).map(convertFromDB);

    // Client-seitige Suche (da Supabase keine LIKE-Suche über mehrere Felder gleichzeitig unterstützt)
    if (filter?.suchbegriff) {
      const search = filter.suchbegriff.toLowerCase();
      customers = customers.filter(c =>
        c.vorname.toLowerCase().includes(search) ||
        c.nachname.toLowerCase().includes(search) ||
        c.firma?.toLowerCase().includes(search) ||
        c.email?.toLowerCase().includes(search) ||
        c.telefon.includes(search)
      );
    }

    return customers;
  },

  async getCustomer(id: string): Promise<Customer | null> {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Fehler beim Laden des Kunden:', error);
      return null;
    }

    return data ? convertFromDB(data) : null;
  },

  async createCustomer(customer: Omit<Customer, 'id' | 'erstelltAm' | 'aktualisiertAm'>): Promise<Customer> {
    const dbCustomer = convertToDB(customer);

    const { data, error } = await supabase
      .from('customers')
      .insert([dbCustomer])
      .select()
      .single();

    if (error) {
      console.error('Fehler beim Erstellen des Kunden:', error);
      throw error;
    }

    return convertFromDB(data);
  },

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<void> {
    const dbUpdates = convertToDB(updates);

    const { error } = await supabase
      .from('customers')
      .update(dbUpdates)
      .eq('id', id);

    if (error) {
      console.error('Fehler beim Aktualisieren des Kunden:', error);
      throw error;
    }
  },

  async deleteCustomer(id: string): Promise<void> {
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Fehler beim Löschen des Kunden:', error);
      throw error;
    }
  },

  async archiveCustomer(id: string, grund: string): Promise<void> {
    const { error } = await supabase
      .from('customers')
      .update({
        archiviert: true,
        archivierungsgrund: grund,
        archiviert_am: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      console.error('Fehler beim Archivieren des Kunden:', error);
      throw error;
    }
  },

  async unarchiveCustomer(id: string): Promise<void> {
    const { error } = await supabase
      .from('customers')
      .update({
        archiviert: false,
        archivierungsgrund: null,
        archiviert_am: null,
      })
      .eq('id', id);

    if (error) {
      console.error('Fehler beim Wiederherstellen des Kunden:', error);
      throw error;
    }
  },

  async updateStatus(id: string, newStatus: string): Promise<void> {
    const customer = await this.getCustomer(id);
    if (!customer) throw new Error('Kunde nicht gefunden');

    const workflowSchritte = customer.workflowSchritte || [];

    // Prüfen ob Status schon existiert
    const existingStep = workflowSchritte.find(s => s.status === newStatus);

    if (!existingStep) {
      // Neuen Schritt hinzufügen
      const newStep: WorkflowStep = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36),
        status: newStatus as any,
        erreichtAm: new Date(),
      };
      workflowSchritte.push(newStep);
    }

    await this.updateCustomer(id, {
      status: newStatus as any,
      workflowSchritte,
      letztKontakt: new Date(),
    });
  },

  async addActivity(id: string, activity: Omit<Activity, 'id' | 'datum'>): Promise<void> {
    const customer = await this.getCustomer(id);
    if (!customer) throw new Error('Kunde nicht gefunden');

    const newActivity: Activity = {
      ...activity,
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36),
      datum: new Date(),
    };

    const aktivitaeten = [...(customer.aktivitaeten || []), newActivity];

    await this.updateCustomer(id, {
      aktivitaeten,
      letztKontakt: new Date(),
    });
  },
};

// Reminder Service
export const supabaseReminderService = {
  async addReminder(customerId: string, reminder: Omit<Reminder, 'id' | 'kundenId'>): Promise<void> {
    const customer = await supabaseCustomerService.getCustomer(customerId);
    if (!customer) throw new Error('Kunde nicht gefunden');

    const newReminder: Reminder = {
      ...reminder,
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36),
      kundenId: customerId,
    };

    const erinnerungen = [...(customer.erinnerungen || []), newReminder];

    await supabaseCustomerService.updateCustomer(customerId, { erinnerungen });
  },

  async completeReminder(reminderId: string): Promise<void> {
    // Finde den Kunden mit dieser Erinnerung
    const { data: customers } = await supabase
      .from('customers')
      .select('*');

    if (!customers) return;

    for (const dbCustomer of customers) {
      const customer = convertFromDB(dbCustomer);
      const reminderIndex = customer.erinnerungen.findIndex(r => r.id === reminderId);

      if (reminderIndex !== -1) {
        customer.erinnerungen[reminderIndex].erledigt = true;
        await supabaseCustomerService.updateCustomer(customer.id, {
          erinnerungen: customer.erinnerungen,
        });
        break;
      }
    }
  },
};

// Task Service
export const supabaseTaskService = {
  async addTask(customerId: string, beschreibung: string, faelligAm: Date): Promise<void> {
    const customer = await supabaseCustomerService.getCustomer(customerId);
    if (!customer) throw new Error('Kunde nicht gefunden');

    const newTask: Task = {
      id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36),
      beschreibung,
      faelligAm,
      erledigt: false,
      erstelltAm: new Date(),
    };

    const aufgaben = [...(customer.aufgaben || []), newTask];

    await supabaseCustomerService.updateCustomer(customerId, { aufgaben });
  },

  async completeTask(customerId: string, taskId: string): Promise<void> {
    const customer = await supabaseCustomerService.getCustomer(customerId);
    if (!customer) throw new Error('Kunde nicht gefunden');

    const aufgaben = customer.aufgaben || [];
    const taskIndex = aufgaben.findIndex(t => t.id === taskId);

    if (taskIndex !== -1) {
      aufgaben[taskIndex].erledigt = true;
      await supabaseCustomerService.updateCustomer(customerId, { aufgaben });
    }
  },

  async deleteTask(customerId: string, taskId: string): Promise<void> {
    const customer = await supabaseCustomerService.getCustomer(customerId);
    if (!customer) throw new Error('Kunde nicht gefunden');

    const aufgaben = (customer.aufgaben || []).filter(t => t.id !== taskId);

    await supabaseCustomerService.updateCustomer(customerId, { aufgaben });
  },
};

// Statistics Service
export const supabaseStatisticsService = {
  async getStatistics(): Promise<Statistics> {
    const { data: customers } = await supabase
      .from('customers')
      .select('*');

    if (!customers) {
      return {
        gesamt: 0,
        offen: 0,
        hochPrioritaet: 0,
        faelligeErinnerungen: 0,
        nachzufassen: 0,
        archiviert: 0,
        offeneAufgaben: 0,
      };
    }

    const convertedCustomers = customers.map(convertFromDB);
    const activeCustomers = convertedCustomers.filter(c => !c.archiviert);
    const now = new Date();

    return {
      gesamt: activeCustomers.length,
      offen: activeCustomers.filter(c => !c.status.includes('abgeschlossen')).length,
      hochPrioritaet: activeCustomers.filter(c => c.prioritaet === 'hoch' && !c.status.includes('abgeschlossen')).length,
      faelligeErinnerungen: activeCustomers.reduce((count, c) => {
        return count + c.erinnerungen.filter(r => !r.erledigt && new Date(r.faelligAm) <= now).length;
      }, 0),
      nachzufassen: activeCustomers.filter(c =>
        c.status.includes('nachfassen') || c.status === 'angebot_erstellt'
      ).length,
      archiviert: convertedCustomers.filter(c => c.archiviert).length,
      offeneAufgaben: activeCustomers.reduce((count, c) => {
        return count + (c.aufgaben?.filter(t => !t.erledigt).length || 0);
      }, 0),
    };
  },
};
