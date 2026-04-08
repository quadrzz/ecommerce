# Python Flask Template

## Files to create:

### `requirements.txt`
```
flask
flask-cors
python-dotenv
```

### `app.py`
```python
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def root():
    return jsonify({"message": "Hello from Flask!"})


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
```

### `.gitignore`
```
__pycache__/
*.pyc
.env
.venv/
```
