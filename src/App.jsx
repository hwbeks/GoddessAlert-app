import { supabase } from "./supabase";
import { stripePromise, PRICES } from "./stripe";
import { useState, useEffect } from "react";

const T = {
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

const css = {
  app: {
    background: T.bg,
    minHeight: "100vh",
    fontFamily: "'Georgia', serif",
    color: T.text,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  page: {
    width: "100%",
    maxWidth: 420,
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: "0 24px",
    boxSizing: "border-box",
  },
  input: {
    width: "100%",
    background: "#111",
    border: `1px solid ${T.border}`,
    borderRadius: 12,
    padding: "14px 16px",
    color: T.text,
    fontSize: 15,
    fontFamily: "Georgia, serif",
    boxSizing: "border-box",
    outline: "none",
    marginBottom: 12,
  },
  btn: {
    width: "100%",
    background: T.accent,
    color: "#0d0d0d",
    border: "none",
    borderRadius: 30,
    padding: "15px",
    fontWeight: "bold",
    fontSize: 15,
    cursor: "pointer",
    fontFamily: "Georgia, serif",
    letterSpacing: 0.5,
  },
  btnGhost: {
    width: "100%",
    background: "transparent",
    color: T.muted,
    border: `1px solid ${T.border}`,
    borderRadius: 30,
    padding: "14px",
    fontSize: 14,
    cursor: "pointer",
    fontFamily: "Georgia, serif",
  },
  label: {
    fontSize: 12,
    color: T.muted,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 8,
    display: "block",
  },
  card: {
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 16,
    padding: "16px 18px",
    marginBottom: 10,
  },
  cardAccent: {
    background: T.card,
    border: `1px solid ${T.accent}`,
    borderRadius: 16,
    padding: "16px 18px",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    color: T.muted,
    letterSpacing: 3,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  nav: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#111",
    borderTop: `1px solid ${T.border}`,
    display: "flex",
    justifyContent: "space-around",
    padding: "10px 0 18px",
    zIndex: 100,
  },
  modal: {
    position: "fixed",
    inset: 0,
    background: "#000000cc",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    zIndex: 200,
  },
  modalBox: {
    background: "#1a1a1a",
    borderRadius: "24px 24px 0 0",
    padding: "28px 24px 48px",
    width: "100%",
    maxWidth: 420,
    border: `1px solid ${T.border}`,
    boxSizing: "border-box",
  },
};

function daysUntil(dateStr: string): number {
  const today: Date = new Date();
  const target: Date = new Date(dateStr + "T00:00:00");
  target.setFullYear(today.getFullYear());
  if (
    target.getMonth() === today.getMonth() &&
    target.getDate() === today.getDate()
  ) return 0;
  if (target < today) target.setFullYear(today.getFullYear() + 1);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

// ─── SCREENS ───────────────────────────────────────────────

function LoginScreen({ onNext }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMagicLink() {
    if (!email) return;
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  }

  return (
    <div style={{ ...css.page, justifyContent: "center", gap: 0 }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div
          style={{
            fontSize: 11,
            color: T.muted,
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          welcome to
        </div>
        <div
          style={{
            fontSize: 42,
            color: T.accent,
            fontStyle: "italic",
            letterSpacing: 2,
          }}
        >
          GoddessAlert
        </div>
        <div
          style={{
            fontSize: 13,
            color: T.muted,
            marginTop: 8,
            letterSpacing: 1,
          }}
        >
          She notices everything. Now, so do you.
        </div>
      </div>

      {!sent ? (
        <>
          <div style={{ marginBottom: 6 }}>
            <label style={css.label}>Your email address</label>
            <input
              style={css.input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error && (
            <div
              style={{
                fontSize: 13,
                color: T.red,
                marginBottom: 12,
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}
          <button
            style={{ ...css.btn, opacity: loading ? 0.6 : 1 }}
            onClick={sendMagicLink}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Magic Link"}
          </button>
          <div
            style={{
              textAlign: "center",
              marginTop: 14,
              fontSize: 11,
              color: T.muted,
              lineHeight: 1.8,
            }}
          >
            We'll send you a one-click login link. No password needed.
            <br />
            By continuing you agree to our{" "}
           <a href="https://goddessalert.com/terms.html" style={{ color: T.accent, textDecoration: "underline" }} target="_blank" rel="noreferrer">Terms of Use</a>{" "}
            and{" "}
            <a href="https://goddessalert.com/privacy.html" style={{ color: T.accent, textDecoration: "underline" }} target="_blank" rel="noreferrer">Privacy Policy</a>
            .
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📬</div>
          <div style={{ fontSize: 18, color: T.accent, marginBottom: 8 }}>
            Check your inbox
          </div>
          <div
            style={{
              fontSize: 13,
              color: T.muted,
              lineHeight: 1.7,
              marginBottom: 28,
            }}
          >
            We sent a magic link to
            <br />
            <span style={{ color: T.text }}>{email}</span>
            <br />
            Click it to sign in — no password needed.
          </div>
          <button
            style={{ ...css.btnGhost, marginTop: 10 }}
            onClick={() => setSent(false)}
          >
            Use a different email
          </button>
        </div>
      )}
    </div>
  );
}
function OnboardingScreen({ onDone }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    herName: "",
    herBirthday: "",
    anniversary: "",
    alertDays: 7,
  });

  const [saving, setSaving] = useState(false);

  async function saveAndContinue() {
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("users").upsert({ id: user.id, email: user.email });
      await supabase.from("partners").upsert({
        user_id: user.id,
        name: data.herName.charAt(0).toUpperCase() + data.herName.slice(1),
        birthday: data.herBirthday || null,
      });
      if (data.herBirthday)
        await supabase.from("events").upsert({
          user_id: user.id,
          name: `${
            data.herName.charAt(0).toUpperCase() + data.herName.slice(1)
          }'s Birthday`,
          date: data.herBirthday,
          days_before: data.alertDays,
          emoji: "🎂",
          category: "birthday",
        });
      if (data.anniversary)
        await supabase.from("events").upsert({
          user_id: user.id,
          name: "Anniversary",
          date: data.anniversary,
          days_before: data.alertDays,
          emoji: "💍",
          category: "anniversary",
        });
    }
    setSaving(false);
    onDone(data);
  }
  const steps = [
    {
      emoji: "👋",
      title: "Let's set things up",
      subtitle: "Takes about 60 seconds. She'll never know.",
      field: (
        <>
          <label style={css.label}>What's her name?</label>
          <input
            style={css.input}
            placeholder="e.g. Emma"
            value={data.herName}
            onChange={(e) =>
              setData((d) => ({ ...d, herName: e.target.value }))
            }
          />
        </>
      ),
      canNext: data.herName.length > 0,
    },
    {
      emoji: "🎂",
      title: `When is ${data.herName || "her"} birthday?`,
      subtitle: "We'll remind you well before it sneaks up on you.",
      field: (
        <>
          <label style={css.label}>Her birthday</label>
          <input
            style={css.input}
            type="date"
            value={data.herBirthday}
            onChange={(e) =>
              setData((d) => ({ ...d, herBirthday: e.target.value }))
            }
          />
        </>
      ),
      canNext: data.herBirthday.length > 0,
    },
    {
      emoji: "💍",
      title: "Your anniversary?",
      subtitle: "The date she definitely remembers. Make sure you do too.",
      field: (
        <>
          <label style={css.label}>Anniversary date</label>
          <input
            style={css.input}
            type="date"
            value={data.anniversary}
            onChange={(e) =>
              setData((d) => ({ ...d, anniversary: e.target.value }))
            }
          />
          <button
            style={{ ...css.btnGhost, marginBottom: 12 }}
            onClick={() => setStep((s) => s + 1)}
          >
            Skip for now
          </button>
        </>
      ),
      canNext: true,
    },
    {
      emoji: "⏰",
      title: "How early should we warn you?",
      subtitle: "You can change this per event later.",
      field: (
        <>
          <label style={css.label}>Alert me this many days before</label>
          <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
            {[3, 7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setData((x) => ({ ...x, alertDays: d }))}
                style={{
                  flex: 1,
                  background: data.alertDays === d ? T.accent : T.accentSoft,
                  color: data.alertDays === d ? "#0d0d0d" : T.text,
                  border: `1px solid ${
                    data.alertDays === d ? T.accent : T.border
                  }`,
                  borderRadius: 12,
                  padding: "14px 4px",
                  fontSize: 14,
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontFamily: "Georgia, serif",
                }}
              >
                {d}d
              </button>
            ))}
          </div>
        </>
      ),
      canNext: true,
    },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div style={{ ...css.page, justifyContent: "center" }}>
      {/* Progress dots */}
      <div
        style={{
          display: "flex",
          gap: 6,
          justifyContent: "center",
          marginBottom: 40,
        }}
      >
        {steps.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === step ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: i <= step ? T.accent : T.border,
              transition: "all 0.3s ease",
            }}
          />
        ))}
      </div>

      {/* Step content */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{current.emoji}</div>
        <div
          style={{
            fontSize: 22,
            fontWeight: "bold",
            color: T.text,
            marginBottom: 8,
          }}
        >
          {current.title}
        </div>
        <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.6 }}>
          {current.subtitle}
        </div>
      </div>

      {current.field}

      <button
        style={{ ...css.btn, opacity: current.canNext && !saving ? 1 : 0.4 }}
        onClick={() =>
          current.canNext &&
          (isLast ? saveAndContinue() : setStep((s) => s + 1))
        }
      >
        {saving ? "Saving..." : isLast ? "Let's go →" : "Continue →"}
      </button>
    </div>
  );
}

