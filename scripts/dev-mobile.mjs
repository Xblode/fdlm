import { spawn } from "node:child_process";
import net from "node:net";
import os from "node:os";

const preferredPort = Number(process.env.PORT ?? 3000);

function getMobileUrls(port) {
  /** @type {string[]} */
  const urls = [];

  for (const interfaces of Object.values(os.networkInterfaces())) {
    for (const netInterface of interfaces ?? []) {
      if (netInterface.family === "IPv4" && !netInterface.internal) {
        urls.push(`http://${netInterface.address}:${port}`);
      }
    }
  }

  return urls;
}

function isPortInUse(port, host = "0.0.0.0") {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once("error", () => resolve(true));
    server.once("listening", () => {
      server.close(() => resolve(false));
    });

    server.listen(port, host);
  });
}

async function findAvailablePort(startPort) {
  for (let port = startPort; port < startPort + 20; port += 1) {
    if (!(await isPortInUse(port))) {
      return port;
    }
  }

  return null;
}

function printMobileUrls(port) {
  const urls = getMobileUrls(port);

  console.log("");
  console.log("Test mobile — même réseau Wi‑Fi que ce PC");
  console.log("============================================");

  if (urls.length === 0) {
    console.log("Aucune adresse IPv4 locale trouvée.");
  } else {
    for (const url of urls) {
      console.log(`→ ${url}`);
    }
  }

  console.log("");
}

const port = await findAvailablePort(preferredPort);

if (!port) {
  console.error(
    `Aucun port libre entre ${preferredPort} et ${preferredPort + 19}.`,
  );
  process.exit(1);
}

if (port !== preferredPort) {
  console.log("");
  console.log(
    `Le port ${preferredPort} est déjà utilisé → serveur sur le port ${port}.`,
  );
}

printMobileUrls(port);

console.log("Démarrage du serveur…");
console.log("");

const child = spawn(`npx next dev --webpack -H 0.0.0.0 -p ${port}`, {
  stdio: "inherit",
  shell: true,
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
