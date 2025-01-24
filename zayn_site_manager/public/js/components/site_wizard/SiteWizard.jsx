import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const steps = [
  { id: 'plan', title: 'Select Plan' },
  { id: 'site', title: 'Site Details' },
  { id: 'apps', title: 'Select Apps' },
  { id: 'review', title: 'Review' }
];

const SiteWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    plan: '',
    siteName: '',
    subdomain: '',
    email: '',
    selectedApps: [],
  });
  const [errors, setErrors] = useState({});

  const validateStep = (step) => {
    const newErrors = {};
    switch (step) {
      case 0:
        if (!formData.plan) newErrors.plan = 'Please select a plan';
        break;
      case 1:
        if (!formData.siteName) newErrors.siteName = 'Site name is required';
        if (!formData.subdomain) newErrors.subdomain = 'Subdomain is required';
        if (!formData.email) newErrors.email = 'Email is required';
        break;
      case 2:
        // Apps selection validation if needed
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <PlanSelection formData={formData} setFormData={setFormData} errors={errors} />;
      case 1:
        return <SiteDetails formData={formData} setFormData={setFormData} errors={errors} />;
      case 2:
        return <AppSelection formData={formData} setFormData={setFormData} errors={errors} />;
      case 3:
        return <ReviewStep formData={formData} />;
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
          onClick={handleNext}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          {currentStep === steps.length - 1 ? 'Create Site' : 'Next'}
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default SiteWizard;