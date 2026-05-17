import { T } from "../theme";

export default function TheCode({ showTheCode, setShowTheCode }) {
 const content = [
  ["I", "Stay yourself. That's what attracts her.", "A relationship needs the tension between two different people. Don't become her mirror. Keep your own interests, your own friends, your own direction. Two whole people make a stronger relationship than two halves that merge."],
  ["II", "Form a team.", "A relationship has no manager and no employee. She is not your boss and you are not her assistant. Stop asking \"what can I do for you?\" and start seeing what your shared life needs. The dentist appointment that needs booking. The friend's birthday coming up. The dish that's not going to wash itself. A team functions when both people see what's there and pick up their share - not when one carries the mental list and the other waits to be told. Initiative is more attractive than service."],
  ["III", "Small acts build deep connection.", "A hand on her back. Remembering how she takes her coffee. Asking how the conversation with her mother went. Grand gestures impress briefly. Small, consistent attention builds something that lasts."],  
  ["IV", "Your calm is her safety.", "She's not looking for a perfect man. She's looking for a man who doesn't fall apart when things get hard. Your stability - not your success, not your words - is what makes her feel safe with you."],
  ["V", "She talks to connect, not to complain.", "When she shares her day - frustrations included - that's not an attack. That's trust. Listen without fixing. Sometimes \"I hear you\" is the most powerful thing you can say."],
  ["VI", "Intimacy starts before the bedroom.", "For her, desire is not a switch. It's a climate. It's built in the moments you look up from your phone when she walks in. In the conversation where you ask something real and actually listen. In the evening where nothing is planned and you simply choose to be together. Eroticism lives in curiosity - in the feeling that there is always more to discover about the person beside you. The couples who keep desire alive are not the ones who try harder. They are the ones who stay genuinely interested. You don't earn intimacy. You create the conditions for it - every day, in ways that have nothing to do with the bedroom."],
  ["VII", "How you come back matters more than how you fought.", "Every relationship has conflict. The healthy ones are not the ones that avoid it. They are the ones that come back to it. Don't pretend it didn't happen. Don't rush past it. A day later, a week later, find the moment to acknowledge what was hard - even briefly. Repair is not weakness. It's the choice to keep building together, even after something cracked. Done well, the relationship after repair can be stronger than before."],
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
