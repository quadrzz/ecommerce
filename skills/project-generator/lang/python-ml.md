# Python ML / Data Science Template

## Files to create:

### `requirements.txt`
```
numpy
pandas
matplotlib
scikit-learn
jupyter
```

### `main.py`
```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

# Generate sample data
X, y = make_classification(n_samples=1000, n_features=20, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

# Evaluate
y_pred = clf.predict(X_test)
print(f"Accuracy: {accuracy_score(y_test, y_pred):.4f}")
print("\nClassification Report:")
print(classification_report(y_test, y_pred))
```

### `notebook.ipynb`
```json
{
  "nbformat": 4,
  "metadata": {
    "kernelspec": { "display_name": "Python 3", "name": "python3", "language": "python" }
  },
  "cells": [
    {
      "cell_type": "markdown",
      "source": ["# Data Science Notebook\n"],
      "metadata": {}
    },
    {
      "cell_type": "code",
      "execution_count": null,
      "source": ["import numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\nprint('Ready!')\n"],
      "metadata": {},
      "outputs": []
    }
  ]
}
```

### `.gitignore`
```
__pycache__/
*.pyc
.env
.venv/
.ipynb_checkpoints/
*.pkl
```
