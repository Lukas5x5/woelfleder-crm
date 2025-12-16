import type { OrderType, TorStatus, StallbauStatus, ProdukteStatus } from '../types';

// Workflow-Definitionen für Tor-Aufträge
export const torWorkflow: { status: TorStatus; label: string }[] = [
  { status: 'anfrage_erfasst', label: 'Anfrage erfasst' },
  { status: 'ausmessen_geplant', label: 'Ausmessen geplant' },
  { status: 'angebot_erstellt', label: 'Angebot erstellt' },
  { status: 'nachfassen', label: 'Nachfassen' },
  { status: 'angebot_unterschrieben', label: 'Angebot unterschrieben' },
  { status: 'an_firma_gesendet', label: 'An Firma gesendet' },
  { status: 'auftragsbestaetigung', label: 'Auftragsbestätigung' },
  { status: 'in_produktion', label: 'In Produktion' },
  { status: 'liefertermin', label: 'Liefertermin' },
  { status: 'montagetermin', label: 'Montagetermin' },
  { status: 'abgeschlossen', label: 'Abgeschlossen' },
];

// Workflow-Definitionen für Stallbau
export const stallbauWorkflow: { status: StallbauStatus; label: string }[] = [
  { status: 'erstgespraech', label: 'Erstgespräch' },
  { status: 'zeichnung_erstellt', label: 'Zeichnung erstellt' },
  { status: 'angebot_erstellt', label: 'Angebot erstellt' },
  { status: 'nachfassen', label: 'Nachfassen' },
  { status: 'angebot_angenommen', label: 'Angebot angenommen' },
  { status: 'profi_plan_angefordert', label: 'Profi-Plan angefordert' },
  { status: 'plan_unterschrieben', label: 'Plan unterschrieben' },
  { status: 'bau_begonnen', label: 'Bau begonnen' },
  { status: 'baubegleitung', label: 'Baubegleitung' },
  { status: 'fertigstellung', label: 'Fertigstellung' },
  { status: 'abgeschlossen', label: 'Abgeschlossen' },
];

// Workflow für Produkte (gleich wie Tor)
export const produkteWorkflow: { status: ProdukteStatus; label: string }[] = torWorkflow;

// Workflow basierend auf Auftragstyp abrufen
export function getWorkflowForOrderType(orderType: OrderType) {
  switch (orderType) {
    case 'tor':
      return torWorkflow;
    case 'stallbau':
      return stallbauWorkflow;
    case 'produkte':
      return produkteWorkflow;
    default:
      return torWorkflow;
  }
}

// Status-Label abrufen
export function getStatusLabel(orderType: OrderType, status: string): string {
  const workflow = getWorkflowForOrderType(orderType);
  const step = workflow.find(s => s.status === status);
  return step?.label || status;
}

// Nächster Status im Workflow
export function getNextStatus(orderType: OrderType, currentStatus: string): string | null {
  const workflow = getWorkflowForOrderType(orderType);
  const currentIndex = workflow.findIndex(s => s.status === currentStatus);
  if (currentIndex === -1 || currentIndex === workflow.length - 1) return null;
  return workflow[currentIndex + 1].status;
}

// Vorheriger Status im Workflow
export function getPreviousStatus(orderType: OrderType, currentStatus: string): string | null {
  const workflow = getWorkflowForOrderType(orderType);
  const currentIndex = workflow.findIndex(s => s.status === currentStatus);
  if (currentIndex <= 0) return null;
  return workflow[currentIndex - 1].status;
}

// Prüfen ob Status abgeschlossen ist
export function isCompletedStatus(status: string): boolean {
  return status.includes('abgeschlossen');
}

// Fortschritt berechnen (0-100%)
export function calculateProgress(orderType: OrderType, currentStatus: string): number {
  const workflow = getWorkflowForOrderType(orderType);
  const currentIndex = workflow.findIndex(s => s.status === currentStatus);
  if (currentIndex === -1) return 0;
  return Math.round((currentIndex / (workflow.length - 1)) * 100);
}

// Status-Farbe für UI
export function getStatusColor(status: string): string {
  if (status.includes('abgeschlossen')) return 'green';
  if (status.includes('nachfassen')) return 'red';
  if (status.includes('erstellt') || status.includes('geplant')) return 'yellow';
  if (status.includes('produktion') || status.includes('bau')) return 'blue';
  return 'gray';
}

// Prioritäts-Farbe
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'hoch':
      return 'red';
    case 'mittel':
      return 'yellow';
    case 'niedrig':
      return 'green';
    default:
      return 'gray';
  }
}

// Auftragstyp-Label
export function getOrderTypeLabel(orderType: OrderType): string {
  switch (orderType) {
    case 'tor':
      return 'Tor';
    case 'stallbau':
      return 'Stallbau';
    case 'produkte':
      return 'Produkte';
    default:
      return orderType;
  }
}
