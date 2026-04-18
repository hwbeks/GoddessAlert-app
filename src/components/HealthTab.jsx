import { T, css } from "../theme";
import TheCode from "./TheCode";

export default function HealthTab({
  healthScore,
  scoreColor,
  scoreZone,
  name,
  streak,
  longestStreak,
  scorePercentages,
  gestureDone,
  showRatingThanks,
  showTheCode,
  setShowTheCode,
  isPremium,
  onUpgrade,
}) {
  return (
    <div style={{ padding: "8px 24px" }}>
      <div style={css.sectionTitle}>Relationship Health</div>
      <div style={css.card}>
        {isPremium ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 64, fontWeight: "bold", color: scoreColor }}>{healthScore}</div>
            <div style={{ fontSize: 11, color: scoreColor, marginTop: 4, letterSpacing: 2, textTransform: "uppercase" }}>
              {scoreZone || "Getting there"}
            </div>
            <div style={{ fontSize: 15, color: T.text, marginTop: 12, fontStyle: "italic" }}>
              {healthScore >= 85
                ? `${name} feels the difference. Keep going.`
                : healthScore >= 70
                ? `${name} feels seen. Stay consistent.`
                : healthScore >= 50
                ? "Getting there — small actions add up."
                : "Time to step up. Start with today."}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "28px 20px" }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>🔒</div>
            <div style={{ fontSize: 15, color: T.text, fontStyle: "italic", marginBottom: 8 }}>
              Your relationship score is waiting.
            </div>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 20, lineHeight: 1.6 }}>
              Upgrade to Premium to track your score, see your progress, and understand where to improve.
            </div>
            <button
              onClick={onUpgrade}
              style={{ ...css.btn, width: "auto", padding: "10px 28px", fontSize: 13 }}
            >
              Upgrade to see your score →
            </button>
          </div>
        )}
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

      {isPremium && [
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
