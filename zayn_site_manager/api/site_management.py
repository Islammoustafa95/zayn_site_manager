import frappe
from frappe import _
from frappe.utils import now_datetime, add_months

@frappe.whitelist()
def create_site(**kwargs):
    try:
        # Validate request
        plan = kwargs.get('plan')
        if not plan or plan not in ['Basic', 'Standard', 'Pro']:
            frappe.throw(_('Invalid plan selected'))

        # Create site record
        site = frappe.get_doc({
            'doctype': 'ZaynSite',
            'site_name': kwargs.get('siteName'),
            'subdomain': kwargs.get('subdomain'),
            'status': 'Draft',
            'creation_date': now_datetime(),
            'site_owner': kwargs.get('email'),
            'technical_contact': kwargs.get('email'),
            'max_users': {
                'Basic': 3,
                'Standard': 7,
                'Pro': 21
            }.get(plan)
        })
        site.insert()

        # Create subscription
        subscription = frappe.get_doc({
            'doctype': 'ZaynSubscription',
            'site': site.name,
            'plan_type': plan,
            'status': 'Trial',
            'start_date': now_datetime(),
            'end_date': add_months(now_datetime(), 1),
            'billing_cycle': 'Monthly',
            'billing_contact': kwargs.get('email')
        })
        subscription.insert()

        # Update site with subscription
        site.subscription = subscription.name
        site.save()

        # Install selected apps
        if kwargs.get('selectedApps'):
            for app in kwargs.get('selectedApps'):
                install_app(site.name, app)

        return {
            'success': True,
            'message': _('Site creation initiated'),
            'site_id': site.name
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _('Site Creation Failed'))
        return {
            'success': False,
            'message': str(e)
        }

def install_app(site_name, app_name):
    try:
        app_installation = frappe.get_doc({
            'doctype': 'ZaynAppInstallation',
            'site': site_name,
            'app_name': app_name,
            'status': 'Pending'
        })
        app_installation.insert()
        
        # Trigger background job for app installation
        frappe.enqueue(
            'zayn_site_manager.api.site_management.install_app_background',
            site_name=site_name,
            app_name=app_name,
            installation_id=app_installation.name
        )
    except Exception as e:
        frappe.log_error(frappe.get_traceback(), f'App Installation Failed: {app_name}')