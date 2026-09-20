const { spawn } = require("node:child_process");
const path = require("node:path");

const rootDir = path.resolve(__dirname, "..");
try {
  process.loadEnvFile(path.join(rootDir, ".env"));
} catch (e) {
  console.warn("[hermes3d-supervisor] Could not load .env:", e.message);
}

console.log(`[hermes3d-supervisor] Starting Hermes adapter and web server (port ${process.env.PORT || 3000})...`);

const adapter = spawn(process.execPath, [path.join(rootDir, "server/hermes-gateway-adapter.js")], {
  cwd: rootDir,
  stdio: "inherit",
  env: process.env,
});

const server = spawn(process.execPath, [path.join(rootDir, "server/index.js")], {
  cwd: rootDir,
  stdio: "inherit",
  env: process.env,
});

function shutdown(signal) {
  console.log(`[hermes3d-supervisor] Received ${signal}, shutting down...`);
  try { adapter.kill(signal); } catch {}
  try { server.kill(signal); } catch {}
  process.exit(0);
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

adapter.on("exit", (code) => {
  console.log(`[hermes3d-supervisor] Adapter exited with code ${code}`);
});

server.on("exit", (code) => {
  console.log(`[hermes3d-supervisor] Server exited with code ${code}`);
  shutdown("SIGTERM");
});
