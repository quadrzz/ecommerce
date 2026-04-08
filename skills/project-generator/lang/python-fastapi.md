# Python FastAPI Template

## Files to create:

### `.venv/` (Python virtual environment)

### `requirements.txt`
```
fastapi[standard]
uvicorn
pydantic
```

### `main.py`
```python
from fastapi import FastAPI

app = FastAPI(title="FastAPI App")


@app.get("/")
def root():
    return {"message": "Hello from FastAPI!"}


@app.get("/health")
def health():
    return {"status": "ok"}
```

### `.env`
```
PORT=8000
```

### `.gitignore`
```
__pycache__/
*.pyc
.env
.venv/
```

### `README.md`
```markdown
# FastAPI App

## Setup
```bash
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Run
```bash
uvicorn main:app --reload
```
```
