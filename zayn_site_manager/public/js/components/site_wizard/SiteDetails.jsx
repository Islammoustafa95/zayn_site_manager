import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { useSiteWizard } from '../context/SiteWizardContext';

const SiteDetails = () => {
  const { state, updateField } = useSiteWizard();
  const { error } = state;
  const [isCheckingSubdomain, setIsCheckingSubdomain] = useState(false);

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    updateField(name, value);
    
    if (name === 'subdomain') {
      setIsCheckingSubdomain(true);
      try {
        const response = await fetch('/api/method/zayn_site_manager.api.domain_management.check_subdomain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subdomain: value })
        });
        const data = await response.json();
        if (!data.message.available) {
          updateField('error', { ...error, subdomain: 'This subdomain is already taken' });
        }
      } catch (err) {
        console.error('Error checking subdomain:', err);
      }
      setIsCheckingSubdomain(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Site Details</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Site Name
          </label>
          <input
            type="text"
            name="siteName"
            value={state.siteName}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
              ${error?.siteName ? 'border-red-500' : ''}`}
            placeholder="My Company ERP"
          />
          {error?.siteName && (
            <p className="mt-1 text-sm text-red-500">{error.siteName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Subdomain
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              name="subdomain"
              value={state.subdomain}
              onChange={handleInputChange}
              className={`block w-full rounded-l-md border-gray-300 focus:border-blue-500 focus:ring-blue-500
                ${error?.subdomain ? 'border-red-500' : ''}`}
              placeholder="mycompany"
            />
            <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
              .zayn.com
            </span>
          </div>
          {isCheckingSubdomain && (
            <p className="mt-1 text-sm text-blue-500">Checking availability...</p>
          )}
          {error?.subdomain && (
            <p className="mt-1 text-sm text-red-500">{error.subdomain}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={state.email}
            onChange={handleInputChange}
            className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
              ${error?.email ? 'border-red-500' : ''}`}
            placeholder="admin@mycompany.com"
          />
          {error?.email && (
            <p className="mt-1 text-sm text-red-500">{error.email}</p>
          )}
        </div>
      </div>

      <div className="mt-6 bg-blue-50 p-4 rounded-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Important Information
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li>Your site will be accessible at subdomain.zayn.com</li>
                <li>Admin credentials will be sent to the provided email</li>
                <li>Setup typically takes 5-10 minutes to complete</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiteDetails;