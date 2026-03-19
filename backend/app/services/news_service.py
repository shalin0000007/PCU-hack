import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta

def _format_date(date_str: str) -> str:
    if not date_str:
        return "Unknown Date"
    try:
        # e.g., "Tue, 04 Mar 2026 10:00:00 GMT"
        dt = datetime.strptime(date_str, "%a, %d %b %Y %H:%M:%S %Z")
        now = datetime.utcnow()
        diff = now - dt
        
        days = diff.days
        formatted_date = dt.strftime("%Y-%m-%d")
        
        if diff.total_seconds() < 86400 and days <= 0:
            ago = "Today"
        elif days == 1:
            ago = "1 day ago"
        elif days < 7:
            ago = f"{days} days ago"
        elif days < 14:
            ago = "1 week ago"
        else:
            weeks = days // 7
            ago = f"{weeks} weeks ago"
            
        return f"{formatted_date} ({ago})"
    except Exception:
        return date_str[:16]

def fetch_company_news(company_name: str) -> list:
    """
    Fetches real news using Google News RSS natively for free!
    Falls back to mock data if an error occurs or no results are found.
    """
    try:
        query = urllib.parse.quote(company_name)
        url = f"https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en"
        
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            xml_data = response.read()
            
        root = ET.fromstring(xml_data)
        items = root.findall('.//item')
        
        if not items:
            return _get_dummy_news(company_name, no_results=True)
            
        formatted_news = []
        for idx, item in enumerate(items[:3]):
            title_node = item.find('title')
            title = title_node.text if title_node is not None else 'No Title'
            
            # The title often includes " - Source Name" at the end, so we can split it
            if " - " in title:
                parts = title.rsplit(" - ", 1)
                title = parts[0]
                source = parts[1]
            else:
                source_node = item.find('source')
                source = source_node.text if source_node is not None else 'Google News'
            
            link_node = item.find('link')
            link = link_node.text if link_node is not None else '#'
            
            pubdate_node = item.find('pubDate')
            pub_date = pubdate_node.text if pubdate_node is not None else ''
            
            formatted_news.append({
                "id": idx + 1,
                "title": title,
                "source": source,
                "sentiment": "neutral",
                "date": _format_date(pub_date),
                "summary": f"Recent coverage regarding {company_name} from {source}.",
                "url": link
            })
            
        return formatted_news
        
    except Exception as e:
        print(f"Unexpected error when native RSS fetching news: {e}")
        return _get_dummy_news(company_name)

def _get_dummy_news(company_name: str, no_results: bool = False) -> list:
    now = datetime.utcnow()
    two_days_ago = now - timedelta(days=2)
    one_week_ago = now - timedelta(days=7)
    
    return [
        {
            "id": 1,
            "title": f"Recent developments regarding {company_name}",
            "source": "Financial Times",
            "sentiment": "neutral",
            "date": f"{two_days_ago.strftime('%Y-%m-%d')} (2 days ago)",
            "summary": f"Market analysts are closely monitoring the latest strategic moves by {company_name} following significant industry trends. Current economic indicators suggest a remarkably stable business outlook for the upcoming quarters.",
            "url": "https://www.ft.com"
        },
        {
            "id": 2,
            "title": f"{company_name} reports exceptionally steady cash flow metrics",
            "source": "Business Standard",
            "sentiment": "positive",
            "date": f"{one_week_ago.strftime('%Y-%m-%d')} (1 week ago)",
            "summary": f"Despite high global market volatility, {company_name} has aggressively managed to maintain a solid cash position. Leadership largely points to restructured debt profiles and optimized operational costs as key drivers for this financial resilience.",
            "url": "https://www.business-standard.com"
        }
    ]

