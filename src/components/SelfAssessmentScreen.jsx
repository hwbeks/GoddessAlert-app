import { useState } from "react";
import { supabase } from "../supabase";
import { T, css } from "../theme";

const QUESTIONS = [
  {
    category: "attentiveness",
    label: "Attentiveness",
    emoji: "👁️",
    question: "How often do you notice when something is bothering her — without her telling you?",
    options: [
      { value: 1, label: "Rarely" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Often" },
      { value: 4, label: "Almost always" },
      { value: 5, label: "Always" },
    ],
  },
  {
    category: "gestures",
    label: "Gestures",
    emoji: "🎁",
    question: "How often do you do something small and unexpected to make her feel appreciated?",
    options: [
      { value: 1, label: "Rarely" },
      { value: 2, label: "Once a month" },
      { value: 3, label: "A few times a month" },
      { value: 4, label: "Once a week" },
      { value: 5, label: "Multiple times a week" },
    ],
  },
  {
    category: "presence",
    label: "Presence",
    emoji: "📵",
    question: "When you're together, how often are you fully present — phone down, mind here?",
    options: [
      { value: 1, label: "Rarely" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "About half the time" },
      { value: 4, label: "Most of the time" },
      { value: 5, label: "Almost always" },
    ],
  },
  {
    category: "awareness",
    label: "Awareness",
    emoji: "🗓️",
    question: "How well do you keep track of the important dates and moments in her life?",
    options: [
      { value: 1, label: "I often forget" },
      { value: 2, label: "I remember the big ones" },
      { value: 3, label: "I remember most things" },
      { value: 4, label: "I rarely forget anything" },
      { value: 5, label: "I always remember" },
    ],
  },
  {
    category: "priority",
    label: "Priority",
    emoji: "⭐",
    question: "How often does she feel like a genuine priority in your life — not just in theory?",
    options: [
      { value: 1, label: "Rarely" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Often" },
      { value: 4, label: "Most of the time" },
      { value: 5, label: "Always" },
    ],
  },
  {
    category: "appreciation",
    label: "Appreciation",
    emoji: "🙏",
    question: "How often do you express genuine appreciation for what she does — not just assume she knows?",
    options: [
      { value: 1, label: "Rarely" },
      { value: 2, label: "Sometimes" },
      { value: 3, label: "Often" },
      { value: 4, label: "Most days" },
      { value: 5, label: "Every day" },
    ],
  },
];

const CATEGORY_FEEDBACK = {
  attentiveness: {
    low: "She often feels unseen. Small shifts in attention can change everything.",
    mid: "You notice more than most — there's still room to go deeper.",
    high: "You're tuned in. Keep that awareness sharp.",
  },
  gestures: {
    low: "Unexpected gestures are relationship fuel. Start small — it adds up.",
    mid: "You show up sometimes. Consistency is what she'll remember.",
    high: "You understand that actions speak. Keep going.",
  },
  presence: {
    low: "Being physically there isn't the same as being present. She notices.",
    mid: "You're getting there. The moments you're fully present matter most.",
    high: "Full presence is rare. You're giving her something real.",
  },
  awareness: {
    low: "Forgetting important dates sends a signal — even if you don't mean it.",
    mid: "You remember what matters most. Let's sharpen the rest.",
    high: "You pay attention to her world. That's one of the most loving things you can do.",
  },
  priority: {
    low: "She may feel she comes last. It's worth asking yourself why.",
    mid: "You prioritise her when it counts — but she may want to feel it more consistently.",
    high: "She knows she matters to you. That's the foundation of everything.",
  },
  appreciation: {
    low: "Gratitude unexpressed is gratitude unfelt. Say it out loud.",
    mid: "You appreciate her — make sure she hears it more often.",
    high: "You make her feel seen and valued. Don't stop.",
  },
};

function getFeedback(category, value) {
  if (value <= 2) return CATEGORY_FEEDBACK[category].low;
  if (value <= 3) return CATEGORY_FEEDBACK[category].mid;
  return CATEGORY_FEEDBACK[category].high;
}

function getScoreColor(value) {
  if (value <= 2) return T.red;
  if (value <= 3) return T.accent;
  return T.green;
}

export default function SelfAssessmentScreen({ onDone, onSkip }) {
  const [step, setStep] = useState(0); // 0 = intro, 1-6 = vragen, 7 = resultaat
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);

  const totalQuestions = QUESTIONS.length;
  const currentQuestion = QUESTIONS[step - 1];

  function selectAnswer(category, value) {
    setAnswers((a) => ({ ...a, [category]: value }));
  }

  async function saveAndFinish() {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("assessments").insert({
        user_id: user.id,
        attentiveness: answers.attentiveness,
        gestures: answers.gestures,
        presence: answers.presence,
        awareness: answers.awareness,
        priority: answers.priority,
        appreciation: answers.appreciation,
      });

      const { data: existing } = await supabase
        .from("user_preferences")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        await supabase.from("user_preferences")
          .update({ assessment_completed_at: new Date().toISOString() })
          .eq("user_id", user.id);
      } else {
        await supabase.from("user_preferences")
          .insert({ user_id: user.id, assessment_completed_at: new Date().toISOString() });
      }

      onDone(answers);
    } catch (err) {
      console.error("saveAssessment error:", err);
    } finally {
      setSaving(false);
    }
  }

  async function handleSkip() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: existing } = await supabase
        .from("user_preferences")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        await supabase.from("user_preferences")
          .update({ onboarding_skipped_assessment: true })
          .eq("user_id", user.id);
      } else {
        await supabase.from("user_preferences")
          .insert({ user_id: user.id, onboarding_skipped_assessment: true });
      }
    } catch (err) {
      console.error("handleSkip error:", err);
    }
    onSkip();
  }

  // Intro scherm
  if (step === 0) {
    return (
      <div style={{ ...css.page, justifyContent: "center" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🪞</div>
          <div style={{ fontSize: 22, color: T.accent, fontStyle: "italic", letterSpacing: 1, marginBottom: 12 }}>
            Know yourself first
          </div>
          <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.8, maxWidth: 320, margin: "0 auto" }}>
            6 honest questions. 2 minutes. The results help us send you tips that actually fit your relationship — not generic advice.
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          {QUESTIONS.map((q, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{ fontSize: 20, width: 32, textAlign: "center" }}>{q.emoji}</div>
              <div style={{ fontSize: 13, color: T.muted }}>{q.label}</div>
            </div>
          ))}
        </div>

        <button style={css.btn} onClick={() => setStep(1)}>Start assessment</button>
        <button style={{ ...css.btnGhost, marginTop: 10 }} onClick={handleSkip}>Skip for now</button>
      </div>
    );
  }

  // Resultaatscherm
  if (step === totalQuestions + 1) {
    const categories = QUESTIONS.map((q) => q.category);
    const total = categories.reduce((sum, cat) => sum + (answers[cat] || 0), 0);
    const max = totalQuestions * 5;
    const percentage = Math.round((total / max) * 100);

    return (
      <div style={{ ...css.page }}>
        <div style={{ padding: "32px 0 16px", textAlign: "center" }}>
          <div style={{ fontSize: 13, color: T.muted, letterSpacing: 3, textTransform: "uppercase", marginBottom: 8 }}>Your results</div>
          <div style={{ fontSize: 48, color: T.accent, fontWeight: "bold", marginBottom: 4 }}>{percentage}%</div>
          <div style={{ fontSize: 13, color: T.muted }}>overall attentiveness score</div>
        </div>

        <div style={{ padding: "0 0 24px" }}>
          {QUESTIONS.map((q) => {
            const val = answers[q.category] || 0;
            const feedback = getFeedback(q.category, val);
            const color = getScoreColor(val);
            return (
              <div key={q.category} style={css.card}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>{q.emoji}</span>
                    <span style={{ fontSize: 13, color: T.text, fontWeight: "bold" }}>{q.label}</span>
                  </div>
                  <div style={{ fontSize: 13, color, fontWeight: "bold" }}>{val}/5</div>
                </div>
                <div style={{ height: 4, background: T.border, borderRadius: 2, marginBottom: 8 }}>
                  <div style={{ height: 4, width: `${(val / 5) * 100}%`, background: color, borderRadius: 2, transition: "width 0.4s" }} />
                </div>
                <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>{feedback}</div>
              </div>
            );
          })}
        </div>

        <div style={{ padding: "0 0 40px" }}>
          <button
            style={{ ...css.btn, opacity: saving ? 0.6 : 1 }}
            onClick={saveAndFinish}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save & continue"}
          </button>
        </div>
      </div>
    );
  }

  // Vraagscherm
  const answered = answers[currentQuestion.category];
  const progress = ((step - 1) / totalQuestions) * 100;

  return (
    <div style={{ ...css.page }}>
      {/* Progress bar */}
      <div style={{ height: 2, background: T.border, margin: "24px 0 32px" }}>
        <div style={{ height: 2, width: `${progress}%`, background: T.accent, transition: "width 0.3s" }} />
      </div>

      <div style={{ fontSize: 11, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
        {step} of {totalQuestions} — {currentQuestion.label}
      </div>

      <div style={{ fontSize: 32, marginBottom: 16 }}>{currentQuestion.emoji}</div>

      <div style={{ fontSize: 18, color: T.text, lineHeight: 1.6, marginBottom: 32, minHeight: 80 }}>
        {currentQuestion.question}
      </div>

      <div style={{ marginBottom: 32 }}>
        {currentQuestion.options.map((opt) => {
          const selected = answered === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => selectAnswer(currentQuestion.category, opt.value)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "14px 18px",
                marginBottom: 8,
                background: selected ? T.accentSoft : T.card,
                border: `1px solid ${selected ? T.accent : T.border}`,
                borderRadius: 12,
                color: selected ? T.accent : T.text,
                fontSize: 14,
                cursor: "pointer",
                fontFamily: "Georgia, serif",
                transition: "all 0.15s",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        {step > 1 && (
          <button style={{ ...css.btnGhost, flex: 1 }} onClick={() => setStep((s) => s - 1)}>
            Back
          </button>
        )}
        <button
          style={{ ...css.btn, flex: 2, opacity: answered ? 1 : 0.4 }}
          onClick={() => answered && setStep((s) => s + 1)}
          disabled={!answered}
        >
          {step === totalQuestions ? "See my results" : "Next"}
        </button>
      </div>

      <button style={{ ...css.btnGhost, marginTop: 10 }} onClick={handleSkip}>
        Skip assessment
      </button>
    </div>
  );
}
