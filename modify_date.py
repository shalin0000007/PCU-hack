import subprocess
import datetime
import os

# Get author date of current HEAD
# format: %at gives unix epoch, %an gives author name, %ae gives email, %B gives raw message
try:
    epoch_str = subprocess.check_output(['git', 'show', '-s', '--format=%at', 'HEAD']).decode().strip()
    epoch = int(epoch_str)
    
    # 2026-03-21 00:00:00 UTC is 1774051200 (approx)
    # Mar 20 is Mar 21 - 86400
    # Let's just create a datetime object from timestamp
    dt = datetime.datetime.fromtimestamp(epoch)
    
    # If the date is before Mar 21, 2026, shift it
    target_start = datetime.datetime(2026, 3, 21)
    
    if dt < target_start:
        days_to_add = (target_start.date() - dt.date()).days
        # If it's the 19th, days_to_add = 2
        # If it's the 20th, days_to_add = 1
        dt = dt + datetime.timedelta(days=days_to_add)
        
        # Format the new date
        new_date_str = dt.strftime("%Y-%m-%dT%H:%M:%S")
        
        # Amend the commit
        env = os.environ.copy()
        env['GIT_COMMITTER_DATE'] = new_date_str
        subprocess.check_call(['git', 'commit', '--amend', '--no-edit', '--date', new_date_str], env=env)
        print(f"Shifted commit date to {new_date_str}")
    else:
        # For commits >= Mar 21, just update committer date to match author date to avoid discrepancies
        # or just leave them alone. 
        # Actually, amending resets the committer date to NOW if we don't set it.
        # But wait, if we don't amend, the commit stays as is. 
        # So we just do nothing!
        print(f"Commit already >= Mar 21: {dt}")

except Exception as e:
    print(f"Error: {e}")
