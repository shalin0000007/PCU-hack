import csv
import random

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
years = [2022, 2023, 2024, 2025, 2026]
timeline = []
for y in years:
    for m in months:
        if y == 2026 and m not in ["Jan", "Feb"]: continue
        timeline.append(f"{m} {y}")

with open("c:/Users/adish/OneDrive/Documents/GitHub/PCU_hack/risky_gst.csv", "w", newline='') as fgst, open("c:/Users/adish/OneDrive/Documents/GitHub/PCU_hack/risky_bank.csv", "w", newline='') as fbank:
    wgst = csv.writer(fgst)
    wbank = csv.writer(fbank)
    
    wgst.writerow(["Month", "Revenue", "Tax Paid"])
    wbank.writerow(["Month", "Credits", "Debits", "Balance"])
    
    base_rev = 8000000
    balance = 2500000
    
    random.seed(42) # Deterministic execution
    
    for idx, t in enumerate(timeline):
        # Revenue crashes over time
        base_rev = base_rev * random.uniform(0.85, 0.98)
        revenue = int(base_rev)
        tax = int(revenue * 0.18)
        wgst.writerow([t, revenue, tax])
        
        # Severe mismatch: Bank credits are 300% to 600% higher than GST revenue to represent risky unaccounted inflows or desperate loans
        credits = int(revenue * random.uniform(3.0, 6.0)) 
        
        # Debits are even higher representing severe cash burn
        debits = int(credits * random.uniform(1.10, 1.40)) 
        balance = balance + credits - debits
        
        # Ensure Balance never mathematically goes below zero to look like a real bank statement (random emergency injections)
        if balance < 0:
             emergency_loan = abs(balance) + random.randint(500000, 2000000)
             credits += emergency_loan
             balance += emergency_loan
             
        wbank.writerow([t, credits, debits, int(balance)])

print("Successfully generated risky_gst.csv and risky_bank.csv")
