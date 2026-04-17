import { useState, useEffect } from "react";
import { supabase } from "../supabase";
import { T, css } from "../theme";
import TheCode from "./TheCode";

export default function SettingsTab({
  notifyEmail, setNotifyEmail,
  notifyPush, setNotifyPush,
  notifyDay, setNotifyDay,
  notifyTime, setNotifyTime,
  showTheCode, setShowTheCode,
}) {
  const [prefSaved, setPrefSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [partnerBirthday, setPartnerBirthday] = useState("");
  const [partnerAnniversary, setPartnerAnniversary] = useState("");
  const [partnerSaved, setPartnerSaved] = useState(false);

  useEffect(() => {
  async function loadPartnerData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data: partner } = await supabase.from("partners").select("name, birthday").eq("user_id", user.id).single();
    if (partner) { setPartnerName(partner.name || ""); setPartnerBirthday(partner.birthday || ""); }
    const { data: anniversary } = await supabase.from("events").select("date").eq("user_id", user.id).eq("category", "anniversary").single();
    if (anniversary) setPartnerAnniversary(anniversary.date || "");
  }
  loadPartnerData();
}, []);
  
  async function savePreferences() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const { data: existing } = await supabase.from("user_preferences").select("user_id").eq("user_id", user.id).single();
  if (existing) {
    await supabase.from("user_preferences").update({ notify_email: notifyEmail, notify_push: notifyPush, notify_day: notifyDay, notify_time: notifyTime, updated_at: new Date().toISOString() }).eq("user_id", user.id);
  } else {
    await supabase.from("user_preferences").insert({ user_id: user.id, notify_email: notifyEmail, notify_push: notifyPush, notify_day: notifyDay, notify_time: notifyTime });
  }
  setPrefSaved(true);
  setTimeout(() => setPrefSaved(false), 2000);
}
async function savePartnerData() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await supabase.from("partners").update({ name: partnerName, birthday: partnerBirthday }).eq("user_id", user.id);
  const { data: existing } = await supabase.from("events").select("id").eq("user_id", user.id).eq("category", "anniversary").single();
  if (existing) {
    await supabase.from("events").update({ date: partnerAnniversary, name: "Anniversary" }).eq("id", existing.id);
  } else if (partnerAnniversary) {
    await supabase.from("events").insert({ user_id: user.id, name: "Anniversary", date: partnerAnniversary, days_before: 7, emoji: "💍", category: "anniversary", repeat_yearly: true });
  }
  const { data: birthdayEvent } = await supabase.from("events").select("id").eq("user_id", user.id).eq("category", "birthday").single();
  if (birthdayEvent) {
    await supabase.from("events").update({ date: partnerBirthday, name: `${partnerName}'s Birthday` }).eq("id", birthdayEvent.id);
  }
  setPartnerSaved(true);
  setTimeout(() => setPartnerSaved(false), 2000);
}
  async function handleDeleteAccount() {
    setDeleteLoading(true); setDeleteError("");
    try {
      const { data: { user } } = await supabase.auth.getUser();
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

  return (
    <div style={{ padding: "8px 24px" }}>
      <div style={css.sectionTitle}>How to notify me</div>
      <div style={css.card}>
        {[{ label: "📧 Email reminders", sub: "Reliable — works on all devices", val: notifyEmail, set: setNotifyEmail }].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 14, color: T.text }}>{item.label}</div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>{item.sub}</div>
            </div>
            <div onClick={() => item.set((v) => !v)} style={{ width: 44, height: 24, borderRadius: 12, background: item.val ? T.accent : T.border, position: "relative", cursor: "pointer", flexShrink: 0 }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: item.val ? 23 : 3, transition: "left 0.2s" }} />
            </div>
          </div>
        ))}
      </div>
      {notifyEmail && (
        <div style={{ ...css.card, background: T.accentSoft, border: `1px solid ${T.accent}33`, marginBottom: 10 }}>
          <div style={{ fontSize: 12, color: T.accent, lineHeight: 1.6 }}>✉️ Reminders will be sent to the email you signed in with. Make sure to check your spam folder the first time.</div>
        </div>
      )}

      <div style={{ ...css.sectionTitle, marginTop: 16 }}>Weekly check-in schedule</div>
      <div style={css.card}>
        <div style={{ fontSize: 13, color: T.muted, marginBottom: 12 }}>When should we nudge you to check in?</div>
        <label style={{ fontSize: 12, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6, display: "block" }}>Day</label>
        <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
          {["mon", "tue", "wed", "thu", "fri", "sat", "sun"].map((d) => (
            <button key={d} onClick={() => setNotifyDay(d)} style={{ flex: 1, minWidth: 36, background: notifyDay === d ? T.accent : T.accentSoft, color: notifyDay === d ? "#0d0d0d" : T.text, border: `1px solid ${notifyDay === d ? T.accent : T.border}`, borderRadius: 8, padding: "8px 4px", fontSize: 11, fontWeight: "bold", cursor: "pointer", fontFamily: "Georgia, serif" }}>{d}</button>
          ))}
        </div>
        <label style={{ fontSize: 12, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6, display: "block" }}>Time</label>
        <input type="time" value={notifyTime} onChange={(e) => setNotifyTime(e.target.value)} style={{ ...css.input, marginBottom: 0 }} />
      </div>

      <button style={{ ...css.btn, marginTop: 8, background: prefSaved ? T.green : T.accent }} onClick={savePreferences}>
        {prefSaved ? "✓ Saved" : "Save preferences"}
      </button>
