with open("../src/app/pages/Dashboard.tsx", "r") as f:
    lines = f.readlines()

new_lines = lines[:137] + lines[145:]

with open("../src/app/pages/Dashboard.tsx", "w") as f:
    f.write("".join(new_lines))
