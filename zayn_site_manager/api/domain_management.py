import frappe
from frappe import _
import re

@frappe.whitelist()
def check_subdomain(**kwargs):
    subdomain = kwargs.get('subdomain')
    if not subdomain:
        return {'available': False, 'message': _('Subdomain is required')}
    
    # Validate subdomain format
    if not re.match(r'^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$', subdomain):
        return {
            'available': False,
            'message': _('Invalid subdomain format. Use only lowercase letters, numbers, and hyphens')
        }
    
    # Check if subdomain exists
    exists = frappe.db.exists('ZaynSite', {'subdomain': subdomain})
    
    return {
        'available': not exists,
        'message': _('Subdomain is available') if not exists else _('Subdomain is already taken')
    }