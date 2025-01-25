@frappe.whitelist(allow_guest=True)
def check_subdomain(subdomain=None):
    try:
        if not subdomain:
            subdomain = frappe.form_dict.get('subdomain', '').lower().strip()
            
        # Validate format
        is_valid, error_message = validate_subdomain_format(subdomain)
        if not is_valid:
            return {
                'available': False,
                'message': error_message
            }
            
        # Check if subdomain exists
        exists = frappe.db.exists('ZaynSite', {'subdomain': subdomain})
        
        return {
            'available': not exists,
            'message': _('Subdomain is available') if not exists else _('Subdomain is already taken')
        }
        
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), 'Subdomain Check Error')
        return {
            'available': False,
            'message': _('Error checking subdomain availability')
        }