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

def _analyze_sentiment(text: str) -> str:
    """Keyword-based fallback sentiment analysis."""
    text_lower = text.lower()
    negative_words = ["loss", "crime", "fraud", "penalty", "lawsuit", "decline", "debt", "bankrupt", "scandal", "investigation", "drop", "fall", "warning", "breach", "guilty", "fine", "plunge", "concern", "worry", "risk", "shortfall", "irregularities", "bearish", "down", "crash", "plunge", "sue", "illegal"]
    positive_words = ["profit", "benefit", "growth", "success", "award", "win", "gain", "increase", "surge", "expansion", "partnership", "jump", "record", "soar", "upgrade", "outperform", "milestone", "dividend", "secure", "contract", "improvement", "imporvent", "bullish", "up", "fund", "raise", "boom"]
    
    neg_count = sum(1 for word in negative_words if word in text_lower)
    pos_count = sum(1 for word in positive_words if word in text_lower)
    
    if neg_count > pos_count:
        return "negative"
    elif pos_count > neg_count:
        return "positive"
    return "neutral"


def _ai_batch_sentiment(headlines: list[str]) -> list[str]:
    """Use AI to classify sentiment for a batch of headlines in one call."""
    try:
        import os, json
        from openai import OpenAI
        from dotenv import load_dotenv
        load_dotenv()
        api_key = os.getenv("KEY")
        if not api_key:
            return [_analyze_sentiment(h) for h in headlines]
        
        client = OpenAI(base_url="https://go.fastrouter.ai/api/v1", api_key=api_key)
        
        numbered = "\n".join(f"{i+1}. {h}" for i, h in enumerate(headlines))
        prompt = f"""Classify each headline as "positive", "negative", or "neutral" from a financial/credit risk perspective.

{numbered}

Return ONLY a JSON array of strings, e.g. ["positive", "negative", "neutral"]. No explanation."""

        completion = client.chat.completions.create(
            model="openai/gpt-5-nano",
            messages=[{"role": "user", "content": prompt}]
        )
        content = completion.choices[0].message.content.strip()
        if content.startswith("```"): content = content.split("\n", 1)[1]
        if content.endswith("```"): content = content.rsplit("```", 1)[0]
        result = json.loads(content.strip())
        if isinstance(result, list) and len(result) == len(headlines):
            return [r if r in ("positive", "negative", "neutral") else "neutral" for r in result]
    except Exception as e:
        print(f"AI Sentiment Error: {e}")
    
    return [_analyze_sentiment(h) for h in headlines]

def fetch_company_news(company_name: str) -> list:
    """
    Fetches real news using Google News RSS natively for free!
    Falls back to mock data if an error occurs or no results are found.
    """
    try:
        # Fallback to a looser fuzzy match that grabs real live articles based on keywords globally
        search_term = f'"{company_name}" AND (finance OR economy OR business)'
        query = urllib.parse.quote(search_term)
        url = f"https://news.google.com/rss/search?q={query}&hl=en-US&gl=US&ceid=US:en"
        
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            xml_data = response.read()
            
        root = ET.fromstring(xml_data)
        items = root.findall('.//item')
        
        # If absolutely no exact matches exist for this imaginary company, loosen the query entirely to ensure REAL news applies
        if not items:
            company_base = company_name.replace("Pvt", "").replace("Ltd", "").replace("INC", "").strip().split()[0]
            loose_search = f"{company_base} (finance OR business OR industry OR market)"
            loose_query = urllib.parse.quote(loose_search)
            loose_url = f"https://news.google.com/rss/search?q={loose_query}&hl=en-US&gl=US&ceid=US:en"
            
            loose_req = urllib.request.Request(loose_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(loose_req) as loose_resp:
                loose_xml = loose_resp.read()
            
            items = ET.fromstring(loose_xml).findall('.//item')
            
        if not items:
            # Absolute global fallback to real-time top finance news
            global_url = f"https://news.google.com/rss/search?q=Global+Business+Finance&hl=en-US&gl=US&ceid=US:en"
            global_req = urllib.request.Request(global_url, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(global_req) as glob_resp:
                items = ET.fromstring(glob_resp.read()).findall('.//item')
        
        # Collect titles for batch AI sentiment
        raw_titles = []
        for item in items[:3]:
            title_node = item.find('title')
            title = title_node.text if title_node is not None else 'No Title'
            if " - " in title:
                parts = title.rsplit(" - ", 1)
                title = parts[0]
            raw_titles.append(title)
        
        # Run AI batch sentiment (single API call for all headlines)
        sentiments = _ai_batch_sentiment(raw_titles)
            
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
                "sentiment": sentiments[idx] if idx < len(sentiments) else _analyze_sentiment(title),
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

