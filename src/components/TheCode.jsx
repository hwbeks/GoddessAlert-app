import { T } from "../theme";

export default function TheCode({ showTheCode, setShowTheCode }) {
  const content = [
    ["I", "She talks to connect, not to complain.", "When she shares her day - frustrations included - that's not an attack. That's trust. Listen without fixing. Sometimes \"I hear you\" is the most powerful thing you can say."],
    ["II", "Your calm is her safety.", "She's not looking for a perfect man. She's looking for a man who doesn't fall apart when things get hard. Your stability - not your success, not your words - is what makes her feel safe with you."],
    ["III", "Don't fix it. Acknowledge it first.", "You're wired to solve problems. That's a strength. But sometimes she doesn't want a solution - she wants to feel understood. Ask first: \"Do you want me to listen, or do you want my take?\""],
    ["IV", "Small acts build deep connection.", "A hand on her back. Remembering how she takes her coffee. Asking how the conversation with her mother went. Grand gestures impress briefly. Small, consistent attention builds something that lasts."],
    ["V", "When she goes quiet, something matters.", "A woman who falls silent hasn't gone cold. She's waiting - without knowing it - to see if you'll notice. Notice. Not out of obligation. Out of choice."],
    ["VI", "Intimacy starts before the bedroom.", "For her, emotional safety comes before physical closeness. A day of real attention, a real conversation, a moment of genuine connection - that's foreplay. Remember that."],
    ["VII", "Stay yourself. That's what attracts her.", "A relationship needs the tension between two different people. Don't become her mirror. Keep your own interests, your own friends, your own direction. Two whole people make a stronger relationship than two halves that merge."],
  ];

  if (!showTheCode) {
    return (
      <div style={{ textAlign: "center", paddingTop: 24, paddingBottom: 80 }}>
        <span onClick={() => setShowTheCode(true)} style={{ fontSize: 11, color: T.muted, cursor: "pointer", letterSpacing: 1 }}>· The Code</span>
      </div>
    );
  }

  return (
    <div style={{ padding: "32px 8px 16px", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: T.accent, letterSpacing: 2, textTransform: "uppercase" }}>The Code</div>
        <span onClick={() => setShowTheCode(false)} style={{ fontSize: 11, color: T.muted, cursor: "pointer", letterSpacing: 1 }}>✕ close</span>
      </div>
      {content.map(([num, title, body]) => (
        <div key={num} style={{ marginBottom: 24, textAlign: "left" }}>
          <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2 }}>{num}</div>
          <div style={{ fontSize: 13, color: T.accent, fontStyle: "italic", marginBottom: 6 }}>{title}</div>
          <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>{body}</div>
        </div>
      ))}
    </div>
  );
}
