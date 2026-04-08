# Rust CLI App Template

## Files to create:

### `Cargo.toml`
```toml
[package]
name = "cli"
version = "0.1.0"
edition = "2024"

[[bin]]
name = "cli"
path = "main.rs"

[dependencies]
clap = { version = "4", features = ["derive"] }
console = "0.15"
```

### `main.rs`
```rust
use clap::{Parser, Subcommand};
use console::style;

#[derive(Parser)]
#[command(name = "cli", version = "0.1.0", about = "A CLI app")]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    /// Say hello
    Hello,
    /// Show version
    Version,
}

fn main() {
    let cli = Cli::parse();

    match cli.command {
        Some(Commands::Hello) => {
            println!("{}", style("Hello from Rust CLI!").green());
        }
        Some(Commands::Version) => {
            println!("v{}", env!("CARGO_PKG_VERSION"));
        }
        None => {
            println!("Usage: cli <command>");
            println!("Commands: hello, version");
        }
    }
}
```

### `.gitignore`
```
target/
Cargo.lock
```
