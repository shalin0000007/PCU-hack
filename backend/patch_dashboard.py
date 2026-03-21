import re

with open('../src/app/pages/Dashboard.tsx', 'r') as f:
    content = f.read()

# Replace the beginning of the component
old_comp_start = """export default function Dashboard() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("date");
  const [filterRisk, setFilterRisk] = useState("all");"""

new_comp_start = """export default function Dashboard() {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("date");
  const [filterRisk, setFilterRisk] = useState("all");
  
  const userRole = localStorage.getItem("userRole") || "user";
  const isAdmin = userRole === "admin";
  
  const currentApplications = isAdmin ? applications : [];
  const currentAlerts = isAdmin ? alerts : [];
  const currentRiskDistribution = isAdmin ? riskDistribution : [];
  const currentTrendData = isAdmin ? trendData : [];"""

content = content.replace(old_comp_start, new_comp_start)

# Replace the maps
content = content.replace("{alerts.map(", "{currentAlerts.map(")
content = content.replace("{applications.map(", "{currentApplications.map(")
content = content.replace("data={riskDistribution}", "data={currentRiskDistribution}")
content = content.replace("{riskDistribution.map(", "{currentRiskDistribution.map(")
content = content.replace("data={trendData}", "data={currentTrendData}")

# Update Stats 
content = re.sub(r'Total Applications</p>\s+<p className="text-3xl text-\[#1a1a1a\] dark:text-white">247</p>', r'Total Applications</p>\n                <p className="text-3xl text-[#1a1a1a] dark:text-white">{isAdmin ? "247" : "0"}</p>', content)
content = re.sub(r'High Risk Cases</p>\s+<p className="text-3xl text-\[#1a1a1a\] dark:text-white">43</p>', r'High Risk Cases</p>\n                <p className="text-3xl text-[#1a1a1a] dark:text-white">{isAdmin ? "43" : "0"}</p>', content)
content = re.sub(r'Approved Loans</p>\s+<p className="text-3xl text-\[#1a1a1a\] dark:text-white">189</p>', r'Approved Loans</p>\n                <p className="text-3xl text-[#1a1a1a] dark:text-white">{isAdmin ? "189" : "0"}</p>', content)

# 3 High-Risk Cases Alert text
content = re.sub(r'<h2 className="text-4xl">3 High-Risk Cases</h2>', r'<h2 className="text-4xl">{isAdmin ? "3 High-Risk Cases" : "0 High-Risk Cases"}</h2>', content)

with open('../src/app/pages/Dashboard.tsx', 'w') as f:
    f.write(content)

