import { supabase } from "./supabase";
import TheCode from "./components/TheCode";
import EventsTab from "./components/EventsTab";
import SettingsTab from "./components/SettingsTab";
import RemindersTab from "./components/RemindersTab";
import HealthTab from "./components/HealthTab";
import HomeTab from "./components/HomeTab";
import SelfAssessmentScreen from "./components/SelfAssessmentScreen";
import { stripePromise, PRICES } from "./stripe";
import { useState, useEffect } from "react";
import { T, css } from "./theme";

function daysUntil(dateStr) {
  const today = new Date();
  const target = new Date(dateStr + "T00:00:00");
  target.setFullYear(today.getFullYear());
  if (target.getMonth() === today.getMonth() && target.getDate() === today.getDate()) return 0;
  if (target < today) target.setFullYear(today.getFullYear() + 1);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function daysUntilDate(isoDate) {
  return Math.max(0, Math.ceil((new Date(isoDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
}

// ─── LOGIN ─────────────────────────────────────────────────

function LoginScreen({ onNext }) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMagicLink() {
    if (!email) return;
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: window.location.origin } });
    if (error) { setError(error.message); setLoading(false); } else { setSent(true); setLoading(false); }
  }

  return (
    <div style={{ ...css.page, justifyContent: "center", gap: 0 }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{ fontSize: 11, color: T.muted, letterSpacing: 6, textTransform: "uppercase", marginBottom: 10 }}>welcome to</div>
        <div style={{ fontSize: 42, color: T.accent, fontStyle: "italic", letterSpacing: 2 }}>GoddessAlert</div>
        <div style={{ fontSize: 13, color: T.muted, marginTop: 8, letterSpacing: 1 }}>She notices everything. Now, so do you.</div>
      </div>
      {!sent ? (<>
        <div style={{ marginBottom: 6 }}>
          <label style={css.label}>Your email address</label>
          <input style={css.input} type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        {error && <div style={{ fontSize: 13, color: T.red, marginBottom: 12, textAlign: "center" }}>{error}</div>}
        <button style={{ ...css.btn, opacity: loading ? 0.6 : 1 }} onClick={sendMagicLink} disabled={loading}>{loading ? "Sending..." : "Send Magic Link"}</button>
        <div style={{ textAlign: "center", marginTop: 14, fontSize: 11, color: T.muted, lineHeight: 1.8 }}>
          We'll send you a one-click login link. No password needed.<br />
          By continuing you agree to our <a href="https://goddessalert.com/terms.html" style={{ color: T.accent, textDecoration: "underline" }} target="_blank" rel="noreferrer">Terms of Use</a> and <a href="https://goddessalert.com/privacy.html" style={{ color: T.accent, textDecoration: "underline" }} target="_blank" rel="noreferrer">Privacy Policy</a>.
        </div>
      </>) : (
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>📬</div>
          <div style={{ fontSize: 18, color: T.accent, marginBottom: 8 }}>Check your inbox</div>
          <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.7, marginBottom: 28 }}>We sent a magic link to<br /><span style={{ color: T.text }}>{email}</span><br />Click it to sign in — no password needed.</div>
          <button style={{ ...css.btnGhost, marginTop: 10 }} onClick={() => setSent(false)}>Use a different email</button>
        </div>
      )}
    </div>
  );
}

// ─── ONBOARDING ────────────────────────────────────────────

