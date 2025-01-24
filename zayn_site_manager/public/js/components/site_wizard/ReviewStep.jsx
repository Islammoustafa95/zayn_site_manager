import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useSiteWizard } from '../context/SiteWizardContext';

const planDetails = {
  Basic: { price: '99', users: '3' },
  Standard: { price: '199', users: '7' },
  Pro: { price: '399', users: '21' }
};

const ReviewStep = () => {
  const { state } = useSiteWizard();
  const { plan, siteName, subdomain, email, selectedApps } = state;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Review Your Selection</h2>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Selected Plan</h3>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Plan Type</p>
              <p className="font-medium">{plan}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Price</p>
              <p className="font-medium">${planDetails[plan]?.price}/month</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">User Limit</p>
              <p className="font-medium">{planDetails[plan]?.users} users</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium">Site Details</h3>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Site Name</p>
              <p className="font-medium">{siteName}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Site URL</p>
              <p className="font-medium">{subdomain}.zayn.com</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Admin Email</p>
              <p className="font-medium">{email}</p>
            </div>
          </div>
        </div>

        {selectedApps.length > 0 && (
          <div className="px-6 py-4">
            <h3 className="text-lg font-medium">Selected Apps</h3>
            <div className="mt-2 space-y-2">
              {selectedApps.map(app => (
                <div key={app} className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <span>{app}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-blue-50 p-4 rounded-md">
        <h4 className="text-sm font-medium text-blue-800">Next Steps</h4>
        <ul className="mt-2 space-y-2 text-sm text-blue-700">
          <li>• Click Create Site to begin the installation process</li>
          <li>• Admin credentials will be sent to {email}</li>
          <li>• Setup typically takes 5-10 minutes to complete</li>
        </ul>
      </div>
    </div>
  );
};

export default ReviewStep;