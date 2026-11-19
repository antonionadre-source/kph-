import fs from "fs";
import path from "path";

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "production";
}

const cjsServerPath = path.resolve(process.cwd(), "dist/server.cjs");

if (fs.existsSync(cjsServerPath)) {
  await import("./dist/server.cjs");
} else {
  await import("./server.ts");
}


