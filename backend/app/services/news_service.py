import os

def fetch_company_news(company_name: str) -> list:
    """
    Stub for NewsAPI. Mocks returning recent news for the dashboard analysis.
    """
    return [
        {
            "id": 1,
            "title": f"Recent developments regarding {company_name}",
            "source": "Financial Times",
            "sentiment": "neutral",
            "date": "2 days ago",
            "summary": f"Market analysts closely monitoring the latest moves by {company_name} following industry trends."
        },
        {
            "id": 2,
            "title": f"{company_name} reports steady cash flow metrics",
            "source": "Business Standard",
            "sentiment": "positive",
            "date": "1 week ago",
            "summary": f"Despite market volatility, {company_name} has managed to maintain a solid cash position."
        }
    ]
