# Go REST API Template

## Files to create:

### `main.go`
```go
package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
)

func main() {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(map[string]string{"message": "Hello from Go API!"})
	})

	mux.HandleFunc("GET /health", func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	log.Printf("→ Server running on http://localhost:%s", port)
	log.Fatal(http.ListenAndServe(":"+port, mux))
}
```

### `go.mod`
```
module api

go 1.22
```

### `http/client.go`
```go
package http

import (
	"encoding/json"
	"net/http"
)

func jsonResponse(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}
```

### `.env`
```
PORT=3000
```

### `.gitignore`
```
bin/
vendor/
*.exe
```
