# Rust + Axum API Template

## Files to create:

### `Cargo.toml`
```toml
[package]
name = "axum-api"
version = "0.1.0"
edition = "2024"

[dependencies]
axum = "0.8"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tokio = { version = "1", features = ["full"] }
tower-http = { version = "0.6", features = ["cors"] }
```

### `src/main.rs`
```rust
use axum::{routing::get, Router, Json};
use serde::{Deserialize, Serialize};
use serde_json::json;
use tower_http::cors::CorsLayer;

#[derive(Serialize)]
struct HealthResponse {
    status: String,
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(root))
        .route("/health", get(health))
        .layer(CorsLayer::permissive());

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();

    println!("→ Server running on http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}

async fn root() -> Json<serde_json::Value> {
    Json(json!({ "message": "Hello from Axum!" }))
}

async fn health() -> Json<HealthResponse> {
    Json(HealthResponse { status: "ok".to_string() })
}
```

### `.gitignore`
```
target/
Cargo.lock
```
