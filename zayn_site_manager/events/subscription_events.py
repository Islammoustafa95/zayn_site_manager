import frappe
from frappe.utils import add_days, now_datetime

def on_subscription_update(doc, method):
    if doc.has_value_changed('status'):
        handle_status_change(doc)
    
    if doc.has_value_changed('plan_type'):
        update_site_limits(doc)

def handle_status_change(subscription):
    site = frappe.get_doc('ZaynSite', subscription.site)
    
    if subscription.status == 'Past Due':
        notify_payment_overdue(subscription)
        
    elif subscription.status == 'Cancelled':
        schedule_site_suspension(site)
        
    elif subscription.status == 'Active' and site.status == 'Suspended':
        site.status = 'Active'
        site.save()

def update_site_limits(subscription):
    plan_limits = {
        'Basic': 3,
        'Standard': 7,
        'Pro': 21
    }
    
    site = frappe.get_doc('ZaynSite', subscription.site)
    site.max_users = plan_limits.get(subscription.plan_type, 3)
    site.save()

def notify_payment_overdue(subscription):
    frappe.sendmail(
        recipients=[subscription.billing_contact],
        subject=f"Payment Overdue - {subscription.site}",
        template="payment_overdue",
        args={
            "site": subscription.site,
            "days_overdue": frappe.utils.date_diff(
                now_datetime(),
                subscription.last_billing_date
            )
        }
    )

def schedule_site_suspension(site):
    frappe.get_doc({
        'doctype': 'ZaynSiteSuspension',
        'site': site.name,
        'scheduled_date': add_days(now_datetime(), 7),
        'reason': 'Subscription Cancelled',
        'status': 'Scheduled'
    }).insert()