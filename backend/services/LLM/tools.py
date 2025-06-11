import requests

def get_weather(city: str, api_key: str="14cbb208f9ee459893063333250806") -> dict:
    """
    Fetches weather data for a given city using WeatherAPI.com.

    Args:
        city (str): Name of the city.
        api_key (str): Your WeatherAPI key.

    Returns:
        dict: Weather data for the city.
    """
    base_url = "http://api.weatherapi.com/v1/current.json"
    params = {
        "key": api_key,
        "q": city,
        "aqi": "no"  # Set to "yes" if you want air quality data
    }
    response = requests.get(base_url, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}, {response.text}")
        return {}

def web_search(query: str, api_key: str = "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") -> dict:
    """
    Performs a web search using Tavily API.

    Args:
        query (str): The search query.
        api_key (str): Your Tavily API key.

    Returns:
        dict: JSON response with search results (snippets, URLs, etc.).
    """
    url = "https://api.tavily.com/search"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "query": query,
        "search_depth": "advanced",
        "include_answers": True,
        "include_domains": [],
        "max_results": 5
    }

    response = requests.post(url, headers=headers, json=payload)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}, {response.text}")
        return {}