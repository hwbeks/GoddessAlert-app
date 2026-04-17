import { supabase } from "../supabase";
import { T, css } from "../theme";

function daysUntil(dateStr) {
  const today = new Date();
  const target = new Date(dateStr + "T00:00:00");
  target.setFullYear(today.getFullYear());
  if (target.getMonth() === today.getMonth() && target.getDate() === today.getDate()) return 0;
  if (target < today) target.setFullYear(today.getFullYear() + 1);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function HomeTab({
  score,
  setScore,
  weeklyRating,
  setWeeklyRating,
  gestureDone,
  setGestureDone,
  showRatingThanks,
  setShowRatingThanks,
  gestureRating,
  setGestureRating,
  tips,
  tipIndex,
  setTipIndex,
  events,
  rateTip,
  setScoreVersion,
}) {
  const currentTip = tips.length > 0 ? tips[tipIndex % tips.length] : null;

  return (
    <div style={{ padding: "8px 24px" }}>
      <div style={css.sectionTitle}>Weekly Check-in</div>
      <div style={weeklyRating ? css.cardAccent : css.card}>
        <div style={{ fontSize: 14, color: T.accent, fontStyle: "italic", marginBottom: 10 }}>"How attentive were you this week?"</div>
        {!weeklyRating ? (
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { label: "😬", sub: "Poor", val: "poor", score: 1 },
              { label: "😐", sub: "OK", val: "ok", score: 2 },
              { label: "😊", sub: "Good", val: "good", score: 3 },
              { label: "🔥", sub: "Great", val: "great", score: 4 },
            ].map((opt) => (
              <button key={opt.val} onClick={async () => {
                setWeeklyRating(opt.val);
                const { data: { user } } = await supabase.auth.getUser();
                if (user) {
                  await supabase.from("health_scores").insert({ user_id: user.id, score: opt.score });
                  // ✅ Fix: score herberekenen via scoreVersion ipv lokale update
                  if (setScoreVersion) setScoreVersion((v) => v + 1);
                }
              }} style={{ flex: 1, background: T.accentSoft, border: `1px solid ${T.border}`, borderRadius: 12, padding: "10px 4px", color: T.text, cursor: "pointer", fontFamily: "Georgia, serif", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 22 }}>{opt.label}</span>
                <span style={{ fontSize: 11, color: T.muted }}>{opt.sub}</span>
              </button>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 15, color: T.text }}>
                {weeklyRating === "poor" && "😬 You rated: Poor"}
                {weeklyRating === "ok" && "😐 You rated: OK"}
                {weeklyRating === "good" && "😊 You rated: Good"}
                {weeklyRating === "great" && "🔥 You rated: Great"}
              </div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>
                {weeklyRating === "poor" && "Small steps. Start with today's tip."}
                {weeklyRating === "ok" && "Solid start. Push a little harder this week."}
                {weeklyRating === "good" && "She notices. Keep the momentum going."}
                {weeklyRating === "great" && "That's the standard. Don't let it slip."}
              </div>
            </div>
            <button onClick={() => setWeeklyRating(null)} style={{ background: "transparent", border: `1px solid ${T.border}`, borderRadius: 20, padding: "5px 12px", color: T.muted, fontSize: 11, cursor: "pointer", fontFamily: "Georgia, serif" }}>Redo</button>
          </div>
        )}
      </div>

      <div style={{ ...css.sectionTitle, marginTop: 16 }}>Today's Gesture</div>

      {!gestureDone && !showRatingThanks && tipIndex === 0 && currentTip && (
        <div style={{ background: "linear-gradient(135deg, #1a1600, #161616)", border: `1px solid ${T.accent}44`, borderRadius: 16, padding: "20px 18px", marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div style={{ fontSize: 13, color: T.accent, fontStyle: "italic" }}>✦ Daily Attention Tip</div>
            <div style={{ fontSize: 10, color: T.muted, letterSpacing: 1 }}>#{tipIndex + 1}</div>
          </div>
          <div style={{ fontSize: 14, color: T.text, lineHeight: 1.7 }}>{currentTip.content}</div>
          <button style={{ marginTop: 14, background: T.accent, color: "#0d0d0d", border: "none", borderRadius: 30, padding: "8px 22px", fontWeight: "bold", fontSize: 13, cursor: "pointer", fontFamily: "Georgia, serif" }} onClick={() => setGestureDone(true)}>Mark as done</button>
        </div>
      )}

      {gestureDone && !showRatingThanks && currentTip && (
        <div style={{ background: "linear-gradient(135deg, #1a1600, #161616)", border: `1px solid ${T.accent}44`, borderRadius: 16, padding: "20px 18px", marginBottom: 10 }}>
          <div style={{ fontSize: 13, color: T.accent, fontStyle: "italic", marginBottom: 8 }}>✦ Daily Attention Tip</div>
          <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.7, textDecoration: "line-through" }}>{currentTip.content}</div>
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#ffffff08", borderRadius: 12, padding: "12px 14px" }}>
              <div style={{ fontSize: 13, color: T.muted }}>Was this tip useful?</div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => rateTip("up")} style={{ background: "#ffffff10", border: `1px solid ${T.border}`, borderRadius: 20, padding: "6px 14px", fontSize: 16, cursor: "pointer" }}>👍</button>
                <button onClick={() => rateTip("down")} style={{ background: "#ffffff10", border: `1px solid ${T.border}`, borderRadius: 20, padding: "6px 14px", fontSize: 16, cursor: "pointer" }}>👎</button>
              </div>
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 8, textAlign: "center" }}>Your feedback helps us improve the tips</div>
          </div>
        </div>
      )}

      {showRatingThanks && (
        <div style={{ background: "linear-gradient(135deg, #1a1600, #161616)", border: `1px solid ${T.accent}44`, borderRadius: 16, padding: "28px 18px", marginBottom: 10, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>{gestureRating === "up" ? "🙌" : "📝"}</div>
          <div style={{ fontSize: 14, color: gestureRating === "up" ? T.green : T.muted }}>{gestureRating === "up" ? "Great — more like this coming!" : "Noted — we'll do better."}</div>
        </div>
      )}

      {!gestureDone && !showRatingThanks && tipIndex > 0 && (
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "28px 18px", marginBottom: 10, textAlign: "center" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
          <div style={{ fontSize: 15, color: T.accent, fontStyle: "italic", marginBottom: 6 }}>You're all caught up</div>
          <div style={{ fontSize: 13, color: T.muted, marginBottom: 16 }}>Your next tip arrives in</div>
          <div style={{ display: "inline-flex", gap: 8, alignItems: "center", background: T.accentSoft, border: `1px solid ${T.accent}44`, borderRadius: 12, padding: "12px 20px" }}>
            {[{ val: "18", label: "hrs" }, { val: ":", label: null }, { val: "24", label: "min" }, { val: ":", label: null }, { val: "07", label: "sec" }].map((seg, i) =>
              seg.label === null
                ? <div key={i} style={{ fontSize: 22, color: T.accent, fontWeight: "bold", paddingBottom: 14 }}>:</div>
                : <div key={i} style={{ textAlign: "center" }}><div style={{ fontSize: 26, fontWeight: "bold", color: T.accent, fontFamily: "monospace" }}>{seg.val}</div><div style={{ fontSize: 9, color: T.muted, textTransform: "uppercase", letterSpacing: 1 }}>{seg.label}</div></div>
            )}
          </div>
          <div style={{ fontSize: 11, color: T.muted, marginTop: 14 }}>One tip per day keeps the relationship strong 💛</div>
        </div>
      )}

      {events.filter((e) => daysUntil(e.date) <= 14).slice(0, 1).map((ev) => (
        <div key={ev.id} style={{ ...css.cardAccent, marginTop: 8 }}>
          <div style={{ fontSize: 11, color: T.red, letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>⚡ Coming up</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 28 }}>{ev.emoji}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: "bold" }}>{ev.name}</div>
                <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>Don't wait — plan something now</div>
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: "bold", color: daysUntil(ev.date) <= 3 ? T.red : T.accent }}>{daysUntil(ev.date) === 0 ? "🎉" : daysUntil(ev.date)}</div>
              <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: 1 }}>{daysUntil(ev.date) === 0 ? "TODAY!" : "days"}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
