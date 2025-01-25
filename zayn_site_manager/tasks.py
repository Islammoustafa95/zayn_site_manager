import frappe
from frappe.utils import add_days, getdate, now_datetime

def check_trial_expiry():
    """Daily job to check trial expiry"""
    trial_subs = frappe.get_all(
        'ZaynSubscription',
        filters={
            'status': 'Trial',
            'end_date': ['<=', add_days(getdate(), 7)]
        },
        fields=['name', 'site', 'end_date', 'billing_contact']
    )
    
    for sub in trial_subs:
        days_remaining = frappe.utils.date_diff(
            sub.end_date,
            getdate()
        )
        
        if days_remaining <= 0:
            end_trial(sub.name)
        else:
            notify_trial_ending(sub, days_remaining)

def check_subscription_status():
    """Daily job to check subscription status"""
    overdue_subs = frappe.get_all(
        'ZaynSubscription',
        filters={
            'status': 'Active',
            'next_billing_date': ['<', getdate()]
        }
    )
    
    for sub in overdue_subs:
        mark_subscription_overdue(sub.name)

def end_trial(subscription_name):
    subscription = frappe.get_doc('ZaynSubscription', subscription_name)
    subscription.status = 'Past Due'
    subscription.save()
    
    site = frappe.get_doc('ZaynSite', subscription.site)
    site.status = 'Suspended'
    site.save()

def notify_trial_ending(subscription, days_remaining):
    frappe.sendmail(
        recipients=[subscription.billing_contact],
        template='subscription_trial_ending',
        args={
            'site_name': subscription.site,
            'days_remaining': days_remaining,
            'plan_type': subscription.plan_type,
            'plan_price': get_plan_price(subscription.plan_type),
            'billing_url': f'https://{subscription.site}/billing'
        }
    )

def mark_subscription_overdue(subscription_name):
    subscription = frappe.get_doc('ZaynSubscription', subscription_name)
    subscription.status = 'Past Due'
    subscription.save()
    
    frappe.sendmail(
        recipients=[subscription.billing_contact],
        template='payment_overdue',
        args={
            'site_name': subscription.site,
            'days_overdue': frappe.utils.date_diff(
                getdate(),
                subscription.next_billing_date
            )
        }
    )

def get_plan_price(plan_type):
    return {
        'Basic': 99,
        'Standard': 199,
        'Pro': 399
    }.get(plan_type, 0)