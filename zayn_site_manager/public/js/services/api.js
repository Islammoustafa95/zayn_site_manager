// services/api.js
const API_ENDPOINTS = {
    CHECK_SUBDOMAIN: '/api/method/zayn_site_manager.api.domain_management.check_subdomain',
    CREATE_SITE: '/api/method/zayn_site_manager.api.site_management.create_site'
  };
  
  export const checkSubdomain = async (subdomain) => {
    try {
      const response = await fetch(API_ENDPOINTS.CHECK_SUBDOMAIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subdomain })
      });
      return await response.json();
    } catch (error) {
      throw new Error('Failed to check subdomain availability');
    }
  };
  
  export const createSite = async (siteData) => {
    try {
      const response = await fetch(API_ENDPOINTS.CREATE_SITE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(siteData)
      });
      return await response.json();
    } catch (error) {
      throw new Error('Failed to create site');
    }
  };