function OnboardingScreen({ onDone }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ herName: "", herBirthday: "", anniversary: "", alertDays: 7 });
  const [saving, setSaving] = useState(false);

  async function saveAndContinue() {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: existingUser } = await supabase.from("users").select("id").eq("id", user.id).maybeSingle();
      if (existingUser) {
        await supabase.from("users").update({ email: user.email }).eq("id", user.id);
      } else {
        await supabase.from("users").insert({ id: user.id, email: user.email });
      }

      const { data: existingPartner } = await supabase.from("partners").select("user_id").eq("user_id", user.id).maybeSingle();
      const partnerName = data.herName.charAt(0).toUpperCase() + data.herName.slice(1);
      if (existingPartner) {
        await supabase.from("partners").update({ name: partnerName, birthday: data.herBirthday || null }).eq("user_id", user.id);
      } else {
        await supabase.from("partners").insert({ user_id: user.id, name: partnerName, birthday: data.herBirthday || null });
      }

      if (data.herBirthday) {
        const { data: existingBday } = await supabase.from("events").select("id").eq("user_id", user.id).eq("category", "birthday").maybeSingle();
        if (existingBday) {
          await supabase.from("events").update({ name: `${partnerName}'s Birthday`, date: data.herBirthday, days_before: data.alertDays }).eq("id", existingBday.id);
        } else {
          await supabase.from("events").insert({ user_id: user.id, name: `${partnerName}'s Birthday`, date: data.herBirthday, days_before: data.alertDays, emoji: "🎂", category: "birthday" });
        }
      }

      if (data.anniversary) {
        const { data: existingAnniv } = await supabase.from("events").select("id").eq("user_id", user.id).eq("category", "anniversary").maybeSingle();
        if (existingAnniv) {
          await supabase.from("events").update({ name: "Anniversary", date: data.anniversary, days_before: data.alertDays }).eq("id", existingAnniv.id);
        } else {
          await supabase.from("events").insert({ user_id: user.id, name: "Anniversary", date: data.anniversary, days_before: data.alertDays, emoji: "💍", category: "anniversary" });
        }
      }

      const { data: existingSub } = await supabase
        .from("subscriptions")
        .select("user_id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!existingSub) {
        await supabase.from("subscriptions").insert({
          user_id: user.id,
          status: "free",
          plan: "free",
          updated_at: new Date().toISOString(),
        });
      }
    }
    setSaving(false);
    onDone(data);
  }

  const steps = [
    { emoji: "👋", title: "Let's set things up", subtitle: "Takes about 60 seconds. She'll never know.", field: (<><label style={css.label}>What's her name?</label><input style={css.input} placeholder="e.g. Emma" value={data.herName} onChange={(e) => setData((d) => ({ ...d, herName: e.target.value }))} /></>), canNext: data.herName.length > 0 },
    { emoji: "🎂", title: `When is ${data.herName || "her"} birthday?`, subtitle: "We'll remind you well before it sneaks up on you.", field: (<><label style={css.label}>Her birthday</label><input style={css.input} type="date" value={data.herBirthday} onChange={(e) => setData((d) => ({ ...d, herBirthday: e.target.value }))} /></>), canNext: data.herBirthday.length > 0 },
    { emoji: "💍", title: "Your anniversary?", subtitle: "The date she definitely remembers. Make sure you do too.", field: (<><label style={css.label}>Anniversary date</label><input style={css.input} type="date" value={data.anniversary} onChange={(e) => setData((d) => ({ ...d, anniversary: e.target.value }))} /><button style={{ ...css.btnGhost, marginBottom: 12 }} onClick={() => setStep((s) => s + 1)}>Skip for now</button></>), canNext: true },
    { emoji: "⏰", title: "How early should we warn you?", subtitle: "You can change this per event later.", field: (<><label style={css.label}>Alert me this many days before</label><div style={{ display: "flex", gap: 10, marginBottom: 12 }}>{[3, 7, 14, 30].map((d) => (<button key={d} onClick={() => setData((x) => ({ ...x, alertDays: d }))} style={{ flex: 1, background: data.alertDays === d ? T.accent : T.accentSoft, color: data.alertDays === d ? "#0d0d0d" : T.text, border: `1px solid ${data.alertDays === d ? T.accent : T.border}`, borderRadius: 12, padding: "14px 4px", fontSize: 14, fontWeight: "bold", cursor: "pointer", fontFamily: "Georgia, serif" }}>{d}d</button>))}</div></>), canNext: true },
  ];

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <div style={{ ...css.page, justifyContent: "center" }}>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", marginBottom: 40 }}>
        {steps.map((_, i) => (<div key={i} style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, background: i <= step ? T.accent : T.border, transition: "all 0.3s ease" }} />))}
      </div>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>{current.emoji}</div>
        <div style={{ fontSize: 22, fontWeight: "bold", color: T.text, marginBottom: 8 }}>{current.title}</div>
        <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.6 }}>{current.subtitle}</div>
      </div>
      {current.field}
      <button style={{ ...css.btn, opacity: current.canNext && !saving ? 1 : 0.4 }} onClick={() => current.canNext && (isLast ? saveAndContinue() : setStep((s) => s + 1))}>
        {saving ? "Saving..." : isLast ? "Let's go →" : "Continue →"}
      </button>
    </div>
  );
}

// ─── SUBSCRIPTION BANNER ───────────────────────────────────

