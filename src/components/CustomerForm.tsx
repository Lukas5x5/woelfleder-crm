import { useState } from 'react';
import type { Customer, OrderType, Priority } from '../types';
import { customerService } from '../db/customerService';
import { getWorkflowForOrderType } from '../utils/workflows';
import { X, Save } from 'lucide-react';

interface CustomerFormProps {
  customer?: Customer;
  onClose: () => void;
  onSave: () => void;
}

export function CustomerForm({ customer, onClose, onSave }: CustomerFormProps) {
  const isEdit = !!customer;

  const [formData, setFormData] = useState({
    firma: customer?.firma || '',
    vorname: customer?.vorname || '',
    nachname: customer?.nachname || '',
    email: customer?.email || '',
    telefon: customer?.telefon || '',
    adresse: customer?.adresse || '',
    plz: customer?.plz || '',
    ort: customer?.ort || '',
    auftragstyp: customer?.auftragstyp || ('tor' as OrderType),
    prioritaet: customer?.prioritaet || ('mittel' as Priority),
    beschreibung: customer?.beschreibung || '',
    anforderungen: customer?.anforderungen || '',
    notizen: customer?.notizen || '',
    kontaktiert: customer?.kontaktiert || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  function handleChange(field: string, value: any) {
    setFormData({ ...formData, [field]: value });
    // Fehler entfernen wenn Feld ausgefüllt wird
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    if (!formData.vorname.trim()) {
      newErrors.vorname = 'Vorname ist erforderlich';
    }
    if (!formData.nachname.trim()) {
      newErrors.nachname = 'Nachname ist erforderlich';
    }
    if (!formData.telefon.trim()) {
      newErrors.telefon = 'Telefon ist erforderlich';
    }
    if (!formData.beschreibung.trim()) {
      newErrors.beschreibung = 'Beschreibung ist erforderlich';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSaving(true);

    try {
      if (isEdit && customer) {
        // Kunde aktualisieren
        await customerService.updateCustomer(customer.id, formData);
      } else {
        // Neuen Kunden erstellen
        const workflow = getWorkflowForOrderType(formData.auftragstyp);
        const initialStatus = workflow[0].status;

        // Ersten Workflow-Schritt zur Historie hinzufügen
        const initialWorkflowStep = {
          id: crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
          }),
          status: initialStatus as any,
          erreichtAm: new Date(),
        };

        await customerService.createCustomer({
          ...formData,
          status: initialStatus as any,
          workflowSchritte: [initialWorkflowStep],
          termine: [],
          dokumente: [],
          aktivitaeten: [],
          erinnerungen: [],
          aufgaben: [],
          erstKontakt: new Date(),
          kontaktiert: formData.kontaktiert,
          archiviert: false, // Neue Kunden sind nicht archiviert
        });
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
      alert(`Fehler beim Speichern des Kunden:\n${errorMessage}\n\nBitte überprüfen Sie die Browser-Konsole für mehr Details.`);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Kunde bearbeiten' : 'Neuer Kunde'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6">
          {/* Kontaktdaten */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kontaktdaten</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Firma (optional)
                </label>
                <input
                  type="text"
                  value={formData.firma}
                  onChange={(e) => handleChange('firma', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Firma oder Betrieb"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vorname <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.vorname}
                  onChange={(e) => handleChange('vorname', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.vorname ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Max"
                />
                {errors.vorname && (
                  <p className="mt-1 text-sm text-red-500">{errors.vorname}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nachname <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nachname}
                  onChange={(e) => handleChange('nachname', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.nachname ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Mustermann"
                />
                {errors.nachname && (
                  <p className="mt-1 text-sm text-red-500">{errors.nachname}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.telefon}
                  onChange={(e) => handleChange('telefon', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.telefon ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+43 123 456789"
                />
                {errors.telefon && (
                  <p className="mt-1 text-sm text-red-500">{errors.telefon}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email (optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="max@mustermann.at"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse (optional)
                </label>
                <input
                  type="text"
                  value={formData.adresse}
                  onChange={(e) => handleChange('adresse', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Musterstraße 123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PLZ (optional)
                </label>
                <input
                  type="text"
                  value={formData.plz}
                  onChange={(e) => handleChange('plz', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ort (optional)
                </label>
                <input
                  type="text"
                  value={formData.ort}
                  onChange={(e) => handleChange('ort', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Musterstadt"
                />
              </div>
            </div>
          </div>

          {/* Auftragsinformationen */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Auftragsinformationen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Auftragstyp <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.auftragstyp}
                  onChange={(e) => handleChange('auftragstyp', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isEdit}
                >
                  <option value="tor">Tor</option>
                  <option value="stallbau">Stallbau</option>
                  <option value="produkte">Produkte</option>
                </select>
                {isEdit && (
                  <p className="mt-1 text-xs text-gray-500">
                    Auftragstyp kann nicht geändert werden
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priorität <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.prioritaet}
                  onChange={(e) => handleChange('prioritaet', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="hoch">Hoch</option>
                  <option value="mittel">Mittel</option>
                  <option value="niedrig">Niedrig</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Was braucht der Kunde? <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.beschreibung}
                  onChange={(e) => handleChange('beschreibung', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.beschreibung ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="z.B. Kunde benötigt ein neues Schiebetor, 4m x 3m"
                />
                {errors.beschreibung && (
                  <p className="mt-1 text-sm text-red-500">{errors.beschreibung}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Anforderungen / Details (optional)
                </label>
                <textarea
                  value={formData.anforderungen}
                  onChange={(e) => handleChange('anforderungen', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Spezielle Anforderungen, Wünsche, technische Details..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notizen (optional)
                </label>
                <textarea
                  value={formData.notizen}
                  onChange={(e) => handleChange('notizen', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Interne Notizen..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.kontaktiert}
                    onChange={(e) => handleChange('kontaktiert', e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Bereits kontaktiert
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={20} />
              {isSaving ? 'Wird gespeichert...' : 'Speichern'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
