import frappe
from frappe.utils import now_datetime

def on_site_update(doc, method):
    if doc.is_new():
        return

    if doc.has_value_changed('status'):
        if doc.status == 'Suspended':
            disable_site(doc)
        elif doc.status == 'Active':
            enable_site(doc)

def on_site_delete(doc, method):
    # Log deletion
    frappe.log_error(
        f"Site deletion initiated for {doc.subdomain}",
        "Site Deletion"
    )
    
    # Archive site data
    archive_site_data(doc)

def disable_site(site):
    site_url = f"{site.subdomain}.zayn.com"
    try:
        frappe.enqueue(
            'bench.utils.system.disable_site',
            site=site_url
        )
    except Exception as e:
        frappe.log_error(str(e), f"Failed to disable site {site_url}")

def enable_site(site):
    site_url = f"{site.subdomain}.zayn.com"
    try:
        frappe.enqueue(
            'bench.utils.system.enable_site',
            site=site_url
        )
    except Exception as e:
        frappe.log_error(str(e), f"Failed to enable site {site_url}")

def archive_site_data(site):
    """Archive site data before deletion"""
    frappe.get_doc({
        'doctype': 'ZaynSiteArchive',
        'site_name': site.site_name,
        'subdomain': site.subdomain,
        'owner_email': site.site_owner,
        'creation_date': site.creation_date,
        'deletion_date': now_datetime(),
        'subscription_history': get_subscription_history(site)
    }).insert()