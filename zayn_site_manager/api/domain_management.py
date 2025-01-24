import frappe
from frappe import _
import re

def validate_subdomain_format(subdomain):
    """Validate subdomain format and restrictions"""
    if not subdomain:
        return False, "Subdomain cannot be empty"
        
    if not re.match(r'^[a-z0-9][a-z0-9-]{1,61}[a-z0-9]$', subdomain):
        return False, "Subdomain can only contain lowercase letters, numbers, and hyphens"
        
    # Check length restrictions
    if len(subdomain) < 3:
        return False, "Subdomain must be at least 3 characters long"
    if len(subdomain) > 63:
        return False, "Subdomain cannot exceed 63 characters"
        
    # Check reserved words
    reserved_words = ['www', 'mail', 'ftp', 'admin', 'test']
    if subdomain in reserved_words:
        return False, f"'{subdomain}' is a reserved subdomain"
        
    return True, None

@frappe.whitelist(allow_guest=True)
def check_subdomain():
    try:
        subdomain = frappe.form_dict.get('subdomain', '').lower().strip()
        
        # Validate format
        is_valid, error_message = validate_subdomain_format(subdomain)
        if not is_valid:
            return {
                'available': False,
                'message': error_message
            }
            
        # Check if subdomain exists in ZaynSite
        exists = frappe.db.exists('ZaynSite', {'subdomain': subdomain})
        
        # Check if subdomain exists in pending requests
        pending = frappe.db.exists('ZaynSiteRequest', {
            'subdomain': subdomain,
            'status': ['in', ['Draft', 'Pending']]
        })
        
        if exists or pending:
            return {
                'available': False,
                'message': _('This subdomain is already taken')
            }
            
        return {
            'available': True,
            'message': _('Subdomain is available')
        }
        
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), 'Subdomain Check Error')
        return {
            'available': False,
            'message': _('Error checking subdomain availability')
        }