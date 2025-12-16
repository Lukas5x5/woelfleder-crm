// Auftragstypen
export type OrderType = 'tor' | 'stallbau' | 'produkte';

// Prioritätsstufen
export type Priority = 'hoch' | 'mittel' | 'niedrig';

// Status für Tor-Aufträge
export type TorStatus =
  | 'anfrage_erfasst'
  | 'ausmessen_geplant'
  | 'angebot_erstellt'
  | 'nachfassen'
  | 'angebot_unterschrieben'
  | 'an_firma_gesendet'
  | 'auftragsbestaetigung'
  | 'in_produktion'
  | 'liefertermin'
  | 'montagetermin'
  | 'abgeschlossen';

// Status für Stallbau
export type StallbauStatus =
  | 'erstgespraech'
  | 'zeichnung_erstellt'
  | 'angebot_erstellt'
  | 'nachfassen'
  | 'angebot_angenommen'
  | 'profi_plan_angefordert'
  | 'plan_unterschrieben'
  | 'bau_begonnen'
  | 'baubegleitung'
  | 'fertigstellung'
  | 'abgeschlossen';

// Status für Produkte (gleich wie Tor)
export type ProdukteStatus = TorStatus;

// Workflow-Schritt
export interface WorkflowStep {
  id: string;
  status: TorStatus | StallbauStatus | ProdukteStatus;
  erreichtAm?: Date;
  notizen?: string;
}

// Termin
export interface Appointment {
  id: string;
  typ: 'ausmessen' | 'lieferung' | 'montage' | 'besichtigung' | 'baubegleitung' | 'sonstiges';
  datum: Date;
  uhrzeit?: string;
  beschreibung?: string;
  erledigt: boolean;
}

// Dokument
export interface Document {
  id: string;
  name: string;
  typ: 'angebot' | 'vertrag' | 'zeichnung' | 'plan' | 'auftragsbestaetigung' | 'sonstiges';
  datei?: File | string; // File für Upload, string für gespeicherte Dateipfade
  erstelltAm: Date;
  notizen?: string;
}

// Kommunikation / Aktivität
export interface Activity {
  id: string;
  typ: 'anruf' | 'email' | 'besuch' | 'notiz' | 'statusaenderung';
  beschreibung: string;
  datum: Date;
  ersteller?: string; // Für Multi-User später
}

// Erinnerung
export interface Reminder {
  id: string;
  typ: 'nachfassen' | 'termin' | 'allgemein';
  beschreibung: string;
  faelligAm: Date;
  erledigt: boolean;
  kundenId: string;
}

// Aufgabe / Task
export interface Task {
  id: string;
  beschreibung: string;
  faelligAm: Date;
  erledigt: boolean;
  erstelltAm: Date;
}

// Haupt-Kundenobjekt
export interface Customer {
  id: string;

  // Basisdaten
  firma?: string;
  vorname: string;
  nachname: string;
  email?: string;
  telefon: string;
  adresse?: string;
  plz?: string;
  ort?: string;

  // Auftragsinformationen
  auftragstyp: OrderType;
  prioritaet: Priority;
  status: TorStatus | StallbauStatus | ProdukteStatus;

  // Was braucht der Kunde
  beschreibung: string;
  anforderungen?: string;

  // Workflow
  workflowSchritte: WorkflowStep[];

  // Termine
  termine: Appointment[];

  // Dokumente
  dokumente: Document[];

  // Kommunikation
  aktivitaeten: Activity[];

  // Erinnerungen
  erinnerungen: Reminder[];

  // Aufgaben
  aufgaben: Task[];

  // Kontakt
  erstKontakt: Date;
  letztKontakt?: Date;
  kontaktiert: boolean;

  // Timestamps
  erstelltAm: Date;
  aktualisiertAm: Date;

  // Notizen
  notizen?: string;

  // Archivierung
  archiviert: boolean;
  archivierungsgrund?: string;
  archiviertAm?: Date;
}

// Filter-Optionen für Dashboard
export interface FilterOptions {
  suchbegriff?: string;
  auftragstyp?: OrderType | 'alle';
  prioritaet?: Priority | 'alle';
  status?: string | 'alle';
  nurOffene?: boolean;
  zeigArchivierte?: boolean;
}

// Statistiken für Dashboard
export interface Statistics {
  gesamt: number;
  offen: number;
  hochPrioritaet: number;
  faelligeErinnerungen: number;
  nachzufassen: number;
  archiviert: number;
  offeneAufgaben: number;
}