function MainApp({ partnerData }) {
  // ── derive name first, before any hooks that reference it ──
  const name = partnerData?.herName
    ? partnerData.herName.charAt(0).toUpperCase() + partnerData.herName.slice(1)
    : "her";

  // ── all hooks up front ──
  const [tab, setTab] = useState("home");
 const [score, setScore] = useState(50);
const [scoreLoaded, setScoreLoaded] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
const [showAddReminder, setShowAddReminder] = useState(false);
const [showTheCode, setShowTheCode] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    daysBefore: 7,
  });
  const [newReminder, setNewReminder] = useState({
    title: "",
    date: "",
    time: "",
    repeat: "never",
  });

  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function loadEvents() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("events")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: true });
        if (data) setEvents(data);
      }
    }
    loadEvents();
  }, []);
  useEffect(() => {
  async function calculateScore() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let score = 50;

    // Weekly check-ins
    const { data: checkins } = await supabase
      .from("health_scores")
      .select("score")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(4);

    if (checkins) {
      for (const c of checkins) {
        if (c.score >= 4) score += 10;
        else if (c.score === 3) score += 5;
        else if (c.score === 2) score += 0;
        else if (c.score <= 1) score -= 5;
      }
    }

    // Reminders
    const { data: reminders } = await supabase
      .from("reminders")
      .select("done")
      .eq("user_id", user.id);

    if (reminders) {
      for (const r of reminders) {
        if (r.done) score += 5;
        else score -= 3;
      }
    }

    // Tip ratings
    const { data: ratings } = await supabase
      .from("tip_ratings")
      .select("rating")
      .eq("user_id", user.id);

    if (ratings) {
      for (const r of ratings) {
        if (r.rating === 1) score += 2;
      }
    }

    score = Math.max(0, Math.min(100, score));
    setScore(score);
    setScoreLoaded(true);
  }
  calculateScore();
}, []);
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    async function loadReminders() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("reminders")
          .select("*")
          .eq("user_id", user.id)
          .order("date", { ascending: true });
        if (data) setReminders(data);
      }
    }
    loadReminders();
  }, []);
  const [gestureDone, setGestureDone] = useState(false);
  const [gestureRating, setGestureRating] = useState(null);
  const [tipIndex, setTipIndex] = useState(0);
  const [showRatingThanks, setShowRatingThanks] = useState(false);
  const [weeklyRating, setWeeklyRating] = useState(null);
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(false);
  const [notifyDay, setNotifyDay] = useState("monday");
  const [notifyTime, setNotifyTime] = useState("09:00");

  // ── derived values ──
  const [tips, setTips] = useState([]);

  useEffect(() => {
    async function loadTips() {
      const { data } = await supabase
        .from("tips")
        .select("*")
        .eq("status", "active")
        .eq("category", "partner");
      if (data) setTips(data);
    }
    loadTips();
  }, []);

  const currentTip = tips.length > 0 ? tips[tipIndex % tips.length] : null;

  async function rateTip(rating) {
    setGestureRating(rating);
    setShowRatingThanks(true);

    // Sla rating op in database
    if (currentTip) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Sla rating op in tip_ratings tabel
        await supabase.from("tip_ratings").upsert({
          user_id: user.id,
          tip_id: currentTip.id,
          rating: rating,
        });

        // Update score op de tip zelf
        if (rating === "up") {
          await supabase
            .from("tips")
            .update({ thumbs_up: (currentTip.thumbs_up || 0) + 1 })
            .eq("id", currentTip.id);
        } else {
          await supabase
            .from("tips")
            .update({ thumbs_down: (currentTip.thumbs_down || 0) + 1 })
            .eq("id", currentTip.id);
        }
      }
    }

    setTimeout(() => {
      setShowRatingThanks(false);
      setGestureRating(null);
      setGestureDone(false);
      setTipIndex((i) => i + 1);
    }, 1800);
  }

  const healthScore = Math.min(
    100,
    score + (gestureDone || showRatingThanks ? 12 : 0)
  );
  const scoreColor =
    healthScore >= 70 ? T.green : healthScore >= 40 ? T.accent : T.red;

  async function handleUpgrade(plan) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const userEmail = user?.email || "";

    const priceId =
      plan === "yearly"
        ? "price_1TKHvN5ueCdcfjYzBJ6C9PQb"
        : "price_1TKHw75ueCdcfjYzQJuatIR0";

    const { data, error } = await supabase.functions.invoke("bright-worker", {
      body: {
        action: "create-checkout",
        priceId: priceId,
        email: userEmail,
        successUrl: window.location.origin + "?upgraded=true",
        cancelUrl: window.location.origin,
      },
    });

    if (data?.url) {
      window.location.href = data.url;
    } else {
      console.error("Stripe error:", error);
    }
  }
  function addEvent() {
    if (!newEvent.name || !newEvent.date) return;
    setEvents((e) => [...e, { ...newEvent, id: Date.now(), emoji: "📅" }]);
    setNewEvent({ name: "", date: "", daysBefore: 7 });
    setShowAddModal(false);
  }

  async function addReminder() {
    if (!newReminder.title || !newReminder.date || !newReminder.time) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("reminders")
        .insert({
          user_id: user.id,
          title: newReminder.title,
          date: newReminder.date,
          time: newReminder.time,
          repeat: newReminder.repeat,
          done: false,
        })
        .select()
        .single();
      if (data) setReminders((r) => [...r, data]);
    }
    setNewReminder({ title: "", date: "", time: "", repeat: "never" });
    setShowAddReminder(false);
  }

  async function toggleReminder(id) {
  const newDone = !reminders.find((x) => x.id === id)?.done;
  setReminders((r) =>
    r.map((x) => (x.id === id ? { ...x, done: newDone } : x))
  );
  await supabase
    .from("reminders")
    .update({ done: newDone })
    .eq("id", id);
}

  return (
    <div style={{ width: "100%", maxWidth: 420, paddingBottom: 80 }}>
      {/* Header */}
      <div
        style={{
          padding: "32px 24px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 22,
              color: T.accent,
              fontStyle: "italic",
              letterSpacing: 1,
            }}
          >
            GoddessAlert
          </div>
          <div
            style={{
              fontSize: 11,
              color: T.muted,
              letterSpacing: 2,
              textTransform: "uppercase",
              marginTop: 2,
            }}
          >
            for attentive men
          </div>
        </div>
        <div
          onClick={() => setShowScoreModal(true)}
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            border: `3px solid ${T.accent}`,
            background: T.accentSoft,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: T.accent,
              lineHeight: 1,
            }}
          >
            {healthScore}
          </div>
          <div
            style={{
              fontSize: 8,
              color: T.muted,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            score
          </div>
        </div>
      </div>

      {/* Trial Banner */}
      <div style={{ padding: "0 24px 8px" }}>
        <div
          style={{
            background: "linear-gradient(135deg, #1a1200, #0d0d0d)",
            border: `1px solid ${T.premium}`,
            borderRadius: 16,
            padding: "14px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: "bold", color: T.premium }}>
              Premium Trial Active
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>
              5 days remaining
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button
                  onClick={() => handleUpgrade("monthly")}
                  style={{
                    flex: 1,
                    background: T.accent,
                    color: "#0d0d0d",
                    border: "none",
                    borderRadius: 20,
                    padding: "8px 14px",
                    fontWeight: "bold",
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  €4,99/maand
                </button>
                <button
                  onClick={() => handleUpgrade("yearly")}
                  style={{
                    flex: 1,
                    background: "transparent",
                    color: T.accent,
                    border: `1px solid ${T.accent}`,
                    borderRadius: 20,
                    padding: "8px 14px",
                    fontWeight: "bold",
                    fontSize: 12,
                    cursor: "pointer",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  €29,99/jaar
                </button>
              </div>
            </div>
          </div>
          <div
            style={{
              background: T.premium,
              color: "#0d0d0d",
              fontSize: 10,
              fontWeight: "bold",
              padding: "4px 10px",
              borderRadius: 20,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            7-day trial
          </div>
        </div>
      </div>

      {/* HOME TAB */}
      {tab === "home" && (
        <div style={{ padding: "8px 24px" }}>
          <div style={css.sectionTitle}>Weekly Check-in</div>
          <div style={weeklyRating ? css.cardAccent : css.card}>
            <div
              style={{
                fontSize: 14,
                color: T.accent,
                fontStyle: "italic",
                marginBottom: 10,
              }}
            >
              "How attentive were you this week?"
            </div>
            {!weeklyRating ? (
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { label: "😬", sub: "Poor", val: "poor", pts: -8 },
                  { label: "😐", sub: "OK", val: "ok", pts: 0 },
                  { label: "😊", sub: "Good", val: "good", pts: 8 },
                  { label: "🔥", sub: "Great", val: "great", pts: 16 },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => {
                      setWeeklyRating(opt.val);
                      setScore((s) => Math.min(100, Math.max(0, s + opt.pts)));
                    }}
                    style={{
                      flex: 1,
                      background: T.accentSoft,
                      border: `1px solid ${T.border}`,
                      borderRadius: 12,
                      padding: "10px 4px",
                      color: T.text,
                      cursor: "pointer",
                      fontFamily: "Georgia, serif",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{opt.label}</span>
                    <span style={{ fontSize: 11, color: T.muted }}>
                      {opt.sub}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontSize: 15, color: T.text }}>
                    {weeklyRating === "poor" && "😬 You rated: Poor"}
                    {weeklyRating === "ok" && "😐 You rated: OK"}
                    {weeklyRating === "good" && "😊 You rated: Good"}
                    {weeklyRating === "great" && "🔥 You rated: Great"}
                  </div>
                  <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>
                    {weeklyRating === "poor" &&
                      "Small steps. Start with today's tip."}
                    {weeklyRating === "ok" &&
                      "Solid start. Push a little harder this week."}
                    {weeklyRating === "good" &&
                      "She notices. Keep the momentum going."}
                    {weeklyRating === "great" &&
                      "That's the standard. Don't let it slip."}
                  </div>
                </div>
                <button
                  onClick={() => setWeeklyRating(null)}
                  style={{
                    background: "transparent",
                    border: `1px solid ${T.border}`,
                    borderRadius: 20,
                    padding: "5px 12px",
                    color: T.muted,
                    fontSize: 11,
                    cursor: "pointer",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  Redo
                </button>
              </div>
            )}
          </div>

          <div style={{ ...css.sectionTitle, marginTop: 16 }}>
            Today's Gesture
          </div>

          {/* STATE 1: Tip available — not yet done */}
          {!gestureDone &&
            !showRatingThanks &&
            tipIndex === 0 &&
            currentTip && (
              <div
                style={{
                  background: "linear-gradient(135deg, #1a1600, #161616)",
                  border: `1px solid ${T.accent}44`,
                  borderRadius: 16,
                  padding: "20px 18px",
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      color: T.accent,
                      fontStyle: "italic",
                    }}
                  >
                    ✦ Daily Attention Tip
                  </div>
                  <div
                    style={{ fontSize: 10, color: T.muted, letterSpacing: 1 }}
                  >
                    #{tipIndex + 1}
                  </div>
                </div>
                <div style={{ fontSize: 14, color: T.text, lineHeight: 1.7 }}>
                  {currentTip.content}
                </div>
                <button
                  style={{
                    marginTop: 14,
                    background: T.accent,
                    color: "#0d0d0d",
                    border: "none",
                    borderRadius: 30,
                    padding: "8px 22px",
                    fontWeight: "bold",
                    fontSize: 13,
                    cursor: "pointer",
                    fontFamily: "Georgia, serif",
                  }}
                  onClick={() => setGestureDone(true)}
                >
                  Mark as done
                </button>
              </div>
            )}

          {/* STATE 2: Done — show crossed-out tip + rating prompt */}
          {gestureDone && !showRatingThanks && (
            <div
              style={{
                background: "linear-gradient(135deg, #1a1600, #161616)",
                border: `1px solid ${T.accent}44`,
                borderRadius: 16,
                padding: "20px 18px",
                marginBottom: 10,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  color: T.accent,
                  fontStyle: "italic",
                  marginBottom: 8,
                }}
              >
                ✦ Daily Attention Tip
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: T.muted,
                  lineHeight: 1.7,
                  textDecoration: "line-through",
                }}
              >
                {currentTip.content}
              </div>
              <div style={{ marginTop: 14 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#ffffff08",
                    borderRadius: 12,
                    padding: "12px 14px",
                  }}
                >
                  <div style={{ fontSize: 13, color: T.muted }}>
                    Was this tip useful?
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() => rateTip("up")}
                      style={{
                        background: "#ffffff10",
                        border: `1px solid ${T.border}`,
                        borderRadius: 20,
                        padding: "6px 14px",
                        fontSize: 16,
                        cursor: "pointer",
                      }}
                    >
                      👍
                    </button>
                    <button
                      onClick={() => rateTip("down")}
                      style={{
                        background: "#ffffff10",
                        border: `1px solid ${T.border}`,
                        borderRadius: 20,
                        padding: "6px 14px",
                        fontSize: 16,
                        cursor: "pointer",
                      }}
                    >
                      👎
                    </button>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: T.muted,
                    marginTop: 8,
                    textAlign: "center",
                  }}
                >
                  Your feedback helps us improve the tips
                </div>
              </div>
            </div>
          )}

          {/* STATE 3: Rating submitted — brief thank you */}
          {showRatingThanks && (
            <div
              style={{
                background: "linear-gradient(135deg, #1a1600, #161616)",
                border: `1px solid ${T.accent}44`,
                borderRadius: 16,
                padding: "28px 18px",
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 8 }}>
                {gestureRating === "up" ? "🙌" : "📝"}
              </div>
              <div
                style={{
                  fontSize: 14,
                  color: gestureRating === "up" ? T.green : T.muted,
                }}
              >
                {gestureRating === "up"
                  ? "Great — more like this coming!"
                  : "Noted — we'll do better."}
              </div>
            </div>
          )}

          {/* STATE 4: Rated & cleared — empty state with countdown */}
          {!gestureDone && !showRatingThanks && tipIndex > 0 && (
            <div
              style={{
                background: T.card,
                border: `1px solid ${T.border}`,
                borderRadius: 16,
                padding: "28px 18px",
                marginBottom: 10,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
              <div
                style={{
                  fontSize: 15,
                  color: T.accent,
                  fontStyle: "italic",
                  marginBottom: 6,
                }}
              >
                You're all caught up
              </div>
              <div style={{ fontSize: 13, color: T.muted, marginBottom: 16 }}>
                Your next tip arrives in
              </div>
              <div
                style={{
                  display: "inline-flex",
                  gap: 8,
                  alignItems: "center",
                  background: T.accentSoft,
                  border: `1px solid ${T.accent}44`,
                  borderRadius: 12,
                  padding: "12px 20px",
                }}
              >
                {[
                  { val: "18", label: "hrs" },
                  { val: ":", label: null },
                  { val: "24", label: "min" },
                  { val: ":", label: null },
                  { val: "07", label: "sec" },
                ].map((seg, i) =>
                  seg.label === null ? (
                    <div
                      key={i}
                      style={{
                        fontSize: 22,
                        color: T.accent,
                        fontWeight: "bold",
                        paddingBottom: 14,
                      }}
                    >
                      :
                    </div>
                  ) : (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div
                        style={{
                          fontSize: 26,
                          fontWeight: "bold",
                          color: T.accent,
                          fontFamily: "monospace",
                        }}
                      >
                        {seg.val}
                      </div>
                      <div
                        style={{
                          fontSize: 9,
                          color: T.muted,
                          textTransform: "uppercase",
                          letterSpacing: 1,
                        }}
                      >
                        {seg.label}
                      </div>
                    </div>
                  )
                )}
              </div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 14 }}>
                One tip per day keeps the relationship strong 💛
              </div>
            </div>
          )}

          {/* Upcoming alert preview */}
          {events
            .filter((e) => daysUntil(e.date) <= 14)
            .slice(0, 1)
            .map((ev) => (
              <div key={ev.id} style={{ ...css.cardAccent, marginTop: 8 }}>
                <div
                  style={{
                    fontSize: 11,
                    color: T.red,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  ⚡ Coming up
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div style={{ fontSize: 28 }}>{ev.emoji}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: "bold" }}>
                        {ev.name}
                      </div>
                      <div
                        style={{ fontSize: 12, color: T.muted, marginTop: 2 }}
                      >
                        Don't wait — plan something now
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: "bold",
                        color: daysUntil(ev.date) <= 3 ? T.red : T.accent,
                      }}
                    >
                      {daysUntil(ev.date) === 0 ? "🎉" : daysUntil(ev.date)}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: T.muted,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      {daysUntil(ev.date) === 0 ? "TODAY!" : "days"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* EVENTS TAB */}
      {tab === "events" && (
        <div style={{ padding: "8px 24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div style={css.sectionTitle}>Upcoming Events</div>
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                background: T.accent,
                color: "#0d0d0d",
                border: "none",
                borderRadius: 20,
                padding: "5px 14px",
                fontWeight: "bold",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "Georgia, serif",
              }}
            >
              + Add
            </button>
          </div>
          {events.map((ev) => {
            const days = daysUntil(ev.date);
            return (
              <div key={ev.id} style={days <= 7 ? css.cardAccent : css.card}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div style={{ fontSize: 28 }}>{ev.emoji}</div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: "bold" }}>
                        {ev.name}
                      </div>
                      <div
                        style={{ fontSize: 12, color: T.muted, marginTop: 2 }}
                      >
                        Alert: {ev.daysBefore} days before
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: "bold",
                        color:
                          days <= 3 ? T.red : days <= 7 ? T.accent : T.green,
                      }}
                    >
                      {days}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: T.muted,
                        textTransform: "uppercase",
                        letterSpacing: 1,
                      }}
                    >
                      days
                    </div>
                  </div>
                </div>
                {days <= 7 && (
                  <div
                    style={{
                      marginTop: 10,
                      padding: "8px 12px",
                      background: T.red + "15",
                      borderRadius: 8,
                      fontSize: 12,
                      color: T.red,
                    }}
                  >
                    {daysUntil(ev.date) === 0
                      ? "🎉 Today is the day! Don't forget to make it special."
                      : "⚡ Action needed — don't wait any longer"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* REMINDERS TAB */}
      {tab === "reminders" && (
        <div style={{ padding: "8px 24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div style={css.sectionTitle}>My Reminders</div>
            <button
              onClick={() => setShowAddReminder(true)}
              style={{
                background: T.accent,
                color: "#0d0d0d",
                border: "none",
                borderRadius: 20,
                padding: "5px 14px",
                fontWeight: "bold",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "Georgia, serif",
              }}
            >
              + Add
            </button>
          </div>

          {/* Pending */}
          {reminders.filter((r) => !r.done).length === 0 && (
            <div
              style={{ ...css.card, textAlign: "center", padding: "28px 18px" }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
              <div style={{ fontSize: 14, color: T.muted }}>
                All clear — nothing pending
              </div>
            </div>
          )}
          {reminders
            .filter((r) => !r.done)
            .map((r) => (
              <div key={r.id} style={css.cardAccent}>
                <div
                  style={{ display: "flex", alignItems: "flex-start", gap: 12 }}
                >
                  <button
                    onClick={() => toggleReminder(r.id)}
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      flexShrink: 0,
                      border: `2px solid ${T.accent}`,
                      background: "transparent",
                      cursor: "pointer",
                      marginTop: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: "bold",
                        color: T.text,
                      }}
                    >
                      {r.title}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: 10,
                        marginTop: 6,
                        flexWrap: "wrap",
                      }}
                    >
                      <span style={{ fontSize: 12, color: T.muted }}>
                        📅{" "}
                        {new Date(r.date + "T00:00:00").toLocaleDateString(
                          "en-GB",
                          { day: "numeric", month: "short" }
                        )}
                      </span>
                      <span style={{ fontSize: 12, color: T.muted }}>
                        🕐 {r.time}
                      </span>
                      {r.repeat !== "never" && (
                        <span
                          style={{
                            fontSize: 11,
                            color: T.accent,
                            background: T.accentSoft,
                            padding: "2px 8px",
                            borderRadius: 10,
                            letterSpacing: 0.5,
                          }}
                        >
                          ↻ {r.repeat}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

          {/* Done */}
          {reminders.filter((r) => r.done).length > 0 && (
            <>
              <div style={{ ...css.sectionTitle, marginTop: 20 }}>
                Completed
              </div>
              {reminders
                .filter((r) => r.done)
                .map((r) => (
                  <div key={r.id} style={{ ...css.card, opacity: 0.5 }}>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <button
                        onClick={() => toggleReminder(r.id)}
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: "50%",
                          flexShrink: 0,
                          border: `2px solid ${T.green}`,
                          background: T.green + "33",
                          cursor: "pointer",
                          fontSize: 12,
                          color: T.green,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        ✓
                      </button>
                      <div
                        style={{
                          fontSize: 14,
                          color: T.muted,
                          textDecoration: "line-through",
                        }}
                      >
                        {r.title}
                      </div>
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      )}

      {/* SETTINGS TAB */}
      {tab === "settings" && (
        <div style={{ padding: "8px 24px" }}>
          {/* Notification channels */}
          <div style={css.sectionTitle}>How to notify me</div>
          <div style={css.card}>
            {[
              {
                label: "📧 Email reminders",
                sub: "Reliable — works on all devices",
                val: notifyEmail,
                set: setNotifyEmail,
              },
              {
                label: "🔔 Push notifications",
                sub: "Android & iPhone (home screen only)",
                val: notifyPush,
                set: setNotifyPush,
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: i === 0 ? 14 : 0,
                  marginBottom: i === 0 ? 14 : 0,
                  borderBottom: i === 0 ? `1px solid ${T.border}` : "none",
                }}
              >
                <div>
                  <div style={{ fontSize: 14, color: T.text }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>
                    {item.sub}
                  </div>
                </div>
                {/* Toggle */}
                <div
                  onClick={() => item.set((v) => !v)}
                  style={{
                    width: 44,
                    height: 24,
                    borderRadius: 12,
                    background: item.val ? T.accent : T.border,
                    position: "relative",
                    cursor: "pointer",
                    transition: "background 0.2s",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "#fff",
                      position: "absolute",
                      top: 3,
                      left: item.val ? 23 : 3,
                      transition: "left 0.2s",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Email info */}
          {notifyEmail && (
            <div
              style={{
                ...css.card,
                background: T.accentSoft,
                border: `1px solid ${T.accent}33`,
                marginBottom: 10,
              }}
            >
              <div style={{ fontSize: 12, color: T.accent, lineHeight: 1.6 }}>
                ✉️ Reminders will be sent to the email you signed in with. Make
                sure to check your spam folder the first time.
              </div>
            </div>
          )}

          {/* Push info */}
          {notifyPush && (
            <div
              style={{
                ...css.card,
                background: "#ffffff08",
                border: `1px solid ${T.border}`,
                marginBottom: 10,
              }}
            >
              <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>
                🔔 On iPhone, add GoddessAlert to your home screen first: tap
                Share → "Add to Home Screen". Then allow notifications when
                prompted.
              </div>
            </div>
          )}

          {/* Weekly check-in schedule */}
          <div style={{ ...css.sectionTitle, marginTop: 16 }}>
            Weekly check-in schedule
          </div>
          <div style={css.card}>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 12 }}>
              When should we nudge you to check in?
            </div>
            <label
              style={{
                fontSize: 12,
                color: T.muted,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 6,
                display: "block",
              }}
            >
              Day
            </label>
            <div
              style={{
                display: "flex",
                gap: 6,
                marginBottom: 14,
                flexWrap: "wrap",
              }}
            >
              {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((d) => (
                <button
                  key={d}
                  onClick={() => setNotifyDay(d)}
                  style={{
                    flex: 1,
                    minWidth: 36,
                    background: notifyDay === d ? T.accent : T.accentSoft,
                    color: notifyDay === d ? "#0d0d0d" : T.text,
                    border: `1px solid ${
                      notifyDay === d ? T.accent : T.border
                    }`,
                    borderRadius: 8,
                    padding: "8px 4px",
                    fontSize: 11,
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontFamily: "Georgia, serif",
                    textTransform: "capitalize",
                  }}
                >
                  {d}
                </button>
              ))}
            </div>
            <label
              style={{
                fontSize: 12,
                color: T.muted,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 6,
                display: "block",
              }}
            >
              Time
            </label>
            <input
              type="time"
              value={notifyTime}
              onChange={(e) => setNotifyTime(e.target.value)}
              style={{ ...css.input, marginBottom: 0 }}
            />
          </div>

          <button style={{ ...css.btn, marginTop: 8 }} onClick={() => {}}>
            Save preferences
          </button>

          {/* Legal */}
          <div style={{ ...css.sectionTitle, marginTop: 24 }}>Legal</div>
          <div style={css.card}>
            {[
              {
                label: "📄 Terms of Use",
                sub: "Your rights and responsibilities",
              },
              { label: "🔒 Privacy Policy", sub: "How we handle your data" },
              {
                label: "🗑️ Delete my account",
                sub: "Permanently remove all your data",
                color: T.red,
              },
            ].map((item, i, arr) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingBottom: i < arr.length - 1 ? 14 : 0,
                  marginBottom: i < arr.length - 1 ? 14 : 0,
                  borderBottom:
                    i < arr.length - 1 ? `1px solid ${T.border}` : "none",
                  cursor: "pointer",
                }}
              >
                <div>
                  <div style={{ fontSize: 14, color: item.color || T.text }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>
                    {item.sub}
                  </div>
                </div>
                <div style={{ fontSize: 16, color: T.muted }}>›</div>
              </div>
            ))}
          </div>

          <div
            style={{
              fontSize: 11,
              color: T.muted,
              textAlign: "center",
              marginTop: 12,
              marginBottom: 8,
              lineHeight: 1.6,
            }}
          >
            GoddessAlert v1.0 · By using this app you agree to our Terms of Use
            and Privacy Policy
         {/* The Code trigger */}
          {showTheCode ? (
            <div style={{ padding: "32px 8px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 11, color: T.accent, letterSpacing: 2, marginBottom: 20, textTransform: "uppercase" }}>The Code</div>
              {[
                ["I", "She talks to connect, not to complain.", "When she shares her day — frustrations included — that's not an attack. That's trust. Listen without fixing. Sometimes \"I hear you\" is the most powerful thing you can say."],
                ["II", "Your calm is her safety.", "She's not looking for a perfect man. She's looking for a man who doesn't fall apart when things get hard. Your stability — not your success, not your words — is what makes her feel safe with you."],
                ["III", "Don't fix it. Acknowledge it first.", "You're wired to solve problems. That's a strength. But sometimes she doesn't want a solution — she wants to feel understood. Ask first: \"Do you want me to listen, or do you want my take?\""],
                ["IV", "Small acts build deep connection.", "A hand on her back. Remembering how she takes her coffee. Asking how the conversation with her mother went. Grand gestures impress briefly. Small, consistent attention builds something that lasts."],
                ["V", "When she goes quiet, something matters.", "A woman who falls silent hasn't gone cold. She's waiting — without knowing it — to see if you'll notice. Notice. Not out of obligation. Out of choice."],
                ["VI", "Intimacy starts before the bedroom.", "For her, emotional safety comes before physical closeness. A day of real attention, a real conversation, a moment of genuine connection — that's foreplay. Remember that."],
                ["VII", "Stay yourself. That's what attracts her.", "A relationship needs the tension between two different people. Don't become her mirror. Keep your own interests, your own friends, your own direction. Two whole people make a stronger relationship than two halves that merge."],
              ].map(([num, title, body]) => (
                <div key={num} style={{ marginBottom: 24, textAlign: "left" }}>
                  <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2 }}>{num}</div>
                  <div style={{ fontSize: 13, color: T.accent, fontStyle: "italic", marginBottom: 6 }}>{title}</div>
                  <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>{body}</div>
                </div>
              ))}
            </div>
          ) : (
        <div style={{ textAlign: "center", paddingTop: 24, paddingBottom: 80 }}>
              <span
                onClick={() => setShowTheCode(true)}
                style={{ fontSize: 10, color: "#444444", cursor: "pointer", letterSpacing: 1 }}
              >
                · · ·
              </span>
            </div>
          )}
          </div>
        </div>
      )}

      {/* SCORE TAB */}
      {tab === "score" && (
        <div style={{ padding: "8px 24px" }}>
          <div style={css.sectionTitle}>Relationship Health</div>
          <div style={css.card}>
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div
                style={{ fontSize: 64, fontWeight: "bold", color: scoreColor }}
              >
                {healthScore}
              </div>
              <div style={{ fontSize: 14, color: T.muted, marginTop: 4 }}>
                out of 100
              </div>
              <div
                style={{
                  fontSize: 15,
                  color: T.text,
                  marginTop: 12,
                  fontStyle: "italic",
                }}
              >
                {healthScore >= 70
                  ? `${name} feels seen. Keep it up.`
                  : healthScore >= 40
                  ? "Getting there — stay consistent."
                  : "Time to step up, brother."}
              </div>
            </div>
          </div>
          {[
            { label: "Reminders completed", pct: 75, color: T.green },
            {
              label: "Gestures done this week",
              pct: gestureDone || showRatingThanks ? 100 : 33,
              color: T.accent,
            },
            {
              label: "Weekly check-ins",
              pct: weeklyRating ? 100 : 50,
              color: T.premium,
            },
          ].map((item, i) => (
            <div key={i} style={{ ...css.card, marginBottom: 8 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <div style={{ fontSize: 13 }}>{item.label}</div>
                <div
                  style={{
                    fontSize: 13,
                    color: item.color,
                    fontWeight: "bold",
                  }}
                >
                  {item.pct}%
                </div>
              </div>
              <div
                style={{
                  height: 6,
                  borderRadius: 3,
                  background: T.border,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${item.pct}%`,
                    background: item.color,
                    borderRadius: 3,
                  }}
                />
              </div>
            </div>
          ))}
      </div>

        {/* The Code — hidden gem */}
        {showTheCode ? (
          <div style={{ padding: "32px 8px 16px", textAlign: "center" }}>
            <div style={{ fontSize: 11, color: T.accent, letterSpacing: 2, marginBottom: 20, textTransform: "uppercase" }}>The Code</div>
            {[
              ["I", "She talks to connect, not to complain.", "When she shares her day — frustrations included — that's not an attack. That's trust. Listen without fixing. Sometimes \"I hear you\" is the most powerful thing you can say."],
              ["II", "Your calm is her safety.", "She's not looking for a perfect man. She's looking for a man who doesn't fall apart when things get hard. Your stability — not your success, not your words — is what makes her feel safe with you."],
              ["III", "Don't fix it. Acknowledge it first.", "You're wired to solve problems. That's a strength. But sometimes she doesn't want a solution — she wants to feel understood. Ask first: \"Do you want me to listen, or do you want my take?\""],
              ["IV", "Small acts build deep connection.", "A hand on her back. Remembering how she takes her coffee. Asking how the conversation with her mother went. Grand gestures impress briefly. Small, consistent attention builds something that lasts."],
              ["V", "When she goes quiet, something matters.", "A woman who falls silent hasn't gone cold. She's waiting — without knowing it — to see if you'll notice. Notice. Not out of obligation. Out of choice."],
              ["VI", "Intimacy starts before the bedroom.", "For her, emotional safety comes before physical closeness. A day of real attention, a real conversation, a moment of genuine connection — that's foreplay. Remember that."],
              ["VII", "Stay yourself. That's what attracts her.", "A relationship needs the tension between two different people. Don't become her mirror. Keep your own interests, your own friends, your own direction. Two whole people make a stronger relationship than two halves that merge."],
            ].map(([num, title, body]) => (
              <div key={num} style={{ marginBottom: 24, textAlign: "left" }}>
                <div style={{ fontSize: 10, color: T.muted, letterSpacing: 2 }}>{num}</div>
                <div style={{ fontSize: 13, color: T.accent, fontStyle: "italic", marginBottom: 6 }}>{title}</div>
                <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.6 }}>{body}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", paddingTop: 40, paddingBottom: 24 }}>
            <span
              onClick={() => setShowTheCode(true)}
              style={{ fontSize: 10, color: "#444444", cursor: "pointer", letterSpacing: 1 }}
            >
              · · ·
            </span>
          </div>
        )}
      )}

      {/* Bottom Nav */}
      <div style={css.nav}>
        {[
          { id: "home", icon: "🏠", label: "Home" },
          { id: "events", icon: "📅", label: "Events" },
          { id: "reminders", icon: "⏰", label: "To-do" },
          { id: "score", icon: "💪", label: "Health" },
          { id: "settings", icon: "⚙️", label: "Settings" },
        ].map((n) => (
          <div
            key={n.id}
            onClick={() => setTab(n.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              cursor: "pointer",
              opacity: tab === n.id ? 1 : 0.4,
            }}
          >
            <div style={{ fontSize: 20 }}>{n.icon}</div>
            <div
              style={{
                fontSize: 10,
                color: tab === n.id ? T.accent : T.muted,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {n.label}
            </div>
          </div>
        ))}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div style={css.modal} onClick={() => setShowAddModal(false)}>
          <div style={css.modalBox} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: T.accent,
                marginBottom: 6,
              }}
            >
              Add Event
            </div>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 18 }}>
              What do you want to remember?
            </div>
            <input
              style={css.input}
              placeholder="Event name (e.g. Her work promotion)"
              value={newEvent.name}
              onChange={(e) =>
                setNewEvent((n) => ({ ...n, name: e.target.value }))
              }
            />
            <input
              style={css.input}
              type="date"
              value={newEvent.date}
              onChange={(e) =>
                setNewEvent((n) => ({ ...n, date: e.target.value }))
              }
            />
            <div style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>
              Alert me X days before:
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[3, 7, 14, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => setNewEvent((n) => ({ ...n, daysBefore: d }))}
                  style={{
                    flex: 1,
                    background:
                      newEvent.daysBefore === d ? T.accent : T.accentSoft,
                    color: newEvent.daysBefore === d ? "#0d0d0d" : T.text,
                    border: `1px solid ${
                      newEvent.daysBefore === d ? T.accent : T.border
                    }`,
                    borderRadius: 10,
                    padding: "10px 4px",
                    fontSize: 13,
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {d}d
                </button>
              ))}
            </div>
            <button style={css.btn} onClick={addEvent}>
              Save Event
            </button>
            <button
              style={{ ...css.btnGhost, marginTop: 10 }}
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add Reminder Modal */}
      {showAddReminder && (
        <div style={css.modal} onClick={() => setShowAddReminder(false)}>
          <div style={css.modalBox} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: T.accent,
                marginBottom: 6,
              }}
            >
              New Reminder
            </div>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 18 }}>
              Set a personal reminder for yourself.
            </div>

            <label
              style={{
                fontSize: 12,
                color: T.muted,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 6,
                display: "block",
              }}
            >
              What do you need to do?
            </label>
            <input
              style={css.input}
              placeholder="e.g. Take out the rubbish"
              value={newReminder.title}
              onChange={(e) =>
                setNewReminder((r) => ({ ...r, title: e.target.value }))
              }
            />

            <div style={{ display: "flex", gap: 10, marginBottom: 0 }}>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    fontSize: 12,
                    color: T.muted,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    marginBottom: 6,
                    display: "block",
                  }}
                >
                  Date
                </label>
                <input
                  style={{ ...css.input, marginBottom: 12 }}
                  type="date"
                  value={newReminder.date}
                  onChange={(e) =>
                    setNewReminder((r) => ({ ...r, date: e.target.value }))
                  }
                />
              </div>
              <div style={{ flex: 1 }}>
                <label
                  style={{
                    fontSize: 12,
                    color: T.muted,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                    marginBottom: 6,
                    display: "block",
                  }}
                >
                  Time
                </label>
                <input
                  style={{ ...css.input, marginBottom: 12 }}
                  type="time"
                  value={newReminder.time}
                  onChange={(e) =>
                    setNewReminder((r) => ({ ...r, time: e.target.value }))
                  }
                />
              </div>
            </div>

            <label
              style={{
                fontSize: 12,
                color: T.muted,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 8,
                display: "block",
              }}
            >
              Repeat
            </label>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {["never", "daily", "weekly", "monthly"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setNewReminder((r) => ({ ...r, repeat: opt }))}
                  style={{
                    flex: 1,
                    background:
                      newReminder.repeat === opt ? T.accent : T.accentSoft,
                    color: newReminder.repeat === opt ? "#0d0d0d" : T.text,
                    border: `1px solid ${
                      newReminder.repeat === opt ? T.accent : T.border
                    }`,
                    borderRadius: 10,
                    padding: "9px 4px",
                    fontSize: 11,
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontFamily: "Georgia, serif",
                    textTransform: "capitalize",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>

            <button
              style={{
                ...css.btn,
                opacity:
                  newReminder.title && newReminder.date && newReminder.time
                    ? 1
                    : 0.4,
              }}
              onClick={addReminder}
            >
              Save Reminder
            </button>
            <button
              style={{ ...css.btnGhost, marginTop: 10 }}
              onClick={() => setShowAddReminder(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showScoreModal && (
        <div style={css.modal} onClick={() => setShowScoreModal(false)}>
          <div style={css.modalBox} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: T.accent,
                marginBottom: 6,
              }}
            >
              Your Score: {healthScore}
            </div>
            <div
              style={{
                fontSize: 13,
                color: T.muted,
                marginBottom: 16,
                lineHeight: 1.6,
              }}
            >
              Your score rises when you complete gestures, act on reminders in
              time, and check in weekly.
            </div>
            <div
              style={{
                fontSize: 14,
                color: T.text,
                fontStyle: "italic",
                lineHeight: 1.7,
              }}
            >
              {healthScore >= 70
                ? "🔥 She feels the difference. You're doing great."
                : healthScore >= 40
                ? "💛 You're building momentum. Stay consistent."
                : "⚡ Small actions matter. Start with today's gesture."}
            </div>
            <button
              style={{ ...css.btn, marginTop: 20 }}
              onClick={() => setShowScoreModal(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ROOT ───────────────────────────────────────────────────

export default function GoddessAlert() {
  const [screen, setScreen] = useState("login"); // login | onboarding | app
  const [partnerData, setPartnerData] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: partner } = await supabase
          .from("partners")
          .select("*")
          .eq("user_id", session.user.id)
          .single();
        setScreen(partner ? "app" : "onboarding");
        if (partner)
          setPartnerData({
            herName: partner.name,
            herBirthday: partner.birthday,
          });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const { data: partner } = await supabase
          .from("partners")
          .select("*")
          .eq("user_id", session.user.id)
          .single();
        setScreen(partner ? "app" : "onboarding");
        if (partner)
          setPartnerData({
            herName: partner.name,
            herBirthday: partner.birthday,
          });
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  return (
    <div style={css.app}>
      {screen === "login" && (
        <LoginScreen onNext={() => setScreen("onboarding")} />
      )}
      {screen === "onboarding" && (
        <OnboardingScreen
          onDone={(data) => {
            setPartnerData(data);
            setScreen("app");
          }}
        />
      )}
      {screen === "app" && <MainApp partnerData={partnerData} />}
    </div>
  );
}
