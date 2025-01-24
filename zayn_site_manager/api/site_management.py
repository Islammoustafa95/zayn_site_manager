import frappe
from frappe import _
from frappe.utils import now_datetime, add_months
from zayn_site_manager.api.domain_management import validate_subdomain_format

PLAN_DETAILS = {
    'Basic': {'max_users': 3, 'apps': []},
    'Standard': {'max_users': 7, 'apps': ['HR', 'Property Management', 'Logistics', 'POS', 'Ecommerce']},
    'Pro': {'max_users': 21, 'apps': ['HR', 'Property Management', 'Logistics', 'POS', 'Ecommerce', 'Advanced Analytics']}
}

def validate_plan_and_apps(plan, selected_apps):
    if plan not in PLAN_DETAILS:
        frappe.throw(_('Invalid plan selected'))
        
    allowed_apps = PLAN_DETAILS[plan]['apps']
    if plan != 'Basic' and not selected_apps:
        frappe.throw(_('Please select at least one app'))
        
    invalid_apps = [app for app in selected_apps if app not in allowed_apps]
    if invalid_apps:
        frappe.throw(_('Invalid apps selected for the chosen plan: {}').format(', '.join(invalid_apps)))

@frappe.whitelist()
def create_site():
    try:
        # Get and validate form data
        data = frappe.form_dict
        plan = data.get('plan')
        subdomain = data.get('subdomain', '').lower().strip()
        site_name = data.get('siteName')
        email = data.get('email')
        selected_apps = data.get('selectedApps', [])

        # Validations
        if not all([plan, subdomain, site_name, email]):
            frappe.throw(_('All fields are required'))

        # Validate subdomain
        is_valid, error_message = validate_subdomain_format(subdomain)
        if not is_valid:
            frappe.throw(error_message)

        # Validate plan and apps
        validate_plan_and_apps(plan, selected_apps)

        # Create site record
        site = frappe.get_doc({
            'doctype': 'ZaynSite',
            'site_name': site_name,
            'subdomain': subdomain,
            'status': 'Pending',
            'creation_date': now_datetime(),
            'site_owner': email,
            'technical_contact': email,
            'max_users': PLAN_DETAILS[plan]['max_users']
        }).insert()

        # Create subscription
        subscription = frappe.get_doc({
            'doctype': 'ZaynSubscription',
            'site': site.name,
            'plan_type': plan,
            'status': 'Trial',
            'start_date': now_datetime(),
            'end_date': add_months(now_datetime(), 1),
            'billing_cycle': 'Monthly',
            'billing_contact': email
        }).insert()

        # Update site with subscription
        site.subscription = subscription.name
        site.save()

        # Queue app installation
        if selected_apps:
            frappe.enqueue(
                'zayn_site_manager.api.background_jobs.setup_site',
                site_name=site.name,
                apps=selected_apps,
                queue='long',
                timeout=1500
            )

        return {
            'success': True,
            'message': _('Site creation initiated successfully'),
            'site_id': site.name
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), 'Site Creation Error')
        return {
            'success': False,
            'message': str(e)
        }