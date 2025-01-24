import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  plan: '',
  siteName: '',
  subdomain: '',
  email: '',
  selectedApps: [],
  loading: {
    subdomain: false,
    submission: false
  },
  errors: {},
  globalError: null
};

const SiteWizardContext = createContext();

const siteWizardReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { 
        ...state, 
        [action.field]: action.value,
        errors: { ...state.errors, [action.field]: null }
      };
    case 'SET_LOADING':
      return { 
        ...state, 
        loading: { ...state.loading, [action.key]: action.value }
      };
    case 'SET_ERROR':
      return { 
        ...state, 
        errors: { ...state.errors, [action.field]: action.error }
      };
    case 'SET_GLOBAL_ERROR':
      return { ...state, globalError: action.error };
    case 'CLEAR_ERRORS':
      return { ...state, errors: {}, globalError: null };
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

  const setLoading = (key, value) => {
    dispatch({ type: 'SET_LOADING', key, value });
  };

  const setError = (field, error) => {
    dispatch({ type: 'SET_ERROR', field, error });
  };

  const setGlobalError = (error) => {
    dispatch({ type: 'SET_GLOBAL_ERROR', error });
  };

  const clearErrors = () => {
    dispatch({ type: 'CLEAR_ERRORS' });
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
      setGlobalError,
      clearErrors,
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