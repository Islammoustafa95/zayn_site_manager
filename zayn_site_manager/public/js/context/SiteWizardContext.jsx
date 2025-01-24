import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  plan: '',
  siteName: '',
  subdomain: '',
  email: '',
  selectedApps: [],
  loading: false,
  error: null
};

const SiteWizardContext = createContext();

const siteWizardReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_LOADING':
      return { ...state, loading: action.value };
    case 'SET_ERROR':
      return { ...state, error: action.value };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

export const SiteWizardProvider = ({ children }) => {
  const [state, dispatch] = useReducer(siteWizardReducer, initialState);

  const updateField = (field, value) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };

  const setLoading = (value) => {
    dispatch({ type: 'SET_LOADING', value });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', error });
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  return (
    <SiteWizardContext.Provider value={{
      state,
      updateField,
      setLoading,
      setError,
      reset
    }}>
      {children}
    </SiteWizardContext.Provider>
  );
};

export const useSiteWizard = () => {
  const context = useContext(SiteWizardContext);
  if (!context) {
    throw new Error('useSiteWizard must be used within a SiteWizardProvider');
  }
  return context;
};