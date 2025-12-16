import { useState, useEffect } from 'react';
import type { Customer, FilterOptions, Statistics } from '../types';
import { customerService, statisticsService } from '../db/customerService';
import { getStatusLabel, getStatusColor, getPriorityColor, getOrderTypeLabel } from '../utils/workflows';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  Search,
  Plus,
  Filter,
  Phone,
  Mail,
  Building2,
  AlertCircle,
  CheckCircle,
  Clock,
  Archive,
  ListTodo,
  Bell,
} from 'lucide-react';

interface DashboardProps {
  onSelectCustomer: (customer: Customer) => void;
  onCreateCustomer: () => void;
}

export function Dashboard({ onSelectCustomer, onCreateCustomer }: DashboardProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    gesamt: 0,
    offen: 0,
    hochPrioritaet: 0,
    faelligeErinnerungen: 0,
    nachzufassen: 0,
    archiviert: 0,
    offeneAufgaben: 0,
  });
  const [filter, setFilter] = useState<FilterOptions>({
    auftragstyp: 'alle',
    prioritaet: 'alle',
    nurOffene: false,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'customers' | 'todos'>('customers');

  // Daten laden
  useEffect(() => {
    loadData();
  }, [filter, searchTerm]);

  async function loadData() {
    const filterOptions = {
      ...filter,
      suchbegriff: searchTerm,
    };
    const loadedCustomers = await customerService.getCustomers(filterOptions);
    setCustomers(loadedCustomers);

    const stats = await statisticsService.getStatistics();
    setStatistics(stats);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Wölfleder Stalltechnik</h1>
              <p className="text-blue-100 mt-1">Kundenverwaltung</p>
            </div>
            <button
              onClick={onCreateCustomer}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-md"
            >
              <Plus size={20} />
              Neuer Kunde
            </button>
          </div>
        </div>
      </div>

      {/* View Mode Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4">
            <button
              onClick={() => setViewMode('customers')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                viewMode === 'customers'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <Building2 size={18} />
                Kunden
              </div>
            </button>
            <button
              onClick={() => setViewMode('todos')}
              className={`px-4 py-3 font-medium border-b-2 transition-colors ${
                viewMode === 'todos'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <ListTodo size={18} />
                Aufgaben
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Statistiken */}
      {viewMode === 'customers' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 lg:grid-cols-7 gap-4">
          <StatCard
            icon={<Building2 />}
            label="Gesamt"
            value={statistics.gesamt}
            color="blue"
            onClick={() => {
              setFilter({ auftragstyp: 'alle', prioritaet: 'alle', nurOffene: false, zeigArchivierte: false });
              setSearchTerm('');
            }}
          />
          <StatCard
            icon={<Clock />}
            label="Offen"
            value={statistics.offen}
            color="yellow"
            onClick={() => {
              setFilter({ auftragstyp: 'alle', prioritaet: 'alle', nurOffene: true, zeigArchivierte: false });
              setSearchTerm('');
            }}
          />
          <StatCard
            icon={<AlertCircle />}
            label="Hohe Priorität"
            value={statistics.hochPrioritaet}
            color="red"
            onClick={() => {
              setFilter({ auftragstyp: 'alle', prioritaet: 'hoch', nurOffene: false, zeigArchivierte: false });
              setSearchTerm('');
            }}
          />
          <StatCard
            icon={<Phone />}
            label="Nachfassen"
            value={statistics.nachzufassen}
            color="orange"
            onClick={() => {
              setFilter({ auftragstyp: 'alle', prioritaet: 'alle', nurOffene: false, zeigArchivierte: false, status: 'nachfassen' });
              setSearchTerm('');
            }}
          />
          <StatCard
            icon={<CheckCircle />}
            label="Erinnerungen"
            value={statistics.faelligeErinnerungen}
            color="purple"
            onClick={() => {
              // Filter nach Kunden mit fälligen Erinnerungen - wird im customerService behandelt
              setFilter({ auftragstyp: 'alle', prioritaet: 'alle', nurOffene: false, zeigArchivierte: false });
              setSearchTerm('');
            }}
          />
          <StatCard
            icon={<Archive />}
            label="Archiviert"
            value={statistics.archiviert}
            color="gray"
            onClick={() => {
              setFilter({ auftragstyp: 'alle', prioritaet: 'alle', nurOffene: false, zeigArchivierte: true });
              setSearchTerm('');
            }}
          />
          <StatCard
            icon={<ListTodo />}
            label="Aufgaben"
            value={statistics.offeneAufgaben}
            color="blue"
            onClick={() => {
              setViewMode('todos');
            }}
          />
        </div>
        </div>
      )}

      {/* Such- und Filterbereich */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          {viewMode === 'customers' ? (
            <>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Suchfeld */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Kunde suchen (Name, Firma, Email, Telefon)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Filter-Button */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Filter size={20} />
                  Filter
                </button>
              </div>

              {/* Filter-Optionen */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Auftragstyp
                    </label>
                    <select
                      value={filter.auftragstyp || 'alle'}
                      onChange={(e) => setFilter({ ...filter, auftragstyp: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="alle">Alle</option>
                      <option value="tor">Tore</option>
                      <option value="stallbau">Stallbau</option>
                      <option value="produkte">Produkte</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priorität
                    </label>
                    <select
                      value={filter.prioritaet || 'alle'}
                      onChange={(e) => setFilter({ ...filter, prioritaet: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="alle">Alle</option>
                      <option value="hoch">Hoch</option>
                      <option value="mittel">Mittel</option>
                      <option value="niedrig">Niedrig</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2 justify-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filter.nurOffene || false}
                        onChange={(e) => setFilter({ ...filter, nurOffene: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Nur offene Aufträge
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filter.zeigArchivierte || false}
                        onChange={(e) => setFilter({ ...filter, zeigArchivierte: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Archivierte anzeigen
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Kunde suchen (Name, Firma, Email, Telefon)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
        </div>
      </div>

      {/* Kunden-Liste */}
      {viewMode === 'customers' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {customers.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="mx-auto text-gray-400" size={48} />
                <h3 className="mt-4 text-lg font-medium text-gray-900">Keine Kunden gefunden</h3>
                <p className="mt-2 text-gray-500">
                  {searchTerm || filter.auftragstyp !== 'alle' || filter.prioritaet !== 'alle'
                    ? 'Versuchen Sie andere Filtereinstellungen'
                    : 'Erstellen Sie Ihren ersten Kunden'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {customers.map((customer) => (
                  <CustomerCard
                    key={customer.id}
                    customer={customer}
                    onClick={() => onSelectCustomer(customer)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Aufgaben-Ansicht */}
      {viewMode === 'todos' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="space-y-4">
            {/* Kunden mit fälligen Erinnerungen */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Bell className="text-red-500" size={20} />
                Fällige Erinnerungen ({statistics.faelligeErinnerungen})
              </h3>
              <div className="space-y-3">
                {customers
                  .filter(c => c.erinnerungen.some(r => !r.erledigt && new Date(r.faelligAm) <= new Date()))
                  .map(customer => {
                    const overdueReminders = customer.erinnerungen.filter(
                      r => !r.erledigt && new Date(r.faelligAm) <= new Date()
                    );
                    return (
                      <div
                        key={customer.id}
                        onClick={() => onSelectCustomer(customer)}
                        className="p-4 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {customer.firma || `${customer.vorname} ${customer.nachname}`}
                            </h4>
                            <div className="mt-2 space-y-1">
                              {overdueReminders.map(reminder => (
                                <div key={reminder.id} className="text-sm text-gray-700 flex items-center gap-2">
                                  <Clock size={14} className="text-red-600" />
                                  <span className="font-medium">{reminder.typ}:</span>
                                  <span>{reminder.beschreibung}</span>
                                  <span className="text-red-600">
                                    ({format(new Date(reminder.faelligAm), 'dd.MM.yyyy HH:mm', { locale: de })})
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {customers.filter(c => c.erinnerungen.some(r => !r.erledigt && new Date(r.faelligAm) <= new Date())).length === 0 && (
                  <p className="text-center text-gray-500 py-8">Keine fälligen Erinnerungen</p>
                )}
              </div>
            </div>

            {/* Offene Aufgaben */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ListTodo className="text-blue-500" size={20} />
                Offene Aufgaben ({statistics.offeneAufgaben})
              </h3>
              <div className="space-y-3">
                {customers
                  .filter(c => (c.aufgaben || []).some(t => !t.erledigt))
                  .map(customer => {
                    const openTasks = (customer.aufgaben || []).filter(t => !t.erledigt);
                    return (
                      <div
                        key={customer.id}
                        onClick={() => onSelectCustomer(customer)}
                        className="p-4 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 cursor-pointer transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {customer.firma || `${customer.vorname} ${customer.nachname}`}
                            </h4>
                            <div className="mt-2 space-y-1">
                              {openTasks.map(task => {
                                const now = new Date();
                                const isOverdue = new Date(task.faelligAm) <= now;
                                return (
                                  <div key={task.id} className="text-sm text-gray-700 flex items-center gap-2">
                                    <Clock size={14} className={isOverdue ? 'text-red-600' : 'text-blue-600'} />
                                    <span>{task.beschreibung}</span>
                                    <span className={isOverdue ? 'text-red-600 font-medium' : 'text-gray-600'}>
                                      ({format(new Date(task.faelligAm), 'dd.MM.yyyy HH:mm', { locale: de })})
                                      {isOverdue && ' - Überfällig!'}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {customers.filter(c => (c.aufgaben || []).some(t => !t.erledigt)).length === 0 && (
                  <p className="text-center text-gray-500 py-8">Keine offenen Aufgaben</p>
                )}
              </div>
            </div>

            {/* Hohe Priorität */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="text-red-500" size={20} />
                Hohe Priorität ({statistics.hochPrioritaet})
              </h3>
              <div className="space-y-3">
                {customers
                  .filter(c => c.prioritaet === 'hoch' && !c.status.includes('abgeschlossen'))
                  .map(customer => (
                    <div
                      key={customer.id}
                      onClick={() => onSelectCustomer(customer)}
                      className="p-4 border border-red-200 bg-white rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">
                            {customer.firma || `${customer.vorname} ${customer.nachname}`}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {getOrderTypeLabel(customer.auftragstyp)} - {getStatusLabel(customer.auftragstyp, customer.status)}
                          </p>
                          <p className="text-sm text-gray-700 mt-2">{customer.beschreibung}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                {customers.filter(c => c.prioritaet === 'hoch' && !c.status.includes('abgeschlossen')).length === 0 && (
                  <p className="text-center text-gray-500 py-8">Keine Kunden mit hoher Priorität</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Statistik-Karte Komponente
function StatCard({ icon, label, value, color, onClick }: any) {
  const colorClasses: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-600',
    yellow: 'bg-yellow-100 text-yellow-600',
    red: 'bg-red-100 text-red-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
    gray: 'bg-gray-100 text-gray-600',
  };

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-4 flex items-center gap-4 hover:shadow-lg transition-shadow cursor-pointer text-left w-full"
    >
      <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </button>
  );
}

// Kunden-Karte Komponente
function CustomerCard({ customer, onClick }: { customer: Customer; onClick: () => void }) {
  const priorityColor = getPriorityColor(customer.prioritaet);
  const statusColor = getStatusColor(customer.status);

  const priorityClasses: Record<string, string> = {
    red: 'bg-red-100 text-red-800 border-red-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    green: 'bg-green-100 text-green-800 border-green-200',
  };

  const statusClasses: Record<string, string> = {
    red: 'bg-red-100 text-red-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    gray: 'bg-gray-100 text-gray-800',
  };

  return (
    <div
      onClick={onClick}
      className="p-4 sm:p-6 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3">
            <div className={`mt-1 w-1 h-16 rounded-full ${priorityClasses[priorityColor]}`} />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {customer.firma || `${customer.vorname} ${customer.nachname}`}
              </h3>
              {customer.firma && (
                <p className="text-sm text-gray-600">
                  {customer.vorname} {customer.nachname}
                </p>
              )}
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {customer.beschreibung}
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[statusColor]}`}>
                  {getStatusLabel(customer.auftragstyp, customer.status)}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {getOrderTypeLabel(customer.auftragstyp)}
                </span>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityClasses[priorityColor]}`}>
                  Priorität: {customer.prioritaet}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone size={16} />
            <span>{customer.telefon}</span>
          </div>
          {customer.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail size={16} />
              <span className="truncate">{customer.email}</span>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Erstellt: {format(new Date(customer.erstelltAm), 'dd.MM.yyyy', { locale: de })}
          </p>
        </div>
      </div>
    </div>
  );
}
