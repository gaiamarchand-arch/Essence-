export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { session_id, input = "", temperature = 0.3 } = req.body || {};
  const store = GLOBAL_STORE.sessions;

  if (!store.has(session_id)) return res.status(400).json({ error: "Session inconnue" });

  const st = store.get(session_id);
  let phase = st.phase;

  if (phase === "prologue" && /garage|réserve|indice/i.test(input)) phase = "enquête";
  else if (phase === "enquête" && /accuse|coupable|vérité/i.test(input)) phase = "climax";
  else if (phase === "climax" && /pardonne|justice|fin/i.test(input)) phase = "épilogue";

  st.phase = phase;
  st.summary = `Dernière entrée: ${String(input).slice(0, 140)}`;

  const reply =
    phase === "prologue"
      ? `Dans le bar, les regards se figent. La vieille s’assoit: “Pose tes questions, mais choisis bien.”`
      : phase === "enquête"
      ? `Dans la réserve, une caisse brisée cache une clé tachée. Qui ment: Maurice ou Fabrice ?`
      : phase === "climax"
      ? `Les voix montent. Ton ami blêmit. Un nom tombe. La vérité est prête à éclater.`
      : `Le silence retombe. La pluie cesse. Tu sais enfin ce qui s’est passé.`;

  res.json({ reply, phase, time: new Date().toISOString(), summary: st.summary });
}

// mémoire partagée entre fonctions (runtime Vercel)
const GLOBAL_STORE = globalThis.__ESSENCE_STORE__ || { sessions: new Map() };
globalThis.__ESSENCE_STORE__ = GLOBAL_STORE;
