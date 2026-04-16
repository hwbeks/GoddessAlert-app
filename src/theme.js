export const T = {
  bg: "#0d0d0d",
  card: "#161616",
  border: "#2a2a2a",
  accent: "#e8c97e",
  accentSoft: "#e8c97e18",
  red: "#e87e7e",
  green: "#7ee8a2",
  text: "#f0ece0",
  muted: "#888070",
  premium: "#c9a84c",
};

export const css = {
  app: { background: T.bg, minHeight: "100vh", fontFamily: "'Georgia', serif", color: T.text, display: "flex", flexDirection: "column", alignItems: "center" },
  page: { width: "100%", maxWidth: 420, minHeight: "100vh", display: "flex", flexDirection: "column", padding: "0 24px", boxSizing: "border-box" },
  input: { width: "100%", background: "#111", border: `1px solid ${T.border}`, borderRadius: 12, padding: "14px 16px", color: T.text, fontSize: 15, fontFamily: "Georgia, serif", boxSizing: "border-box", outline: "none", marginBottom: 12, colorScheme: "dark", accentColor: "#e8c97e" },
  btn: { width: "100%", background: T.accent, color: "#0d0d0d", border: "none", borderRadius: 30, padding: "15px", fontWeight: "bold", fontSize: 15, cursor: "pointer", fontFamily: "Georgia, serif", letterSpacing: 0.5 },
  btnGhost: { width: "100%", background: "transparent", color: T.muted, border: `1px solid ${T.border}`, borderRadius: 30, padding: "14px", fontSize: 14, cursor: "pointer", fontFamily: "Georgia, serif" },
  btnDanger: { width: "100%", background: "transparent", color: T.red, border: `1px solid ${T.red}`, borderRadius: 30, padding: "14px", fontSize: 14, cursor: "pointer", fontFamily: "Georgia, serif", fontWeight: "bold" },
  label: { fontSize: 12, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, display: "block" },
  card: { background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "16px 18px", marginBottom: 10 },
  cardAccent: { background: T.card, border: `1px solid ${T.accent}`, borderRadius: 16, padding: "16px 18px", marginBottom: 10 },
  sectionTitle: { fontSize: 11, color: T.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 12 },
  nav: { position: "fixed", bottom: 0, left: 0, right: 0, background: "#111", borderTop: `1px solid ${T.border}`, display: "flex", justifyContent: "space-around", padding: "10px 0 18px", zIndex: 100 },
  modal: { position: "fixed", inset: 0, background: "#000000cc", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 200 },
  modalBox: { background: "#1a1a1a", borderRadius: "24px 24px 0 0", padding: "28px 24px 48px", width: "100%", maxWidth: 420, border: `1px solid ${T.border}`, boxSizing: "border-box" },
};
