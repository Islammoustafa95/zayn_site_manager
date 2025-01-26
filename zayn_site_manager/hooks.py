app_name = "zayn_site_manager"
app_title = "Zayn Site Manager"
app_publisher = "VT"
app_description = "Zayn site manager"
app_email = "moustafa.imym@gmail.com"
app_license = "mit"
version="0.0.1"

# API endpoints
api_version = 1

doctype_list = [
    "ZaynSite",
    "ZaynSiteApp", 
    "ZaynSubscription",
    "ZaynSubscriptionApp",
    "ZaynERPSettings"
]

website_route_rules = [
    {"from_route": "/api/method/zayn_site_manager.api.domain_management.check_subdomain", "to_route": "api/method/zayn_site_manager.api.domain_management.check_subdomain"}
]

# Email Templates
email_templates = {
    "site_setup_complete": "zayn_site_manager/email_templates/site_setup_complete.html",
    "site_setup_failed": "zayn_site_manager/email_templates/site_setup_failed.html",
    "subscription_trial_ending": "zayn_site_manager/email_templates/subscription_trial_ending.html"
}

# DocTypes
doc_events = {
    "ZaynSite": {
        "on_update": "zayn_site_manager.events.site_events.on_site_update",
        "on_trash": "zayn_site_manager.events.site_events.on_site_delete"
    },
    "ZaynSubscription": {
        "on_update": "zayn_site_manager.events.subscription_events.on_subscription_update"
    }
}

# Scheduler Events
scheduler_events = {
    "daily": [
        "zayn_site_manager.tasks.check_trial_expiry",
        "zayn_site_manager.tasks.check_subscription_status"
    ]
}

fixtures = [
    {
        "dt": "Custom Field",
        "filters": [["module", "=", "Zayn Site Manager"]]
    }
]