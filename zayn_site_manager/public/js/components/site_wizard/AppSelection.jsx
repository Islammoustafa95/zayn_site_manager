import React from 'react';
import { Check, Info } from 'lucide-react';

const availableApps = {
  Basic: [],
  Standard: ['HR', 'Property Management', 'Logistics', 'POS', 'Ecommerce'],
  Pro: ['HR', 'Property Management', 'Logistics', 'POS', 'Ecommerce', 'Advanced Analytics', 'Custom Reports']
};

const appDetails = {
  'HR': {
    description: 'Complete human resource management system',
    features: ['Employee Management', 'Payroll', 'Attendance', 'Leave Management']
  },
  'Property Management': {
    description: 'Real estate and property management solution',
    features: ['Property Listings', 'Tenant Management', 'Maintenance Tracking']
  },
  'Logistics': {
    description: 'End-to-end logistics and supply chain management',
    features: ['Fleet Management', 'Route Optimization', 'Shipment Tracking']
  },
  'POS': {
    description: 'Point of Sale system with inventory management',
    features: ['Sales Processing', 'Inventory Control', 'Customer Management']
  },
  'Ecommerce': {
    description: 'Online store and ecommerce integration',
    features: ['Product Catalog', 'Order Management', 'Payment Integration']
  }
};

const AppSelection = ({ formData, setFormData, errors }) => {
  const availableAppsList = availableApps[formData.plan] || [];

  const handleAppToggle = (appName) => {
    setFormData(prev => {
      const selected = new Set(prev.selectedApps);
      if (selected.has(appName)) {
        selected.delete(appName);
      } else {
        selected.add(appName);
      }
      return { ...prev, selectedApps: Array.from(selected) };
    });
  };

  if (!formData.plan) {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900">
          Please select a plan first to view available apps
        </h3>
      </div>
    );
  }

  if (formData.plan === 'Basic') {
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900">
          Basic plan does not include additional apps
        </h3>
        <p className="mt-2 text-gray-600">
          Upgrade to Standard or Pro plan to access additional apps
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Select Additional Apps</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {availableAppsList.map((appName) => (
          <div
            key={appName}
            className={`rounded-lg border-2 p-6 cursor-pointer transition-all
              ${
                formData.selectedApps.includes(appName)
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            onClick={() => handleAppToggle(appName)}
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900">{appName}</h3>
              {formData.selectedApps.includes(appName) && (
                <Check className="w-5 h-5 text-blue-600" />
              )}
            </div>
            
            <p className="mt-2 text-sm text-gray-600">
              {appDetails[appName]?.description}
            </p>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900">Key Features:</h4>
              <ul className="mt-2 space-y-2">
                {appDetails[appName]?.features.map((feature) => (
                  <li key={feature} className="text-sm text-gray-600 flex items-center">
                    <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-yellow-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <Info className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Please Note
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Selected apps will be installed during site setup</li>
                <li>Additional apps can be installed later from the admin panel</li>
                <li>Each app may require additional configuration after installation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSelection;