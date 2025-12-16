import Dexie, { type Table } from 'dexie';
import type { Customer, Reminder } from '../types';

export class WoelflederDB extends Dexie {
  customers!: Table<Customer, string>;
  reminders!: Table<Reminder, string>;

  constructor() {
    super('WoelflederCRM');

    this.version(1).stores({
      customers: 'id, auftragstyp, prioritaet, status, nachname, firma, erstKontakt, kontaktiert',
      reminders: 'id, kundenId, faelligAm, erledigt, typ'
    });

    // Version 2: Archivierung hinzufügen
    this.version(2).stores({
      customers: 'id, auftragstyp, prioritaet, status, nachname, firma, erstKontakt, kontaktiert, archiviert',
      reminders: 'id, kundenId, faelligAm, erledigt, typ'
    }).upgrade(tx => {
      // Alle existierenden Kunden als nicht-archiviert markieren
      return tx.table('customers').toCollection().modify(customer => {
        customer.archiviert = false;
      });
    });
  }
}

export const db = new WoelflederDB();
