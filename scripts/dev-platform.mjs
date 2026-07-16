import { spawn } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const frontend = path.resolve(here, "..");
const root = path.resolve(frontend, "..");
const api = path.join(root, "Api");
const isWindows = process.platform === "win32";

function run(command, args, cwd, title) {
  const child = spawn(command, args, {
    cwd,
    stdio: "inherit",
    shell: isWindows,
    env: { ...process.env },
  });
  child.on("exit", (code) => {
    if (code && code !== 0) console.error(`${title} stopped with code ${code}`);
  });
  return child;
}

console.log("Starting ASP.NET Core API on http://127.0.0.1:5188 ...");
const apiProcess = run("dotnet", ["run"], api, "ASP.NET API");

setTimeout(() => {
  console.log("Starting Next.js on http://127.0.0.1:3000 ...");
  run(isWindows ? "npm.cmd" : "npm", ["run", "dev"], frontend, "Next.js");
}, 2500);

function stop() {
  apiProcess.kill("SIGTERM");
  process.exit(0);
}
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
