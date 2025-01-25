import frappe
import requests
from frappe import _

class CloudflareAPI:
    def __init__(self):
        self.api_token = frappe.get_single("ZaynERP Settings").get_password("cloudflare_api_token")
        self.zone_id = frappe.get_single("ZaynERP Settings").cloudflare_zone_id
        self.base_url = "https://api.cloudflare.com/client/v4"
        self.headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json"
        }

    def create_dns_record(self, subdomain):
        """Create A record for subdomain pointing to server IP"""
        try:
            url = f"{self.base_url}/zones/{self.zone_id}/dns_records"
            data = {
                "type": "A",
                "name": f"{subdomain}.zaynerp.com",
                "content": "95.216.242.172",
                "ttl": 1,  # Auto
                "proxied": True
            }
            
            response = requests.post(url, headers=self.headers, json=data)
            response.raise_for_status()
            
            return {
                "success": True,
                "record_id": response.json()["result"]["id"]
            }
            
        except requests.exceptions.RequestException as e:
            frappe.log_error(f"Cloudflare API Error: {str(e)}", "DNS Record Creation Failed")
            return {
                "success": False,
                "error": str(e)
            }

    def delete_dns_record(self, record_id):
        """Delete DNS record when site is deleted"""
        try:
            url = f"{self.base_url}/zones/{self.zone_id}/dns_records/{record_id}"
            response = requests.delete(url, headers=self.headers)
            response.raise_for_status()
            return {"success": True}
            
        except requests.exceptions.RequestException as e:
            frappe.log_error(f"Cloudflare API Error: {str(e)}", "DNS Record Deletion Failed")
            return {
                "success": False,
                "error": str(e)
            }

def setup_site_dns(subdomain):
    """Create DNS record for new site"""
    cf = CloudflareAPI()
    result = cf.create_dns_record(subdomain)
    
    if result["success"]:
        # Store record_id in site document for future reference
        frappe.db.set_value("ZaynSite", subdomain, "dns_record_id", result["record_id"])
    else:
        frappe.throw(_("Failed to create DNS record"))