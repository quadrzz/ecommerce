# Python CLI App Template

## Files to create:

### `requirements.txt`
```
click
rich
```

### `main.py`
```python
import click
from rich.console import Console

console = Console()


@click.group()
def cli():
    """CLI App"""
    pass


@cli.command()
def hello():
    """Say hello"""
    console.print("[bold green]Hello![/]")


if __name__ == "__main__":
    cli()
```

### `.gitignore`
```
__pycache__/
*.pyc
.env
.venv/
```
