# Project Generator

Scaffold boilerplate projects in 12+ languages and frameworks.

## Usage

When the user invokes this skill:
1. Present the available templates organized by language/category
2. Ask the user which template they want and the project directory name
3. Generate all files using the instructions below
4. Install dependencies if the user confirms
5. Start the dev server if the user confirms

## Available Templates

### Node.js / TypeScript
| ID | Label | Category | Install | Dev |
|---|---|---|---|---|
| `node-express` | Node.js + Express API | Backend | `npm install` | `npm run dev` |
| `react-vite` | React + Vite | Frontend | `npm install` | `npm run dev` |
| `nextjs` | Next.js App Router | Full-stack | `npm install` | `npm run dev` |
| `node-cli` | Node CLI App | CLI | `npm install` | `npm run dev` |

### Python
| ID | Label | Category | Install | Dev |
|---|---|---|---|---|
| `python-fastapi` | FastAPI | Backend | `pip install -r requirements.txt` | `uvicorn main:app --reload` |
| `python-flask` | Flask | Backend | `pip install -r requirements.txt` | `flask run --debug` |
| `python-cli` | Python CLI | CLI | `pip install -r requirements.txt` | `python main.py` |
| `python-ml` | ML / Data Science | Data | `pip install -r requirements.txt` | `python main.py` |

### Go
| ID | Label | Category | Install | Dev |
|---|---|---|---|---|
| `go-api` | Go REST API (Chi) | Backend | `go mod tidy` | `air` |
| `go-cli` | Go CLI App | CLI | `go mod tidy` | `go run main.go` |

### Rust
| ID | Label | Category | Install | Dev |
|---|---|---|---|---|
| `rust-axum` | Rust + Axum API | Backend | `cargo build` | `cargo watch -x run` |
| `rust-cli` | Rust CLI App | CLI | `cargo build` | `cargo run` |

### Ruby
| ID | Label | Category | Install | Dev |
|---|---|---|---|---|
| `ruby-rails` | Ruby on Rails | Full-stack | `bundle install` | `bin/dev` |

### Java
| ID | Label | Category | Install | Dev |
|---|---|---|---|---|
| `java-spring` | Spring Boot REST | Backend | `mvn dependency:go-offline` | `mvn spring-boot:run` |

### PHP
| ID | Label | Category | Install | Dev |
|---|---|---|---|---|
| `php-laravel` | Laravel API | Backend | `composer install` | `php artisan serve` |

## Scaffolding Rules

1. **Always create all required files at once** — the complete working project, not stubs.
2. **File content is in the template files** — read the corresponding `lang/<id>.md` for exact file contents.
3. **Always include a README.md** with Setup, Run, and Structure sections.
4. **Always include a .gitignore** appropriate for the language.
5. **Ask before installing dependencies** — `npm install`, `pip install`, etc.
6. **Ask before starting the dev server.**
7. If the template is `nextjs`, `react-vite`, or any frontend — include basic Tailwind setup.
8. If the template is a backend API — always include `GET /` and `GET /health` routes.
9. For CLI apps — include a "hello" command as a working example.
10. For each file created, ask the user if they want any modifications before proceeding.
