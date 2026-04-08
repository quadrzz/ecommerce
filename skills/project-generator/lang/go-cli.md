# Go CLI App Template

## Files to create:

### `main.go`
```go
package main

import (
	"fmt"
	"os"
)

const version = "0.0.1"

func main() {
	args := os.Args[1:]

	if len(args) == 0 {
		fmt.Println("Usage: cli <command>")
		fmt.Println("Commands:")
		fmt.Println("  hello    Say hello")
		fmt.Println("  version  Show version")
		os.Exit(0)
	}

	switch args[0] {
	case "hello":
		fmt.Println("Hello from Go CLI!")
	case "version":
		fmt.Println("v" + version)
	default:
		fmt.Printf("Unknown command: %s\n", args[0])
		os.Exit(1)
	}
}
```

### `go.mod`
```
module cli

go 1.22
```

### `.gitignore`
```
bin/
vendor/
*.exe
```
