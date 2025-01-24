import frappe
from frappe import _
import subprocess
import os

def install_app_background(site_name, app_name, installation_id):
    try:
        installation = frappe.get_doc('ZaynAppInstallation', installation_id)
        installation.status = 'In Progress'
        installation.save()

        # Get site details
        site = frappe.get_doc('ZaynSite', site_name)
        
        # Execute app installation
        result = install_app_on_site(site.subdomain, app_name)
        
        if result['success']:
            installation.status = 'Completed'
            installation.save()
        else:
            installation.status = 'Failed'
            installation.error_log = result['error']
            installation.save()
            
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), f'Background App Installation Failed: {app_name}')
        if installation:
            installation.status = 'Failed'
            installation.error_log = str(e)
            installation.save()

def install_app_on_site(subdomain, app_name):
    try:
        # Implementation depends on your deployment setup
        # This is a placeholder for the actual installation logic
        subprocess.run([
            'bench', 
            '--site', f'{subdomain}.zayn.com',
            'install-app',
            app_name
        ], check=True)
        
        return {
            'success': True
        }
        
    except subprocess.CalledProcessError as e:
        return {
            'success': False,
            'error': str(e)
        }