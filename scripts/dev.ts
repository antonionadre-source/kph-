// npm run dev must select Vite even when .env or dist contains a production build.
process.env.NODE_ENV = "development";
await import("../server.ts");
export {};
