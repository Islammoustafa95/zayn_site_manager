import React from 'react';
import { SiteWizardProvider } from './context/SiteWizardContext';
import SiteWizard from './components/site_wizard/SiteWizard';

const App = () => {
  return (
    <SiteWizardProvider>
      <div className="min-h-screen bg-gray-50">
        <SiteWizard />
      </div>
    </SiteWizardProvider>
  );
};

export default App;