import { useState, useEffect } from 'react';
import type { Customer, Activity, Reminder } from '../types';
import { customerService, reminderService, taskService } from '../db/customerService';
import {
  getWorkflowForOrderType,
  getStatusLabel,
  calculateProgress,
  getNextStatus,
  getPreviousStatus,
  getStatusColor,
  getPriorityColor,
  getOrderTypeLabel,
} from '../utils/workflows';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  MapPin,
  FileText,
  MessageSquare,
  Bell,
  ChevronRight,
  ChevronLeft,
  Plus,
  Check,
  Clock,
  Archive,
  ArchiveRestore,
  Trash2,
  ListTodo,
  X,
} from 'lucide-react';

interface CustomerDetailProps {
  customerId: string;
  onBack: () => void;
  onEdit: (customer: Customer) => void;
}

export function CustomerDetail({ customerId, onBack, onEdit }: CustomerDetailProps) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState<'workflow' | 'aktivitaeten' | 'termine' | 'aufgaben' | 'dokumente'>('workflow');
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);
  const [archiveReason, setArchiveReason] = useState('');
  const [newActivity, setNewActivity] = useState({ typ: 'notiz' as const, beschreibung: '' });
  const [newReminder, setNewReminder] = useState({
    typ: 'nachfassen' as const,
    beschreibung: '',
    faelligAm: '',
  });
  const [newTask, setNewTask] = useState({
    beschreibung: '',
    faelligAm: '',
  });

  useEffect(() => {
    loadCustomer();
  }, [customerId]);

  async function loadCustomer() {
    const data = await customerService.getCustomer(customerId);
    if (data) {
      setCustomer(data);
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!customer) return;

    const confirmed = window.confirm(
      `Status ändern zu: ${getStatusLabel(customer.auftragstyp, newStatus)}?`
    );

    if (confirmed) {
      await customerService.updateStatus(customerId, newStatus as any);
      await loadCustomer();
    }
  }

  async function handleAddActivity() {
    if (!newActivity.beschreibung.trim()) {
      alert('Bitte eine Beschreibung eingeben');
      return;
    }

    await customerService.addActivity(customerId, newActivity);
    setNewActivity({ typ: 'notiz', beschreibung: '' });
    setShowAddActivity(false);
    await loadCustomer();
  }

  async function handleAddReminder() {
    if (!newReminder.beschreibung.trim() || !newReminder.faelligAm) {
      alert('Bitte alle Felder ausfüllen');
      return;
    }

    await reminderService.createReminder({
      kundenId: customerId,
      typ: newReminder.typ,
      beschreibung: newReminder.beschreibung,
      faelligAm: new Date(newReminder.faelligAm),
      erledigt: false,
    });

    setNewReminder({ typ: 'nachfassen', beschreibung: '', faelligAm: '' });
    setShowAddReminder(false);
    await loadCustomer();
  }

  async function handleCompleteReminder(reminderId: string) {
    await reminderService.completeReminder(reminderId);
    await loadCustomer();
  }

  async function handleAddTask() {
    if (!newTask.beschreibung.trim() || !newTask.faelligAm) {
      alert('Bitte alle Felder ausfüllen');
      return;
    }

    await taskService.addTask(customerId, newTask.beschreibung, new Date(newTask.faelligAm));
    setNewTask({ beschreibung: '', faelligAm: '' });
    setShowAddTask(false);
    await loadCustomer();
  }

  async function handleCompleteTask(taskId: string) {
    await taskService.completeTask(customerId, taskId);
    await loadCustomer();
  }

  async function handleDeleteTask(taskId: string) {
    await taskService.deleteTask(customerId, taskId);
    await loadCustomer();
  }

  async function handleArchive() {
    if (!archiveReason.trim()) {
      alert('Bitte geben Sie einen Grund für die Archivierung an.');
      return;
    }

    try {
      await customerService.archiveCustomer(customerId, archiveReason);
      setShowArchiveDialog(false);
      setArchiveReason('');
      onBack(); // Zurück zum Dashboard nach Archivierung
    } catch (error) {
      console.error('Fehler beim Archivieren:', error);
      alert('Fehler beim Archivieren des Kunden');
    }
  }

  async function handleUnarchive() {
    const confirmed = window.confirm('Möchten Sie diesen Kunden wirklich wiederherstellen?');
    if (!confirmed) return;

    try {
      await customerService.unarchiveCustomer(customerId);
      await loadCustomer();
    } catch (error) {
      console.error('Fehler beim Wiederherstellen:', error);
      alert('Fehler beim Wiederherstellen des Kunden');
    }
  }

  async function handleDelete() {
    const customerName = customer?.firma || `${customer?.vorname} ${customer?.nachname}`;
    const confirmed = window.confirm(
      `Möchten Sie den Kunden "${customerName}" wirklich DAUERHAFT löschen?\n\n` +
      'Diese Aktion kann nicht rückgängig gemacht werden!\n\n' +
      'Tipp: Verwenden Sie stattdessen "Archivieren", um den Kunden zu behalten.'
    );
    if (!confirmed) return;

    // Zweite Bestätigung für zusätzliche Sicherheit
    const doubleConfirm = window.confirm(
      'Sind Sie ABSOLUT SICHER?\n\nAlle Daten, Aktivitäten, Erinnerungen und Dokumente werden gelöscht!'
    );
    if (!doubleConfirm) return;

    try {
      await customerService.deleteCustomer(customerId);
      alert('Kunde wurde erfolgreich gelöscht');
      onBack(); // Zurück zum Dashboard
    } catch (error) {
      console.error('Fehler beim Löschen:', error);
      alert('Fehler beim Löschen des Kunden');
    }
  }

  if (!customer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Clock className="mx-auto text-gray-400 animate-spin" size={48} />
          <p className="mt-4 text-gray-600">Lade Kundendaten...</p>
        </div>
      </div>
    );
  }

  const workflow = getWorkflowForOrderType(customer.auftragstyp);
  const progress = calculateProgress(customer.auftragstyp, customer.status);
  const nextStatus = getNextStatus(customer.auftragstyp, customer.status);
  const previousStatus = getPreviousStatus(customer.auftragstyp, customer.status);
  const priorityColor = getPriorityColor(customer.prioritaet);
  const statusColor = getStatusColor(customer.status);

  const priorityClasses: Record<string, string> = {
    red: 'bg-red-100 text-red-800 border-red-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    green: 'bg-green-100 text-green-800 border-green-200',
  };

  const statusClasses: Record<string, string> = {
    red: 'bg-red-500',
    yellow: 'bg-yellow-500',
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    gray: 'bg-gray-500',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {customer.firma || `${customer.vorname} ${customer.nachname}`}
              </h1>
              {customer.firma && (
                <p className="text-gray-600">
                  {customer.vorname} {customer.nachname}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(customer)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit size={18} />
                <span className="hidden sm:inline">Bearbeiten</span>
              </button>
              {customer.archiviert ? (
                <button
                  onClick={handleUnarchive}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <ArchiveRestore size={18} />
                  <span className="hidden sm:inline">Wiederherstellen</span>
                </button>
              ) : (
                <button
                  onClick={() => setShowArchiveDialog(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Archive size={18} />
                  <span className="hidden sm:inline">Archivieren</span>
                </button>
              )}
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                title="Kunde dauerhaft löschen"
              >
                <Trash2 size={18} />
                <span className="hidden sm:inline">Löschen</span>
              </button>
            </div>
          </div>

          {/* Kontaktinfo */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <Phone size={16} />
              <a href={`tel:${customer.telefon}`} className="hover:text-blue-600">
                {customer.telefon}
              </a>
            </div>
            {customer.email && (
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <a href={`mailto:${customer.email}`} className="hover:text-blue-600">
                  {customer.email}
                </a>
              </div>
            )}
            {customer.adresse && (
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>
                  {customer.adresse}, {customer.plz} {customer.ort}
                </span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {getOrderTypeLabel(customer.auftragstyp)}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${priorityClasses[priorityColor]}`}>
              Priorität: {customer.prioritaet}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              Erstellt: {format(new Date(customer.erstelltAm), 'dd.MM.yyyy', { locale: de })}
            </span>
          </div>
        </div>
      </div>

      {/* Workflow Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {getStatusLabel(customer.auftragstyp, customer.status)}
            </span>
            <span className="text-sm text-gray-600">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${statusClasses[statusColor]}`}
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex gap-2 mt-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Status ändern:
              </label>
              <select
                value={customer.status}
                onChange={(e) => handleStatusChange(e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                {workflow.map((step) => (
                  <option key={step.status} value={step.status}>
                    {step.label}
                  </option>
                ))}
              </select>
            </div>
            {previousStatus && (
              <button
                onClick={() => handleStatusChange(previousStatus)}
                className="flex items-center gap-1 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors self-end"
              >
                <ChevronLeft size={16} />
                Zurück
              </button>
            )}
            {nextStatus && (
              <button
                onClick={() => handleStatusChange(nextStatus)}
                className="flex items-center gap-1 px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors self-end"
              >
                Weiter
                <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            <TabButton
              icon={<FileText size={18} />}
              label="Workflow"
              active={activeTab === 'workflow'}
              onClick={() => setActiveTab('workflow')}
            />
            <TabButton
              icon={<MessageSquare size={18} />}
              label="Aktivitäten"
              active={activeTab === 'aktivitaeten'}
              onClick={() => setActiveTab('aktivitaeten')}
              badge={customer.aktivitaeten.length}
            />
            <TabButton
              icon={<Bell size={18} />}
              label="Erinnerungen"
              active={activeTab === 'termine'}
              onClick={() => setActiveTab('termine')}
              badge={customer.erinnerungen.filter(r => !r.erledigt).length}
            />
            <TabButton
              icon={<ListTodo size={18} />}
              label="Aufgaben"
              active={activeTab === 'aufgaben'}
              onClick={() => setActiveTab('aufgaben')}
              badge={(customer.aufgaben || []).filter(t => !t.erledigt).length}
            />
            <TabButton
              icon={<FileText size={18} />}
              label="Dokumente"
              active={activeTab === 'dokumente'}
              onClick={() => setActiveTab('dokumente')}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'workflow' && (
              <WorkflowTab customer={customer} workflow={workflow} />
            )}
            {activeTab === 'aktivitaeten' && (
              <AktivitaetenTab
                customer={customer}
                showAddActivity={showAddActivity}
                setShowAddActivity={setShowAddActivity}
                newActivity={newActivity}
                setNewActivity={setNewActivity}
                onAddActivity={handleAddActivity}
              />
            )}
            {activeTab === 'termine' && (
              <ErinnerungenTab
                customer={customer}
                showAddReminder={showAddReminder}
                setShowAddReminder={setShowAddReminder}
                newReminder={newReminder}
                setNewReminder={setNewReminder}
                onAddReminder={handleAddReminder}
                onCompleteReminder={handleCompleteReminder}
              />
            )}
            {activeTab === 'aufgaben' && (
              <AufgabenTab
                customer={customer}
                showAddTask={showAddTask}
                setShowAddTask={setShowAddTask}
                newTask={newTask}
                setNewTask={setNewTask}
                onAddTask={handleAddTask}
                onCompleteTask={handleCompleteTask}
                onDeleteTask={handleDeleteTask}
              />
            )}
            {activeTab === 'dokumente' && <DokumenteTab />}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Beschreibung */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Was braucht der Kunde?</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{customer.beschreibung}</p>
              {customer.anforderungen && (
                <>
                  <h4 className="text-sm font-semibold text-gray-900 mt-4 mb-2">Anforderungen</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{customer.anforderungen}</p>
                </>
              )}
              {customer.notizen && (
                <>
                  <h4 className="text-sm font-semibold text-gray-900 mt-4 mb-2">Notizen</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{customer.notizen}</p>
                </>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Schnellaktionen</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setShowAddActivity(true)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                >
                  <MessageSquare size={18} />
                  Aktivität hinzufügen
                </button>
                <button
                  onClick={() => setShowAddReminder(true)}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left bg-yellow-50 hover:bg-yellow-100 text-yellow-700 rounded-lg transition-colors"
                >
                  <Bell size={18} />
                  Erinnerung erstellen
                </button>
                <a
                  href={`tel:${customer.telefon}`}
                  className="w-full flex items-center gap-2 px-4 py-2 text-left bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors"
                >
                  <Phone size={18} />
                  Kunde anrufen
                </a>
                {customer.email && (
                  <a
                    href={`mailto:${customer.email}`}
                    className="w-full flex items-center gap-2 px-4 py-2 text-left bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors"
                  >
                    <Mail size={18} />
                    Email senden
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Archivierungs-Dialog */}
      {showArchiveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Kunde archivieren</h3>
            <p className="text-gray-600 mb-4">
              Bitte geben Sie einen Grund für die Archivierung an:
            </p>
            <textarea
              value={archiveReason}
              onChange={(e) => setArchiveReason(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
              placeholder="z.B. Auftrag storniert, Kunde hat abgesagt, Projekt verschoben..."
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowArchiveDialog(false);
                  setArchiveReason('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                Abbrechen
              </button>
              <button
                onClick={handleArchive}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Archivieren
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Tab Button Component
function TabButton({ icon, label, active, onClick, badge }: any) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors whitespace-nowrap ${
        active
          ? 'border-blue-600 text-blue-600'
          : 'border-transparent text-gray-600 hover:text-gray-900'
      }`}
    >
      {icon}
      <span>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="ml-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}

// Workflow Tab
function WorkflowTab({ customer, workflow }: any) {
  // Sortiere die durchlaufenen Schritte nach Datum
  const completedSteps = (customer.workflowSchritte || [])
    .sort((a: any, b: any) => new Date(a.erreichtAm).getTime() - new Date(b.erreichtAm).getTime());

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Workflow-Historie</h2>

      {completedSteps.length === 0 ? (
        <p className="text-gray-500 text-center py-8">Noch keine Workflow-Schritte durchlaufen</p>
      ) : (
        <div className="space-y-3">
          {completedSteps.map((step: any, index: number) => {
            const isActive = step.status === customer.status;
            const stepLabel = workflow.find((w: any) => w.status === step.status)?.label || step.status;

            return (
              <div
                key={step.id}
                className={`flex items-start gap-4 p-4 rounded-lg border-2 transition-all ${
                  isActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-green-500 bg-green-50'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isActive
                      ? 'bg-blue-500 text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  {isActive ? <span className="font-bold">{index + 1}</span> : <Check size={18} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900">
                      {stepLabel}
                      {isActive && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Aktuell</span>}
                    </h3>
                    <span className="text-xs text-gray-600">
                      {format(new Date(step.erreichtAm), 'dd.MM.yyyy HH:mm', { locale: de })}
                    </span>
                  </div>
                  {step.notizen && (
                    <p className="text-sm text-gray-600 mt-1">{step.notizen}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Aktivitäten Tab
function AktivitaetenTab({
  customer,
  showAddActivity,
  setShowAddActivity,
  newActivity,
  setNewActivity,
  onAddActivity,
}: any) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Aktivitäten</h2>
        <button
          onClick={() => setShowAddActivity(!showAddActivity)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Hinzufügen
        </button>
      </div>

      {showAddActivity && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <select
            value={newActivity.typ}
            onChange={(e) => setNewActivity({ ...newActivity, typ: e.target.value as any })}
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="notiz">Notiz</option>
            <option value="anruf">Anruf</option>
            <option value="email">Email</option>
            <option value="besuch">Besuch</option>
          </select>
          <textarea
            value={newActivity.beschreibung}
            onChange={(e) => setNewActivity({ ...newActivity, beschreibung: e.target.value })}
            placeholder="Beschreibung..."
            rows={3}
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg"
          />
          <div className="flex gap-2">
            <button
              onClick={onAddActivity}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Speichern
            </button>
            <button
              onClick={() => setShowAddActivity(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {customer.aktivitaeten.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Keine Aktivitäten vorhanden</p>
        ) : (
          [...customer.aktivitaeten]
            .sort((a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime())
            .map((activity: Activity) => (
              <div key={activity.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {activity.typ}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(activity.datum), 'dd.MM.yyyy HH:mm', { locale: de })}
                      </span>
                    </div>
                    <p className="text-gray-700">{activity.beschreibung}</p>
                  </div>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}

// Erinnerungen Tab
function ErinnerungenTab({
  customer,
  showAddReminder,
  setShowAddReminder,
  newReminder,
  setNewReminder,
  onAddReminder,
  onCompleteReminder,
}: any) {
  const now = new Date();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Erinnerungen</h2>
        <button
          onClick={() => setShowAddReminder(!showAddReminder)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Hinzufügen
        </button>
      </div>

      {showAddReminder && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <select
            value={newReminder.typ}
            onChange={(e) => setNewReminder({ ...newReminder, typ: e.target.value as any })}
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="nachfassen">Nachfassen</option>
            <option value="termin">Termin</option>
            <option value="allgemein">Allgemein</option>
          </select>
          <input
            type="datetime-local"
            value={newReminder.faelligAm}
            onChange={(e) => setNewReminder({ ...newReminder, faelligAm: e.target.value })}
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg"
          />
          <textarea
            value={newReminder.beschreibung}
            onChange={(e) => setNewReminder({ ...newReminder, beschreibung: e.target.value })}
            placeholder="Beschreibung..."
            rows={3}
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg"
          />
          <div className="flex gap-2">
            <button
              onClick={onAddReminder}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Speichern
            </button>
            <button
              onClick={() => setShowAddReminder(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {customer.erinnerungen.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Keine Erinnerungen vorhanden</p>
        ) : (
          [...customer.erinnerungen]
            .sort((a, b) => new Date(a.faelligAm).getTime() - new Date(b.faelligAm).getTime())
            .map((reminder: Reminder) => {
              const isDue = new Date(reminder.faelligAm) <= now;
              const isOverdue = isDue && !reminder.erledigt;

              return (
                <div
                  key={reminder.id}
                  className={`p-4 rounded-lg border-2 ${
                    reminder.erledigt
                      ? 'border-green-200 bg-green-50'
                      : isOverdue
                      ? 'border-red-500 bg-red-50'
                      : 'border-yellow-200 bg-yellow-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            reminder.erledigt
                              ? 'bg-green-100 text-green-800'
                              : isOverdue
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {reminder.typ}
                        </span>
                        <span className="text-xs text-gray-600">
                          {format(new Date(reminder.faelligAm), 'dd.MM.yyyy HH:mm', { locale: de })}
                        </span>
                        {isOverdue && (
                          <span className="text-xs text-red-600 font-medium">Überfällig!</span>
                        )}
                      </div>
                      <p className={reminder.erledigt ? 'text-gray-600 line-through' : 'text-gray-900'}>
                        {reminder.beschreibung}
                      </p>
                    </div>
                    {!reminder.erledigt && (
                      <button
                        onClick={() => onCompleteReminder(reminder.id)}
                        className="flex-shrink-0 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <Check size={18} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}

// Aufgaben Tab
function AufgabenTab({
  customer,
  showAddTask,
  setShowAddTask,
  newTask,
  setNewTask,
  onAddTask,
  onCompleteTask,
  onDeleteTask,
}: any) {
  const now = new Date();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Aufgaben</h2>
        <button
          onClick={() => setShowAddTask(!showAddTask)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} />
          Hinzufügen
        </button>
      </div>

      {showAddTask && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <input
            type="datetime-local"
            value={newTask.faelligAm}
            onChange={(e) => setNewTask({ ...newTask, faelligAm: e.target.value })}
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg"
          />
          <textarea
            value={newTask.beschreibung}
            onChange={(e) => setNewTask({ ...newTask, beschreibung: e.target.value })}
            placeholder="Was muss erledigt werden?"
            rows={3}
            className="w-full mb-3 px-3 py-2 border border-gray-300 rounded-lg"
          />
          <div className="flex gap-2">
            <button
              onClick={onAddTask}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Speichern
            </button>
            <button
              onClick={() => setShowAddTask(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {(customer.aufgaben || []).length === 0 ? (
          <p className="text-center text-gray-500 py-8">Keine Aufgaben vorhanden</p>
        ) : (
          [...(customer.aufgaben || [])]
            .sort((a, b) => new Date(a.faelligAm).getTime() - new Date(b.faelligAm).getTime())
            .map((task: any) => {
              const isDue = new Date(task.faelligAm) <= now;
              const isOverdue = isDue && !task.erledigt;

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border-2 ${
                    task.erledigt
                      ? 'border-green-200 bg-green-50'
                      : isOverdue
                      ? 'border-red-500 bg-red-50'
                      : 'border-yellow-200 bg-yellow-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs text-gray-600">
                          {format(new Date(task.faelligAm), 'dd.MM.yyyy HH:mm', { locale: de })}
                        </span>
                        {isOverdue && (
                          <span className="text-xs text-red-600 font-medium">Überfällig!</span>
                        )}
                        {task.erledigt && (
                          <span className="text-xs text-green-600 font-medium">Erledigt</span>
                        )}
                      </div>
                      <p className={task.erledigt ? 'text-gray-600 line-through' : 'text-gray-900'}>
                        {task.beschreibung}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!task.erledigt && (
                        <button
                          onClick={() => onCompleteTask(task.id)}
                          className="flex-shrink-0 p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                          title="Als erledigt markieren"
                        >
                          <Check size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="flex-shrink-0 p-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        title="Aufgabe löschen"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}

// Dokumente Tab
function DokumenteTab() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Dokumente</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus size={18} />
          Hochladen
        </button>
      </div>
      <div className="text-center py-12 text-gray-500">
        <FileText className="mx-auto mb-4" size={48} />
        <p>Dokumenten-Upload wird in der nächsten Version implementiert</p>
        <p className="text-sm mt-2">Vorerst können Dokumente extern verwaltet werden</p>
      </div>
    </div>
  );
}
