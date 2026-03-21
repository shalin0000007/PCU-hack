import csv
import random

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
year = 2022
month_idx = 0  # Jan

gst_rows = [["Month", "Revenue", "Tax Paid"]]
bank_rows = [["Month", "Credits", "Debits", "Balance"]]

base_revenue = 4500000  # 45 Lakhs to start
balance = 1200000

for i in range(50):
    month_str = f"{months[month_idx]} {year}"
    
    # Growth trend (~1.5% per month)
    trend = 1.0 + (i * 0.015) 
    
    # Seasonal bump during Q4
    seasonality = 1.25 if month_idx in [9, 10, 11] else 1.0 
    noise = random.uniform(0.9, 1.1)
    
    revenue = int(base_revenue * trend * seasonality * noise)
    tax_paid = int(revenue * 0.18)
    
    # Add varying discrepancies to mimic outstanding receivables and payment timing
    credits_val = int(revenue * random.uniform(0.92, 1.08))
    debits_val = int(credits_val * random.uniform(0.85, 1.02))
    
    balance = balance + credits_val - debits_val
    
    gst_rows.append([month_str, revenue, tax_paid])
    bank_rows.append([month_str, credits_val, debits_val, balance])
    
    month_idx += 1
    if month_idx > 11:
        month_idx = 0
        year += 1

with open("dummy_gst.csv", "w", newline="") as f:
    csv.writer(f).writerows(gst_rows)

with open("dummy_bank.csv", "w", newline="") as f:
    csv.writer(f).writerows(bank_rows)

print("Generated high-depth mock data files successfully.")
