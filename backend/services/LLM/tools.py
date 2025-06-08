def multiplication(a: float, b: float) -> float:
    """
    Performs multiplication on two numbers.
    Args:
        a (float): First number.
        b (float): Second number.
    Returns:
        float: Result of multiplying a and b.
    """
    print(f"Multiplying {a} and {b}")
    return a * b

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
