import { useState } from 'react';
import type { Customer } from './types';
import { Dashboard } from './components/Dashboard';
import { CustomerForm } from './components/CustomerForm';
import { CustomerDetail } from './components/CustomerDetail';

type View = 'dashboard' | 'detail' | 'form';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | undefined>(undefined);
  const [dashboardKey, setDashboardKey] = useState(0);

  function handleSelectCustomer(customer: Customer) {
    setSelectedCustomer(customer);
    setCurrentView('detail');
  }

  function handleCreateCustomer() {
    setEditingCustomer(undefined);
    setCurrentView('form');
  }

  function handleEditCustomer(customer: Customer) {
    setEditingCustomer(customer);
    setCurrentView('form');
  }

  function handleCloseForm() {
    setEditingCustomer(undefined);
    setCurrentView('dashboard');
  }

  function handleSaveForm() {
    setEditingCustomer(undefined);
    if (selectedCustomer) {
      setCurrentView('detail');
    } else {
      setCurrentView('dashboard');
    }
  }

  function handleBackToDashboard() {
    setSelectedCustomer(null);
    setCurrentView('dashboard');
    // Dashboard neu laden
    setDashboardKey(prev => prev + 1);
  }

  return (
    <>
      {currentView === 'dashboard' && (
        <Dashboard
          key={dashboardKey}
          onSelectCustomer={handleSelectCustomer}
          onCreateCustomer={handleCreateCustomer}
        />
      )}

      {currentView === 'detail' && selectedCustomer && (
        <CustomerDetail
          customerId={selectedCustomer.id}
          onBack={handleBackToDashboard}
          onEdit={handleEditCustomer}
        />
      )}

      {currentView === 'form' && (
        <CustomerForm
          customer={editingCustomer}
          onClose={handleCloseForm}
          onSave={handleSaveForm}
        />
      )}
    </>
  );
}

export default App;
