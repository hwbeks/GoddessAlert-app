import { T, css } from "../theme";
import TheCode from "./TheCode";

export default function HealthTab({
  healthScore,
  scoreColor,
  name,
  streak,
  longestStreak,
  scorePercentages,
  gestureDone,
  showRatingThanks,
  showTheCode,
  setShowTheCode,
}) {
  return (
    <div style={{ padding: "8px 24px" }}>
      <div style={css.sectionTitle}>Relationship Health</div>
      <div style={css.card}>
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 64, fontWeight: "bold", color: scoreColor }}>{healthScore}</div>
          <div style={{ fontSize: 14, color: T.muted, marginTop: 4 }}>out of 100</div>
          <div style={{ fontSize: 15, color: T.text, marginTop: 12, fontStyle: "italic" }}>
            {healthScore >= 70 ? `${name} feels seen. Keep it up.` : healthScore >= 40 ? "Getting there — stay consistent." : "Time to step up, brother."}
          </div>
        </div>
      </div>

      <div style={{ ...css.card, marginBottom: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 13, color: T.text }}>🔥 Current streak</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>Longest streak: {longestStreak} {longestStreak === 1 ? "day" : "days"}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 28, fontWeight: "bold", color: streak >= 7 ? T.green : T.accent }}>{streak}</div>
            <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: 1 }}>{streak === 1 ? "day" : "days"}</div>
          </div>
        </div>
      </div>

      {[
        { label: "Reminders completed", pct: scorePercentages.reminders, color: T.green },
        { label: "Gestures done this week", pct: gestureDone || showRatingThanks ? 100 : scorePercentages.gestures, color: T.accent },
        { label: "Weekly check-ins", pct: scorePercentages.checkins, color: T.premium },
      ].map((item, i) => (
        <div key={i} style={{ ...css.card, marginBottom: 8 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <div style={{ fontSize: 13 }}>{item.label}</div>
            <div style={{ fontSize: 13, color: item.color, fontWeight: "bold" }}>{item.pct}%</div>
          </div>
          <div style={{ height: 6, borderRadius: 3, background: T.border, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${item.pct}%`, background: item.color, borderRadius: 3 }} />
          </div>
        </div>
      ))}

      <TheCode showTheCode={showTheCode} setShowTheCode={setShowTheCode} />
    </div>
  );
}