<div style={{ ...css.sectionTitle, marginTop: 24 }}>Partner details</div>
<div style={css.card}>
  <label style={{ fontSize: 12, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6, display: "block" }}>Her name</label>
  <input style={css.input} value={partnerName} onChange={(e) => setPartnerName(e.target.value)} placeholder="Her name" />
  <label style={{ fontSize: 12, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6, display: "block" }}>Her birthday</label>
  <input style={css.input} type="date" value={partnerBirthday} onChange={(e) => setPartnerBirthday(e.target.value)} />
  <label style={{ fontSize: 12, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6, display: "block" }}>Anniversary</label>
  <input style={{ ...css.input, marginBottom: 0 }} type="date" value={partnerAnniversary} onChange={(e) => setPartnerAnniversary(e.target.value)} />
</div>
<button style={{ ...css.btn, marginTop: 8, background: partnerSaved ? T.green : T.accent }} onClick={savePartnerData}>
  {partnerSaved ? "✓ Saved" : "Save partner details"}
</button>
      <div style={{ ...css.sectionTitle, marginTop: 24 }}>Legal</div>
      <div style={css.card}>
        {[{ label: "📄 Terms of Use", sub: "Your rights and responsibilities", url: "https://goddessalert.com/terms.html" }, { label: "🔒 Privacy Policy", sub: "How we handle your data", url: "https://goddessalert.com/privacy.html" }].map((item, i) => (
          <div key={i} onClick={() => window.open(item.url, "_blank")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingBottom: 14, marginBottom: 14, borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}>
            <div>
              <div style={{ fontSize: 14, color: T.text }}>{item.label}</div>
              <div style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>{item.sub}</div>
            </div>
            <div style={{ fontSize: 16, color: T.muted }}>›</div>
          </div>
        ))}
        <div onClick={() => setShowDeleteModal(true)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }}>
          <div>
            <div style={{ fontSize: 14, color: T.red }}>🗑️ Delete my account</div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 3 }}>Permanently remove all your data</div>
          </div>
          <div style={{ fontSize: 16, color: T.muted }}>›</div>
        </div>
      </div>

      <div style={{ fontSize: 11, color: T.muted, textAlign: "center", marginTop: 12, marginBottom: 8, lineHeight: 1.6 }}>
        GoddessAlert v1.1 · By using this app you agree to our Terms of Use and Privacy Policy
      </div>

      <TheCode showTheCode={showTheCode} setShowTheCode={setShowTheCode} />

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
