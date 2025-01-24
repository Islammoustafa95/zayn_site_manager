import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useSiteWizard } from '../context/SiteWizardContext';
import { createSite } from '../services/api';
import PlanSelection from './PlanSelection';
import SiteDetails from './SiteDetails';
import AppSelection from './AppSelection';
import ReviewStep from './ReviewStep';

const steps = [
  { id: 'plan', title: 'Select Plan' },
  { id: 'site', title: 'Site Details' },
  { id: 'apps', title: 'Select Apps' },
  { id: 'review', title: 'Review' }
];

const SiteWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { state, setLoading, setError } = useSiteWizard();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateStep = (step) => {
    const errors = {};
    switch (step) {
      case 0:
        if (!state.plan) errors.plan = 'Please select a plan';
        break;
      case 1:
        if (!state.siteName) errors.siteName = 'Site name is required';
        if (!state.subdomain) errors.subdomain = 'Subdomain is required';
        if (!state.email) errors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
          errors.email = 'Invalid email format';
        }
        break;
      case 2:
        if (state.plan !== 'Basic' && state.selectedApps.length === 0) {
          errors.apps = 'Please select at least one app';
        }
        break;
    }
    setError(Object.keys(errors).length > 0 ? errors : null);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await createSite(state);
      
      if (response.success) {
        // Show success message and redirect to status page
        frappe.show_alert({
          message: __('Site creation initiated successfully!'),
          indicator: 'green'
        });
        window.location.href = `/app/zaynsite/${response.site_id}`;
      } else {
        setError({ submit: response.message });
      }
    } catch (error) {
      setError({ submit: 'Failed to create site. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <PlanSelection />;
      case 1:
        return <SiteDetails />;
      case 2:
        return <AppSelection />;
      case 3:
        return <ReviewStep />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <nav className="flex justify-between">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`flex items-center ${
                index <= currentStep ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 
                ${index <= currentStep ? 'border-blue-600' : 'border-gray-400'}`}
              >
                {index < currentStep ? '✓' : index + 1}
              </div>
              <span className="ml-2">{step.title}</span>
              {index < steps.length - 1 && (
                <div className="w-12 h-1 mx-2 bg-gray-200"></div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {renderStepContent()}
      </div>

      {state.error?.submit && (
        <div className="text-red-500 text-sm mb-4">{state.error.submit}</div>
      )}

      <div className="flex justify-between mt-6">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className={`flex items-center px-4 py-2 rounded ${
            currentStep === 0
              ? 'bg-gray-200 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </button>
        <button
          onClick={currentStep === steps.length - 1 ? handleSubmit : handleNext}
          disabled={isSubmitting}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Processing...' : currentStep === steps.length - 1 ? 'Create Site' : 'Next'}
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default SiteWizard;