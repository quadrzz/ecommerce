# Node CLI App Template

## Files to create:

### `package.json`
```json
{
  "name": "cli-app",
  "version": "0.0.1",
  "type": "module",
  "bin": { "cli": "dist/index.js" },
  "scripts": {
    "dev": "tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "commander": "^12.1.0",
    "chalk": "^5.3.0"
  },
  "devDependencies": {
    "typescript": "^5.8.3",
    "@types/node": "^22.16.5",
    "tsx": "^4.19.0"
  }
}
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

### `src/index.ts`
```typescript
import { Command } from "commander";
import chalk from "chalk";

const program = new Command();

program
  .name("cli-app")
  .description("A CLI app built with Commander + Chalk")
  .version("0.0.1");

program
  .command("hello")
  .description("Say hello")
  .action(() => {
    console.log(chalk.green("Hello from CLI!"));
  });

program.parse();
```

### `.gitignore`
```
node_modules/
dist/
*.log
.env
```