function SubscriptionBanner({ subscription, onUpgrade }) {
  const upgradeButtons = (
    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
      <button onClick={() => onUpgrade("monthly")} style={{ flex: 1, background: T.accent, color: "#0d0d0d", border: "none", borderRadius: 20, padding: "8px 14px", fontWeight: "bold", fontSize: 12, cursor: "pointer", fontFamily: "Georgia, serif" }}>€4.99/month</button>
      <button onClick={() => onUpgrade("yearly")} style={{ flex: 1, background: "transparent", color: T.accent, border: `1px solid ${T.accent}`, borderRadius: 20, padding: "8px 14px", fontWeight: "bold", fontSize: 12, cursor: "pointer", fontFamily: "Georgia, serif" }}>€29.99/year</button>
    </div>
  );

  if (!subscription) {
    return (
      <div style={{ padding: "0 24px 8px" }}>
        <div style={{ background: "linear-gradient(135deg, #1a1200, #0d0d0d)", border: `1px solid ${T.premium}`, borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: "bold", color: T.premium }}>Premium Trial Active</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>7 days remaining{upgradeButtons}</div>
          </div>
          <div style={{ background: T.premium, color: "#0d0d0d", fontSize: 10, fontWeight: "bold", padding: "4px 10px", borderRadius: 20, letterSpacing: 1, textTransform: "uppercase" }}>7-day trial</div>
        </div>
      </div>
    );
  }

  const { status, trial_end, current_period_end } = subscription;
  if (status === "active" && !trial_end) return null;

  if (status === "trialing" && trial_end) {
    const daysLeft = daysUntilDate(trial_end);
    return (
      <div style={{ padding: "0 24px 8px" }}>
        <div style={{ background: "linear-gradient(135deg, #1a1200, #0d0d0d)", border: `1px solid ${T.premium}`, borderRadius: 16, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: "bold", color: T.premium }}>Premium Trial Active</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 2 }}>{daysLeft === 0 ? "Last day of your trial" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} remaining`}{upgradeButtons}</div>
          </div>
          <div style={{ background: T.premium, color: "#0d0d0d", fontSize: 10, fontWeight: "bold", padding: "4px 10px", borderRadius: 20, letterSpacing: 1, textTransform: "uppercase" }}>trial</div>
        </div>
      </div>
    );
  }

  if (status === "past_due") {
    return (
      <div style={{ padding: "0 24px 8px" }}>
        <div style={{ background: "#1a0000", border: `1px solid ${T.red}`, borderRadius: 16, padding: "14px 18px" }}>
          <div style={{ fontSize: 13, fontWeight: "bold", color: T.red, marginBottom: 4 }}>⚠️ Payment failed</div>
          <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.6 }}>Your payment could not be processed. Please update your payment details to keep your access.</div>
        </div>
      </div>
    );
  }

  if (status === "canceled" && current_period_end) {
    const daysLeft = daysUntilDate(current_period_end);
    if (daysLeft > 0) {
      return (
        <div style={{ padding: "0 24px 8px" }}>
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: "14px 18px" }}>
            <div style={{ fontSize: 13, color: T.muted }}>Your subscription has been cancelled. You still have access for <span style={{ color: T.text }}>{daysLeft} day{daysLeft === 1 ? "" : "s"}</span>.</div>
          </div>
        </div>
      );
    }
  }

  return null;
}

// ─── NO ACCESS ─────────────────────────────────────────────

function NoAccessScreen({ onUpgrade }) {
  return (
    <div style={{ ...css.page, justifyContent: "center", textAlign: "center" }}>
      <div style={{ fontSize: 48, marginBottom: 24 }}>🔒</div>
      <div style={{ fontSize: 22, color: T.accent, fontStyle: "italic", marginBottom: 12 }}>Your trial has expired</div>
      <div style={{ fontSize: 14, color: T.muted, lineHeight: 1.8, marginBottom: 32 }}>Upgrade to Premium to keep using your tips, reminders, and relationship health score.</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
        <button onClick={() => onUpgrade("monthly")} style={css.btn}>€4.99 per month</button>
        <button onClick={() => onUpgrade("yearly")} style={{ ...css.btn, background: "transparent", color: T.accent, border: `1px solid ${T.accent}` }}>€29.99 per year — best value</button>
      </div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────

function MainApp({ partnerData }) {
  const name = partnerData?.herName ? partnerData.herName.charAt(0).toUpperCase() + partnerData.herName.slice(1) : "her";

  const [tab, setTab] = useState("home");
  const [currentUser, setCurrentUser] = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [subscriptionLoaded, setSubscriptionLoaded] = useState(false);
  const [score, setScore] = useState(50);
  const [scoreLoaded, setScoreLoaded] = useState(false);
  const [scoreVersion, setScoreVersion] = useState(0);
  const [streak, setStreak] = useState(1);
  const [longestStreak, setLongestStreak] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [showTheCode, setShowTheCode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [newEvent, setNewEvent] = useState({ name: "", date: "", daysBefore: 7 });
  const [newReminder, setNewReminder] = useState({ title: "", date: "", time: "", repeat: "never" });
  const [events, setEvents] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [gestureDone, setGestureDone] = useState(false);
  const [gestureRating, setGestureRating] = useState(null);
  const [tipIndex, setTipIndex] = useState(0);
  const [showRatingThanks, setShowRatingThanks] = useState(false);
  const [weeklyRating, setWeeklyRating] = useState(null);
  const [scorePercentages, setScorePercentages] = useState({ reminders: 0, gestures: 0, checkins: 0 });
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyPush, setNotifyPush] = useState(false);
  const [notifyDay, setNotifyDay] = useState("monday");
  const [notifyTime, setNotifyTime] = useState("09:00");
  const [notifyTipEmail, setNotifyTipEmail] = useState(false);
  const [prefSaved, setPrefSaved] = useState(false);
  const [tips, setTips] = useState([]);
  const [pendingReactionId, setPendingReactionId] = useState(null);
  const [nudgeMessage, setNudgeMessage] = useState(null);

  // ✅ Fix: onAuthStateChange voor sessie persistentie — currentUser blijft up-to-date
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user || null);
    });

    const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user || null);
    });

    return () => authSub.unsubscribe();
  }, []);

  useEffect(() => {
    async function loadSubscription() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setSubscriptionLoaded(true); return; }
      const { data } = await supabase.from("subscriptions").select("*").eq("user_id", user.id).maybeSingle();
      setSubscription(data || null);
      setSubscriptionLoaded(true);
    }
    loadSubscription();
  }, []);

  useEffect(() => {
    async function loadEvents() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("events").select("*").eq("user_id", user.id);
        if (data) {
          const sorted = [...data].sort((a, b) => daysUntil(a.date) - daysUntil(b.date));
          setEvents(sorted);
        }
      }
    }
    loadEvents();
  }, []);

 useEffect(() => {
  async function calculateScore() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysAgoISO = sevenDaysAgo.toISOString();
    const sevenDaysAgoDate = sevenDaysAgo.toISOString().split("T")[0];
    const today = new Date().toISOString().split("T")[0];

    // ── 1. BASE SCORE OP BASIS VAN ASSESSMENT ───────────────
    // Zonder assessment begin je laag — motivatie om het te doen
    const { data: latestAssessment } = await supabase
      .from("assessments")
      .select("attentiveness, gestures, presence, awareness, priority, appreciation")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    let baseScore = 30; // Geen assessment = laag startpunt

    if (latestAssessment) {
      const vals = [
        latestAssessment.attentiveness,
        latestAssessment.gestures,
        latestAssessment.presence,
        latestAssessment.awareness,
        latestAssessment.priority,
        latestAssessment.appreciation,
      ].filter(Boolean);
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      // Assessment gedaan = direct naar zone 2
      if (avg <= 2.0) baseScore = 38;
      else if (avg <= 3.0) baseScore = 44;
      else if (avg <= 4.0) baseScore = 50;
      else baseScore = 54;
    }

    let score = baseScore;

    // ── 2. STREAK BONUS ─────────────────────────────────────
    // Streak is de motor — consistentie telt meer dan individuele acties
    const { data: streakData } = await supabase
      .from("streaks")
      .select("current_streak, last_active_date")
      .eq("user_id", user.id)
      .maybeSingle();

    const currentStreak = streakData?.current_streak || 0;
    const lastActiveDate = streakData?.last_active_date || null;

    // Streak bonus — logaritmisch zodat het steeds meer moeite kost
    if (currentStreak >= 30) score += 14;
    else if (currentStreak >= 14) score += 9;
    else if (currentStreak >= 7) score += 5;
    else if (currentStreak >= 3) score += 2;

    // Decay: niet actief vandaag of gisteren = kleine aftrek
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    if (lastActiveDate && lastActiveDate !== today && lastActiveDate !== yesterdayStr) {
      score -= 4; // Inactief = zichtbare daling
    }

    // ── 3. WEEKLY CHECK-IN ───────────────────────────────────
    // Reflectie telt, maar weegt minder zwaar dan actie
    const { data: checkins } = await supabase
      .from("health_scores")
      .select("score, recorded_at")
      .eq("user_id", user.id)
      .gte("recorded_at", sevenDaysAgoISO)
      .order("recorded_at", { ascending: false })
      .limit(1);

    if (checkins && checkins.length > 0) {
      const c = checkins[0];
      if (c.score >= 4) score += 6;
      else if (c.score === 3) score += 3;
      else if (c.score <= 2) score -= 2;
    } else {
      score -= 3; // Geen check-in deze week = kleine aftrek
    }

    // ── 4. REMINDERS ─────────────────────────────────────────
    // Acties tellen — maar gematigder dan voorheen
    const { data: remindersData } = await supabase
      .from("reminders")
      .select("done, date, partner_reaction")
      .eq("user_id", user.id)
      .gte("date", sevenDaysAgoDate);

    if (remindersData && remindersData.length > 0) {
      let reminderPoints = 0;
      let reactionPoints = 0;

      for (const r of remindersData) {
        if (r.done) reminderPoints += 2;
        else reminderPoints -= 1;

        // Partner reacties — het wildcard element
        // Positief geeft een verrassende boost, negatief een duidelijk signaal
        if (r.partner_reaction === 3) reactionPoints += 4;
        else if (r.partner_reaction === 2) reactionPoints += 1;
        else if (r.partner_reaction === 1) reactionPoints -= 3;
      }

      // Cap reminder punten — één geweldige week mag niet de score permanent opdrijven
      score += Math.min(8, Math.max(-6, reminderPoints));

      // Partner reacties gecapped — maximaal 8 punten per week
      score += Math.min(8, Math.max(-6, reactionPoints));
    }

    // ── 5. ZONE CAPS ─────────────────────────────────────────
    // De belangrijkste verandering: zones zijn alleen bereikbaar
    // met de juiste combinatie van factoren

    // Zone 4 (76-88): alleen met streak 7+ én check-in gedaan
    const hasCheckin = checkins && checkins.length > 0;
    if (score > 75 && (currentStreak < 7 || !hasCheckin)) {
      score = Math.min(score, 75);
    }

    // Zone 5 (89-95): alleen met streak 30+ én positieve partner reacties
    const hasPositiveReaction = remindersData?.some(r => r.partner_reaction === 3);
    if (score > 88 && (currentStreak < 30 || !hasPositiveReaction)) {
      score = Math.min(score, 88);
    }

    // Absolute grenzen
    score = Math.max(10, Math.min(95, score));

    setScore(score);
    setScoreLoaded(true);
  }

  calculateScore();
}, [scoreVersion]);

  useEffect(() => {
    async function loadReminders() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("reminders").select("*").eq("user_id", user.id).order("date", { ascending: true });
        if (data) setReminders(data);
      }
    }
    loadReminders();
  }, []);

  useEffect(() => {
  async function loadTips() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase.functions.invoke("get-tips", {
      body: { userId: user.id },
    });

    if (error || !data?.tips) return;

    setTips(data.tips);
    if (data.seenToday) setTipIndex(1);
  }

  loadTips();
}, []);
  
  useEffect(() => {
    async function loadPreferences() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("user_preferences").select("*").eq("user_id", user.id).maybeSingle();
      if (data) {
  setNotifyEmail(data.notify_email ?? true);
  setNotifyPush(data.notify_push ?? false);
  setNotifyDay(data.notify_day ?? "monday");
  setNotifyTime(data.notify_time ?? "09:00");
  setNotifyTipEmail(data.notify_tip_email ?? false);
}
    }
    loadPreferences();
  }, []);

  useEffect(() => {
    async function loadWeeklyRating() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const { data } = await supabase.from("health_scores").select("score").eq("user_id", user.id).gte("recorded_at", sevenDaysAgo.toISOString()).order("recorded_at", { ascending: false }).limit(1);
      if (data && data.length > 0) {
        const s = data[0].score;
        setWeeklyRating(s >= 4 ? "great" : s === 3 ? "good" : s === 2 ? "ok" : "poor");
      }
    }
    loadWeeklyRating();
  }, []);

  useEffect(() => {
    async function calculatePercentages() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const sevenDaysAgoDate = sevenDaysAgo.toISOString().split("T")[0];
      const sevenDaysAgoISO = sevenDaysAgo.toISOString();
      const { data: allReminders } = await supabase.from("reminders").select("done").eq("user_id", user.id).gte("date", sevenDaysAgoDate);
      const totalReminders = allReminders?.length || 0;
      const doneReminders = allReminders?.filter((r) => r.done).length || 0;
      const remindersPct = totalReminders === 0 ? 0 : Math.round((doneReminders / totalReminders) * 100);
      const { data: seenThisWeek } = await supabase.from("seen_tips").select("id").eq("user_id", user.id).gte("seen_at", sevenDaysAgoISO);
      const gesturesPct = Math.min(100, Math.round(((seenThisWeek?.length || 0) / 7) * 100));
      const { data: checkins } = await supabase.from("health_scores").select("id").eq("user_id", user.id).gte("recorded_at", sevenDaysAgoISO);
      const checkinsPct = checkins && checkins.length > 0 ? 100 : 0;
      setScorePercentages({ reminders: remindersPct, gestures: gesturesPct, checkins: checkinsPct });
    }
    calculatePercentages();
  }, []);

  useEffect(() => {
    async function updateStreak() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const today = new Date().toISOString().split("T")[0];
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      const { data: existing } = await supabase.from("streaks").select("*").eq("user_id", user.id).maybeSingle();
      if (!existing) {
        await supabase.from("streaks").insert({ user_id: user.id, current_streak: 1, longest_streak: 1, last_active_date: today });
        setStreak(1); setLongestStreak(1);
        return;
      }
      if (existing.last_active_date === today) {
        setStreak(existing.current_streak);
        setLongestStreak(existing.longest_streak);
        return;
      }
      if (existing.last_active_date === yesterdayStr) {
        const newStreak = existing.current_streak + 1;
        const newLongest = Math.max(newStreak, existing.longest_streak);
        await supabase.from("streaks").update({ current_streak: newStreak, longest_streak: newLongest, last_active_date: today, updated_at: new Date().toISOString() }).eq("user_id", user.id);
        setStreak(newStreak); setLongestStreak(newLongest);
      } else {
        await supabase.from("streaks").update({ current_streak: 1, last_active_date: today, updated_at: new Date().toISOString() }).eq("user_id", user.id);
        setStreak(1); setLongestStreak(existing.longest_streak);
      }
    }
    updateStreak();
  }, []);

  const currentTip = tips.length > 0 ? tips[tipIndex % tips.length] : null;

  function hasAccess() {
    if (!subscriptionLoaded) return true;
    if (!subscription) return true;
    const { status, trial_end, current_period_end } = subscription;
    if (status === "free") return true;
    if (status === "trialing" && trial_end && new Date(trial_end) > new Date()) return true;
    if (status === "active") return true;
    if (status === "past_due") return true;
    if (status === "canceled" && current_period_end && new Date(current_period_end) > new Date()) return true;
    return false;
  }

  function isPremium() {
    if (!subscriptionLoaded) return true;
    if (!subscription) return false;
    const { status, trial_end, current_period_end } = subscription;
    if (status === "free") return false;
    if (status === "trialing" && trial_end && new Date(trial_end) > new Date()) return true;
    if (status === "active") return true;
    if (status === "past_due") return true;
    if (status === "canceled" && current_period_end && new Date(current_period_end) > new Date()) return true;
    return false;
  }

  // ✅ Gebruikt currentUser — geen getUser() aanroep
  async function handleUpgrade(plan) {
    const userEmail = currentUser?.email || "";
    const priceId = plan === "yearly" ? "price_1TLThd5ueCdcfjYzCRQL6Cx8" : "price_1TLTfg5ueCdcfjYzJjllByzI";
    const { data, error } = await supabase.functions.invoke("bright-worker", { body: { action: "create-checkout", priceId, email: userEmail, successUrl: window.location.origin + "?upgraded=true", cancelUrl: window.location.origin } });
    if (data?.url) window.location.href = data.url;
    else console.error("Stripe error:", JSON.stringify(error), JSON.stringify(data));
  }

  // ✅ Gebruikt currentUser — geen getUser() aanroep
  async function rateTip(rating) {
    setGestureRating(rating); setShowRatingThanks(true);
    if (currentTip) {
      const user = currentUser;
      if (user) {
        await supabase.from("tip_ratings").upsert({ user_id: user.id, tip_id: currentTip.id, rating });
        await supabase.from("seen_tips").upsert({ user_id: user.id, tip_id: currentTip.id }, { onConflict: "user_id,tip_id" });
        if (rating === "up") await supabase.from("tips").update({ thumbs_up: (currentTip.thumbs_up || 0) + 1 }).eq("id", currentTip.id);
        else await supabase.from("tips").update({ thumbs_down: (currentTip.thumbs_down || 0) + 1 }).eq("id", currentTip.id);
      }
    }
    setTimeout(() => { setShowRatingThanks(false); setGestureRating(null); setGestureDone(false); setTipIndex((i) => i + 1); }, 1800);
  }

  // ✅ Gebruikt currentUser — geen getUser() aanroep
  async function handleDeleteAccount() {
    setDeleteLoading(true); setDeleteError("");
    try {
      const user = currentUser;
      if (!user) throw new Error("Not logged in");
      const uid = user.id;
      await supabase.from("tip_ratings").delete().eq("user_id", uid);
      await supabase.from("health_scores").delete().eq("user_id", uid);
      await supabase.from("reminders").delete().eq("user_id", uid);
      await supabase.from("events").delete().eq("user_id", uid);
      await supabase.from("partners").delete().eq("user_id", uid);
      await supabase.from("subscriptions").delete().eq("user_id", uid);
      await supabase.from("seen_tips").delete().eq("user_id", uid);
      await supabase.from("streaks").delete().eq("user_id", uid);
      await supabase.from("user_preferences").delete().eq("user_id", uid);
      await supabase.from("users").delete().eq("id", uid);
      await supabase.functions.invoke("bright-worker", { body: { action: "delete-account", userId: uid } });
      await supabase.auth.signOut();
      window.location.href = "https://goddessalert.com";
    } catch (err) {
      setDeleteError("Something went wrong. Please contact hello@goddessalert.com.");
      setDeleteLoading(false);
    }
  }

  // ✅ Gebruikt currentUser — geen getUser() aanroep
  async function addEvent() {
    if (!newEvent.name || !newEvent.date) return;
    try {
      const user = currentUser;
      if (!user) return;
      const { error } = await supabase.from("events").insert({
        user_id: user.id, name: newEvent.name, date: newEvent.date,
        days_before: newEvent.daysBefore || 7, emoji: "📅", repeat_yearly: true
      });
      if (error) { console.error("Event insert error:", error); return; }
      const { data: fresh } = await supabase.from("events").select("*").eq("user_id", user.id);
      if (fresh) setEvents([...fresh].sort((a, b) => daysUntil(a.date) - daysUntil(b.date)));
    } catch (err) {
      console.error("addEvent error:", err);
    }
    setNewEvent({ name: "", date: "", daysBefore: 7 });
    setShowAddModal(false);
  }

  // ✅ Gebruikt currentUser — geen getUser() aanroep
  async function addReminder() {
    if (!newReminder.title || !newReminder.date || !newReminder.time) return;
    try {
      const user = currentUser;
      if (!user) return;
      const { error } = await supabase.from("reminders").insert({
        user_id: user.id, title: newReminder.title, date: newReminder.date,
        time: newReminder.time, repeat: newReminder.repeat, done: false
      });
      if (error) { console.error("Reminder insert error:", error); return; }
      const { data: fresh } = await supabase.from("reminders").select("*").eq("user_id", user.id).order("date", { ascending: true });
      if (fresh) setReminders(fresh);
    } catch (err) {
      console.error("addReminder error:", err);
    }
    setNewReminder({ title: "", date: "", time: "", repeat: "never" });
    setShowAddReminder(false);
  }

  async function toggleReminder(id) {
    const newDone = !reminders.find((x) => x.id === id)?.done;
    setReminders((r) => r.map((x) => (x.id === id ? { ...x, done: newDone, completed_at: newDone ? new Date().toISOString() : null } : x)));
    await supabase.from("reminders")
      .update({ done: newDone, completed_at: newDone ? new Date().toISOString() : null })
      .eq("id", id);
    if (newDone) setPendingReactionId(id);
    else setPendingReactionId(null);
  }

  async function saveReaction(id, reaction) {
    await supabase.from("reminders").update({ partner_reaction: reaction }).eq("id", id);
    setReminders((r) => r.map((x) => (x.id === id ? { ...x, partner_reaction: reaction } : x)));
    setPendingReactionId(null);
    setScoreVersion((v) => v + 1);
    const nudges = { 1: "Next time, start earlier.", 2: "She notices more than you think.", 3: "This is exactly why you do this." };
    setNudgeMessage(nudges[reaction]);
    setTimeout(() => setNudgeMessage(null), 3000);
  }

  const healthScore = score;
  const scoreColor = healthScore >= 85 ? T.green : healthScore >= 70 ? T.accent : healthScore >= 50 ? T.accent : T.red;
  const scoreZone = healthScore >= 85 ? "Exceptional" : healthScore >= 70 ? "On track" : healthScore >= 50 ? "Getting there" : "Room to grow";

  if (subscriptionLoaded && !hasAccess()) return <NoAccessScreen onUpgrade={handleUpgrade} />;

  return (
    <div style={{ width: "100%", maxWidth: 420, paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: "32px 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 22, color: T.accent, fontStyle: "italic", letterSpacing: 1 }}>GoddessAlert</div>
          <div style={{ fontSize: 11, color: T.muted, letterSpacing: 2, textTransform: "uppercase", marginTop: 2 }}>for attentive men</div>
          {streak > 1 && (
            <div style={{ fontSize: 11, color: T.accent, marginTop: 4 }}>
              🔥 {streak} {streak === 1 ? "day" : "days"} in a row
            </div>
          )}
        </div>
        {isPremium() ? (
          <div onClick={() => setShowScoreModal(true)} style={{ width: 56, height: 56, borderRadius: "50%", border: `3px solid ${scoreColor}`, background: T.accentSoft, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <div style={{ fontSize: 18, fontWeight: "bold", color: scoreColor, lineHeight: 1 }}>{healthScore}</div>
            <div style={{ fontSize: 8, color: T.muted, letterSpacing: 1, textTransform: "uppercase" }}>score</div>
          </div>
        ) : (
          <div style={{ width: 56, height: 56, borderRadius: "50%", border: `3px solid ${T.border}`, background: T.accentSoft, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 22 }}>🔒</div>
          </div>
        )}
      </div>

      <SubscriptionBanner subscription={subscription} onUpgrade={handleUpgrade} />

      {tab === "home" && (
        <HomeTab
          score={score}
          setScore={setScore}
          weeklyRating={weeklyRating}
          setWeeklyRating={setWeeklyRating}
          gestureDone={gestureDone}
          setGestureDone={setGestureDone}
          showRatingThanks={showRatingThanks}
          setShowRatingThanks={setShowRatingThanks}
          gestureRating={gestureRating}
          setGestureRating={setGestureRating}
          tips={tips}
          tipIndex={tipIndex}
          setTipIndex={setTipIndex}
          events={events}
          rateTip={rateTip}
          setScoreVersion={setScoreVersion}
          isPremium={isPremium()}
        />
      )}

      {tab === "events" && (
        <EventsTab
          events={events}
          setEvents={setEvents}
          isPremium={isPremium()}
          onUpgrade={() => handleUpgrade("monthly")}
        />
      )}

      {tab === "reminders" && (
        <RemindersTab
          reminders={reminders}
          setReminders={setReminders}
          toggleReminder={toggleReminder}
          saveReaction={saveReaction}
          pendingReactionId={pendingReactionId}
          nudgeMessage={nudgeMessage}
          isPremium={isPremium()}
          onUpgrade={() => handleUpgrade("monthly")}
        />
      )}

     {tab === "settings" && (
  <SettingsTab
    notifyEmail={notifyEmail}
    setNotifyEmail={setNotifyEmail}
    notifyPush={notifyPush}
    setNotifyPush={setNotifyPush}
    notifyDay={notifyDay}
    setNotifyDay={setNotifyDay}
    notifyTime={notifyTime}
    setNotifyTime={setNotifyTime}
    notifyTipEmail={notifyTipEmail}
    setNotifyTipEmail={setNotifyTipEmail}
    showTheCode={showTheCode}
    setShowTheCode={setShowTheCode}
    isPremium={isPremium()}
    onUpgrade={() => handleUpgrade("monthly")}
    currentUser={currentUser}
  />
)}

      {tab === "score" && (
        <HealthTab
          healthScore={healthScore}
          scoreColor={scoreColor}
          scoreZone={scoreZone}
          name={name}
          streak={streak}
          longestStreak={longestStreak}
          scorePercentages={scorePercentages}
          gestureDone={gestureDone}
          showRatingThanks={showRatingThanks}
          showTheCode={showTheCode}
          setShowTheCode={setShowTheCode}
          isPremium={isPremium()}
          onUpgrade={() => handleUpgrade("monthly")}
        />
      )}

      {/* Bottom Nav */}
      <div style={css.nav}>
        {[{ id: "home", icon: "🏠", label: "Home" }, { id: "events", icon: "📅", label: "Events" }, { id: "reminders", icon: "⏰", label: "To-do" }, { id: "score", icon: "💪", label: "Health" }, { id: "settings", icon: "⚙️", label: "Settings" }].map((n) => (
          <div key={n.id} onClick={() => setTab(n.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, cursor: "pointer", opacity: tab === n.id ? 1 : 0.4 }}>
            <div style={{ fontSize: 20 }}>{n.icon}</div>
            <div style={{ fontSize: 10, color: tab === n.id ? T.accent : T.muted, letterSpacing: 1, textTransform: "uppercase" }}>{n.label}</div>
          </div>
        ))}
      </div>

      {nudgeMessage && (
        <div style={{ position: "fixed", bottom: 90, left: "50%", transform: "translateX(-50%)", background: T.card, border: `1px solid ${T.accent}`, borderRadius: 16, padding: "14px 20px", fontSize: 13, color: T.accent, fontStyle: "italic", textAlign: "center", zIndex: 300, maxWidth: 320, boxShadow: "0 4px 24px #00000066" }}>
          {nudgeMessage}
        </div>
      )}

      {showAddModal && (
        <div style={css.modal} onClick={() => setShowAddModal(false)}>
          <div style={css.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 20, fontWeight: "bold", color: T.accent, marginBottom: 6 }}>Add Event</div>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 18 }}>What do you want to remember?</div>
            <input style={css.input} placeholder="Event name (e.g. Her work promotion)" value={newEvent.name} onChange={(e) => setNewEvent((n) => ({ ...n, name: e.target.value }))} />
            <input style={css.input} type="date" value={newEvent.date} onChange={(e) => setNewEvent((n) => ({ ...n, date: e.target.value }))} />
            <div style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>Alert me X days before:</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>{[3, 7, 14, 30].map((d) => (<button key={d} onClick={() => setNewEvent((n) => ({ ...n, daysBefore: d }))} style={{ flex: 1, background: newEvent.daysBefore === d ? T.accent : T.accentSoft, color: newEvent.daysBefore === d ? "#0d0d0d" : T.text, border: `1px solid ${newEvent.daysBefore === d ? T.accent : T.border}`, borderRadius: 10, padding: "10px 4px", fontSize: 13, fontWeight: "bold", cursor: "pointer", fontFamily: "Georgia, serif" }}>{d}d</button>))}</div>
            <button style={css.btn} onClick={addEvent}>Save Event</button>
            <button style={{ ...css.btnGhost, marginTop: 10 }} onClick={() => setShowAddModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showAddReminder && (
        <div style={{ ...css.modal, alignItems: "flex-end", overflowY: "auto" }} onClick={() => setShowAddReminder(false)}>
          <div style={{ ...css.modalBox, maxHeight: "90vh", overflowY: "auto", width: "100%", maxWidth: 420, boxSizing: "border-box" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 20, fontWeight: "bold", color: T.accent, marginBottom: 6 }}>New Reminder</div>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 18 }}>Set a personal reminder for yourself.</div>
            <label style={{ fontSize: 12, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6, display: "block" }}>What do you need to do?</label>
            <input style={css.input} placeholder="e.g. Take out the rubbish" value={newReminder.title} onChange={(e) => setNewReminder((r) => ({ ...r, title: e.target.value }))} />
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}><label style={{ fontSize: 12, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6, display: "block" }}>Date</label><input style={{ ...css.input, marginBottom: 12 }} type="date" value={newReminder.date} onChange={(e) => setNewReminder((r) => ({ ...r, date: e.target.value }))} /></div>
              <div style={{ flex: 1 }}><label style={{ fontSize: 12, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6, display: "block" }}>Time</label><input style={{ ...css.input, marginBottom: 12 }} type="time" value={newReminder.time} onChange={(e) => setNewReminder((r) => ({ ...r, time: e.target.value }))} /></div>
            </div>
            <label style={{ fontSize: 12, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, display: "block" }}>Repeat</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>{["never", "daily", "weekly", "monthly"].map((opt) => (<button key={opt} onClick={() => setNewReminder((r) => ({ ...r, repeat: opt }))} style={{ flex: 1, background: newReminder.repeat === opt ? T.accent : T.accentSoft, color: newReminder.repeat === opt ? "#0d0d0d" : T.text, border: `1px solid ${newReminder.repeat === opt ? T.accent : T.border}`, borderRadius: 10, padding: "9px 4px", fontSize: 11, fontWeight: "bold", cursor: "pointer", fontFamily: "Georgia, serif", textTransform: "capitalize" }}>{opt}</button>))}</div>
            <button style={{ ...css.btn, opacity: newReminder.title && newReminder.date && newReminder.time ? 1 : 0.4 }} onClick={addReminder}>Save Reminder</button>
            <button style={{ ...css.btnGhost, marginTop: 10 }} onClick={() => setShowAddReminder(false)}>Cancel</button>
          </div>
        </div>
      )}

      {showScoreModal && (
        <div style={css.modal} onClick={() => setShowScoreModal(false)}>
          <div style={css.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 20, fontWeight: "bold", color: scoreColor, marginBottom: 4 }}>Your Score: {healthScore}</div>
            <div style={{ fontSize: 12, color: scoreColor, marginBottom: 12, letterSpacing: 1, textTransform: "uppercase" }}>{scoreZone}</div>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 16, lineHeight: 1.6 }}>Your score rises when you complete reminders, act consistently, and check in weekly. It drops when you go quiet.</div>
            <div style={{ fontSize: 14, color: T.text, fontStyle: "italic", lineHeight: 1.7 }}>
              {healthScore >= 85 ? "🔥 She feels the difference. You're doing great." : healthScore >= 70 ? "💛 You're on track. Stay consistent." : healthScore >= 50 ? "⚡ Building momentum. Small actions add up." : "🌱 Room to grow. Start with today."}
            </div>
            <button style={{ ...css.btn, marginTop: 20 }} onClick={() => setShowScoreModal(false)}>Got it</button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div style={css.modal} onClick={() => !deleteLoading && setShowDeleteModal(false)}>
          <div style={css.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🗑️</div>
              <div style={{ fontSize: 20, fontWeight: "bold", color: T.red, marginBottom: 8 }}>Delete my account</div>
              <div style={{ fontSize: 13, color: T.muted, lineHeight: 1.7 }}>This will permanently delete all your data — events, reminders, check-ins, and your account. This cannot be undone.</div>
            </div>
            {deleteError && <div style={{ fontSize: 13, color: T.red, textAlign: "center", marginBottom: 12, padding: "10px", background: T.red + "15", borderRadius: 8 }}>{deleteError}</div>}
            <button style={{ ...css.btnDanger, opacity: deleteLoading ? 0.6 : 1, marginBottom: 10 }} onClick={handleDeleteAccount} disabled={deleteLoading}>{deleteLoading ? "Deleting..." : "Yes, delete everything"}</button>
            <button style={css.btnGhost} onClick={() => !deleteLoading && setShowDeleteModal(false)} disabled={deleteLoading}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ROOT ───────────────────────────────────────────────────

export default function GoddessAlert() {
  const [screen, setScreen] = useState("login");
  const [partnerData, setPartnerData] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session) {
        const { data: partner } = await supabase.from("partners").select("*").eq("user_id", session.user.id).maybeSingle();
        if (!partner) {
          setScreen("onboarding");
        } else {
          const { data: prefs } = await supabase
            .from("user_preferences")
            .select("assessment_completed_at, onboarding_skipped_assessment")
            .eq("user_id", session.user.id)
            .maybeSingle();
          const assessmentDone = prefs?.assessment_completed_at || prefs?.onboarding_skipped_assessment;
          setScreen(assessmentDone ? "app" : "assessment");
        }
        if (partner) setPartnerData({ herName: partner.name, herBirthday: partner.birthday });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const { data: partner } = await supabase.from("partners").select("*").eq("user_id", session.user.id).maybeSingle();
        if (!partner) {
          setScreen("onboarding");
        } else {
          const { data: prefs } = await supabase
            .from("user_preferences")
            .select("assessment_completed_at, onboarding_skipped_assessment")
            .eq("user_id", session.user.id)
            .maybeSingle();
          const assessmentDone = prefs?.assessment_completed_at || prefs?.onboarding_skipped_assessment;
          setScreen(assessmentDone ? "app" : "assessment");
        }
        if (partner) setPartnerData({ herName: partner.name, herBirthday: partner.birthday });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div style={css.app}>
      {screen === "login" && <LoginScreen onNext={() => setScreen("onboarding")} />}
      {screen === "onboarding" && <OnboardingScreen onDone={(data) => { setPartnerData(data); setScreen("assessment"); }} />}
      {screen === "assessment" && (
        <SelfAssessmentScreen
          onDone={() => setScreen("app")}
          onSkip={() => setScreen("app")}
        />
      )}
      {screen === "app" && <MainApp partnerData={partnerData} />}
    </div>
  );
}
