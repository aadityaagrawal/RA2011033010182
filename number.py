import json
import requests
from flask import Flask, request, jsonify

app = Flask(__name__)

def fetch_numbers(url):
    try:
        response = requests.get(url, timeout=5)  
        if response.status_code == 200:
            return response.json().get('numbers', [])
    except requests.exceptions.Timeout:
        pass
    except Exception as exc:
        print(f"Error fetching numbers from {url}: {exc}")
    return []

@app.route('/numbers', methods=['GET'])
def get_numbers():
    urls = request.args.getlist('url')
    unique_numbers = set()

    for url in urls:
        numbers = fetch_numbers(url)
        unique_numbers.update(numbers)

    merged_numbers = sorted(list(unique_numbers))
    response_data = {"numbers": merged_numbers}
    return jsonify(response_data)

if __name__ == '__main__':
    app.run(host='localhost', port=8008)
