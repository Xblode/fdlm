import net from "node:net";
import os from "node:os";

const preferredPort = Number(process.env.PORT ?? 3000);

function getMobileUrls(port) {
  /** @type {string[]} */
  const urls = [];

  for (const interfaces of Object.values(os.networkInterfaces())) {
    for (const net of interfaces ?? []) {
      if (net.family === "IPv4" && !net.internal) {
        urls.push(`http://${net.address}:${port}`);
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

async function findListeningPorts(startPort) {
  /** @type {number[]} */
  const ports = [];

  for (let port = startPort; port < startPort + 20; port += 1) {
    if (await isPortInUse(port)) {
      ports.push(port);
    }
  }

  return ports;
}

const activePorts = await findListeningPorts(preferredPort);

console.log("");
console.log("Test mobile — même réseau Wi‑Fi que ce PC");
console.log("============================================");

if (activePorts.length === 0) {
  console.log("Aucun serveur Next.js détecté sur les ports 3000–3019.");
  console.log("Lance : npm run dev:mobile");
} else {
  for (const port of activePorts) {
    const urls = getMobileUrls(port);

    if (urls.length === 0) {
      console.log(`Port ${port} — aucune adresse IPv4 locale trouvée.`);
      continue;
    }

    console.log(`Port ${port} :`);
    for (const url of urls) {
      console.log(`→ ${url}`);
    }
    console.log("");
  }
}

console.log("");
if (activePorts.length > 1) {
  console.log(
    "Plusieurs serveurs tournent en parallèle — utilise le port affiché par npm run dev:mobile.",
  );
  console.log("");
}

console.log("Lance le serveur avec : npm run dev:mobile");
console.log("Puis ouvre l’URL ci-dessus dans le navigateur du téléphone.");
console.log("");
