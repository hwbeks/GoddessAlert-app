import { T, css } from "../theme";

export default function UpsellPrompt({ message, onUpgrade }) {
  return (
    <div style={{
      background: T.card,
      border: `1px solid ${T.accent}44`,
      borderRadius: 16,
      padding: "24px 20px",
      marginBottom: 10,
      textAlign: "center"
    }}>
      <div style={{ fontSize: 28, marginBottom: 12 }}>🔒</div>
      <div style={{ fontSize: 14, color: T.text, fontStyle: "italic", marginBottom: 8 }}>
        {message}
      </div>
      <button
        onClick={onUpgrade}
        style={{
          ...css.btn,
          marginTop: 12,
          width: "auto",
          padding: "10px 24px",
          fontSize: 13,
        }}
      >
        Upgrade to Premium →
      </button>
    </div>
  );
}
