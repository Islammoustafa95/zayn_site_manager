import React from 'react';
import { Check } from 'lucide-react';
import { useSiteWizard } from '../context/SiteWizardContext';

const plans = [
  {
    name: 'Basic',
    price: '99',
    features: [
      'ZaynERP core functionality',
      '3 users limit',
      'Basic support',
      'Standard hosting'
    ]
  },
  {
    name: 'Standard',
    price: '199',
    features: [
      'ZaynERP core functionality',
      '7 users limit',
      'Select custom apps',
      'Priority support',
      'Enhanced hosting'
    ]
  },
  {
    name: 'Pro',
    price: '399',
    features: [
      'ZaynERP core functionality',
      '21 users limit',
      'All custom apps',
      'Live support',
      'Premium hosting',
      'Customization services'
    ]
  }
];

const PlanSelection = () => {
  const { state, updateField } = useSiteWizard();
  const { error } = state;

  const handlePlanSelect = (planName) => {
    updateField('plan', planName);
    // Reset selected apps when changing plans
    updateField('selectedApps', []);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Choose your plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-lg border-2 p-6 cursor-pointer transition-all
              ${
                state.plan === plan.name
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            onClick={() => handlePlanSelect(plan.name)}
          >
            <div className="text-center mb-4">
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-gray-500">/month</span>
              </div>
            </div>

            <div className="space-y-3">
              {plan.features.map((feature) => (
                <div key={feature} className="flex items-center">
                  <Check className="w-5 h-5 text-green-500 mr-2" />
                  <span className="text-gray-600">{feature}</span>
                </div>
              ))}
            </div>

            {state.plan === plan.name && (
              <div className="mt-4 text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  Selected
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      {error?.plan && (
        <div className="text-red-500 text-sm mt-2">{error.plan}</div>
      )}
    </div>
  );
};

export default PlanSelection;