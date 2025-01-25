import frappe
import subprocess
import os
from frappe.utils import now_datetime

def setup_site(site_name, apps):
    try:
        site = frappe.get_doc('ZaynSite', site_name)
        site.status = 'Installing'
        site.save()

        # Create site directory
        create_site(site.subdomain)
        
        # Install base apps
        install_base_apps(site.subdomain)
        
        # Install selected apps
        for app in apps:
            install_app(site.subdomain, app)
            
        # Configure site
        configure_site(site)
        
        site.status = 'Active'
        site.save()
        
        send_setup_completion_email(site)
        
    except Exception as e:
        site.status = 'Failed'
        site.error_log = str(e)
        site.save()
        frappe.log_error(frappe.get_traceback(), f'Site Setup Failed: {site_name}')
        send_setup_failure_email(site)

def create_site(subdomain):
    site_url = f"{subdomain}.zayn.com"
    admin_password = frappe.generate_hash()[:16]
    
    subprocess.run([
        'bench', 'new-site',
        site_url,
        '--admin-password', admin_password,
        '--mariadb-root-password', frappe.conf.get('mariadb_root_password')
    ], check=True)
    
    # Store admin password securely
    frappe.db.set_value('ZaynSite', subdomain, 'admin_password', admin_password)

def install_base_apps(subdomain):
    site_url = f"{subdomain}.zayn.com"
    base_apps = ['erpnext']
    
    for app in base_apps:
        subprocess.run([
            'bench', '--site', site_url,
            'install-app', app
        ], check=True)

def install_app(subdomain, app_name):
    site_url = f"{subdomain}.zayn.com"
    app_mapping = {
        'HR': 'hrms',
        'Property Management': 'property_management',
        'Logistics': 'logistics_management',
        'POS': 'pos_awesome',
        'Ecommerce': 'webshop'
    }
    
    app_technical_name = app_mapping.get(app_name)
    if not app_technical_name:
        raise ValueError(f"Unknown app: {app_name}")
        
    subprocess.run([
        'bench', '--site', site_url,
        'install-app', app_technical_name
    ], check=True)

def configure_site(site):
    site_url = f"{site.subdomain}.zayn.com"
    
    # Set domain
    subprocess.run([
        'bench', '--site', site_url,
        'set-config', 'domain', site_url
    ], check=True)
    
    # Configure email
    subprocess.run([
        'bench', '--site', site_url,
        'set-config', 'mail_server', 'smtp.zayn.com'
    ], check=True)
    
    # Enable scheduler
    subprocess.run([
        'bench', '--site', site_url,
        'enable-scheduler'
    ], check=True)

def send_setup_completion_email(site):
    frappe.sendmail(
        recipients=[site.site_owner],
        subject=f"Your ZaynERP Site is Ready - {site.site_name}",
        template="site_setup_complete",
        args={
            "site_name": site.site_name,
            "site_url": f"https://{site.subdomain}.zayn.com",
            "admin_user": "Administrator",
            "admin_password": site.admin_password
        }
    )

def send_setup_failure_email(site):
    frappe.sendmail(
        recipients=[site.site_owner],
        subject=f"Site Setup Failed - {site.site_name}",
        template="site_setup_failed",
        args={
            "site_name": site.site_name,
            "support_email": "support@zayn.com"
        }
    )