import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { T, css } from "../theme";
import TheCode from "./TheCode";

const CATEGORIES = [
  { key: "attentiveness", label: "Attentiveness", emoji: "👁️" },
  { key: "gestures",      label: "Gestures",      emoji: "🎁" },
  { key: "presence",      label: "Presence",       emoji: "📵" },
  { key: "awareness",     label: "Awareness",      emoji: "🗓️" },
  { key: "priority",      label: "Priority",       emoji: "⭐" },
  { key: "appreciation",  label: "Appreciation",   emoji: "🙏" },
];

function scoreColor(value) {
  if (value <= 2) return T.red;
  if (value <= 3) return T.accent;
  return T.green;
}

export default function HealthTab({
  healthScore,
  scoreColor: scoreColorProp,
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
  const [assessment, setAssessment] = useState(null);
  const [partnerReactions, setPartnerReactions] = useState(null);

  // ✅ useEffect bij mount — getUser() is hier toegestaan
  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Assessment profiel
      const { data: assessmentData } = await supabase
        .from("assessments")
        .select("attentiveness, gestures, presence, awareness, priority, appreciation, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (assessmentData) setAssessment(assessmentData);

      // Partner reacties — laatste 30 dagen
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const thirtyDaysAgoDate = thirtyDaysAgo.toISOString().split("T")[0];

      const { data: reactions } = await supabase
        .from("reminders")
        .select("partner_reaction")
        .eq("user_id", user.id)
        .not("partner_reaction", "is", null)
        .gte("date", thirtyDaysAgoDate);

      if (reactions && reactions.length > 0) {
        setPartnerReactions({
          positive: reactions.filter(r => r.partner_reaction === 3).length,
          neutral:  reactions.filter(r => r.partner_reaction === 2).length,
          negative: reactions.filter(r => r.partner_reaction === 1).length,
        });
      }
    }

    loadData();
  }, []);

  return (
    <div style={{ padding: "8px 24px" }}>
      <div style={css.sectionTitle}>Relationship Health</div>
      <div style={css.card}>
        {isPremium ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 64, fontWeight: "bold", color: scoreColorProp }}>{healthScore}</div>
            <div style={{ fontSize: 11, color: scoreColorProp, marginTop: 4, letterSpacing: 2, textTransform: "uppercase" }}>
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

      {/* ── ASSESSMENT PROFIEL (free + premium) ── */}
      {assessment && (
        <div style={{ marginTop: 24 }}>
          <div style={css.sectionTitle}>Your Attentiveness Profile</div>
          <div style={css.card}>
            {[...CATEGORIES]
              .sort((a, b) => (assessment[a.key] || 0) - (assessment[b.key] || 0))
              .map((cat) => {
                const value = assessment[cat.key] || 0;
                const color = scoreColor(value);
                return (
                  <div key={cat.key} style={{ marginBottom: 14 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <div style={{ fontSize: 13, color: T.text }}>
                        {cat.emoji} {cat.label}
                      </div>
                      <div style={{ fontSize: 13, color, fontWeight: "bold" }}>
                        {value}/5
                      </div>
                    </div>
                    <div style={{ height: 6, background: T.border, borderRadius: 3 }}>
                      <div style={{
                        height: 6,
                        width: `${(value / 5) * 100}%`,
                        background: color,
                        borderRadius: 3,
                        transition: "width 0.4s",
                      }} />
                    </div>
                  </div>
                );
              })}
            <div style={{ fontSize: 11, color: T.muted, marginTop: 12 }}>
              Based on your assessment of {new Date(assessment.created_at).toLocaleDateString("en-GB", {
                day: "numeric", month: "long", year: "numeric"
              })}
            </div>
          </div>
        </div>
      )}

      {!assessment && (
        <div style={{ marginTop: 24 }}>
          <div style={css.sectionTitle}>Your Attentiveness Profile</div>
          <div style={{ ...css.card, textAlign: "center" }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🪞</div>
            <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.6 }}>
              Take the self assessment to see your personal attentiveness profile.
            </div>
          </div>
        </div>
      )}

      {/* ── PARTNER REACTIES (premium only) ── */}
      {isPremium && partnerReactions && (partnerReactions.positive + partnerReactions.neutral + partnerReactions.negative) > 0 && (
        <div style={{ marginTop: 24 }}>
          <div style={css.sectionTitle}>Her Reactions — Last 30 Days</div>
          <div style={css.card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 14, color: T.text }}>❤️ She loved it</div>
              <div style={{ fontSize: 14, fontWeight: "bold", color: T.green }}>{partnerReactions.positive}x</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 14, color: T.text }}>😐 She noticed</div>
              <div style={{ fontSize: 14, fontWeight: "bold", color: T.accent }}>{partnerReactions.neutral}x</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 14, color: T.text }}>👎 Missed the mark</div>
              <div style={{ fontSize: 14, fontWeight: "bold", color: T.red }}>{partnerReactions.negative}x</div>
            </div>
          </div>
        </div>
      )}

      {isPremium && (!partnerReactions || (partnerReactions.positive + partnerReactions.neutral + partnerReactions.negative) === 0) && (
        <div style={{ marginTop: 24 }}>
          <div style={css.sectionTitle}>Her Reactions</div>
          <div style={{ ...css.card, textAlign: "center" }}>
            <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.6 }}>
              Complete reminders and rate her reaction — her feedback will appear here.
            </div>
          </div>
        </div>
      )}

      <TheCode showTheCode={showTheCode} setShowTheCode={setShowTheCode} />
    </div>
  );
}
