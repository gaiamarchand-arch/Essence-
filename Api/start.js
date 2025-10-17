export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const session_id = cryptoRandomUUID();
  const player = (req.body?.player_name || "voyageur").trim();

  GLOBAL_STORE.sessions.set(session_id, { phase: "prologue", summary: "Début au Relais." });

  res.json({
    session_id,
    message: `La pluie fouette les vitres du Relais. La vieille s’avance et murmure : "Dis-moi ton nom, ${player}… et celui de ton ami."`,
    phase: "prologue",
    time: new Date().toISOString(),
  });
}

// --- util & mémoire simple en RAM ---
const GLOBAL_STORE = globalThis.__ESSENCE_STORE__ || { sessions: new Map() };
globalThis.__ESSENCE_STORE__ = GLOBAL_STORE;

// Polyfill crypto.randomUUID pour Node 18/edge
function cryptoRandomUUID() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  // fallback léger
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0, v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
