import { useState, useRef, useEffect } from "react";
import { supabase } from "../supabase";
import { T, css } from "../theme";

export default function RemindersTab({
  reminders,
  setReminders,
  toggleReminder,
  saveReaction,
  pendingReactionId,
  nudgeMessage,
}) {
  const [showAddReminder, setShowAddReminder] = useState(false);
  const [newReminder, setNewReminder] = useState({ title: "", date: "", time: "", repeat: "never" });
  const reactionRef = useRef(null);

  useEffect(() => {
    if (pendingReactionId && reactionRef.current) {
      setTimeout(() => {
        reactionRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    }
  }, [pendingReactionId]);

  async function addReminder() {
    if (!newReminder.title || !newReminder.date || !newReminder.time) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase.from("reminders").insert({
      user_id: user.id,
      title: newReminder.title,
      date: newReminder.date,
      time: newReminder.time,
      repeat: newReminder.repeat,
      done: false
    }).select().single();
    if (error) console.error("Reminder insert error:", error);
    if (data) setReminders((r) => [data, ...r]);
    setNewReminder({ title: "", date: "", time: "", repeat: "never" });
    setShowAddReminder(false);
  }

  const openReminders = reminders
    .filter((r) => !r.done)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const completedReminders = reminders
    .filter((r) => r.done)
    .sort((a, b) => {
      const dateA = a.completed_at ? new Date(a.completed_at) : new Date(0);
      const dateB = b.completed_at ? new Date(b.completed_at) : new Date(0);
      return dateB - dateA;
    });

  return (
    <div style={{ padding: "8px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={css.sectionTitle}>My Reminders</div>
        <button
          onClick={() => setShowAddReminder(true)}
          style={{ background: T.accent, color: "#0d0d0d", border: "none", borderRadius: 20, padding: "5px 14px", fontWeight: "bold", fontSize: 12, cursor: "pointer", fontFamily: "Georgia, serif" }}
        >
          + Add
        </button>
      </div>

      {openReminders.length === 0 && (
        <div style={{ ...css.card, textAlign: "center", padding: "28px 18px" }}>
          <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
          <div style={{ fontSize: 14, color: T.muted }}>All clear — nothing pending</div>
        </div>
      )}

      {openReminders.map((r) => (
        <div key={r.id} style={css.cardAccent}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <button
              onClick={() => toggleReminder(r.id)}
              style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, border: `2px solid ${T.accent}`, background: "transparent", cursor: "pointer", marginTop: 2 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: "bold", color: T.text }}>{r.title}</div>
              <div style={{ display: "flex", gap: 10, marginTop: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, color: T.muted }}>📅 {new Date(r.date + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
                <span style={{ fontSize: 12, color: T.muted }}>🕐 {r.time}</span>
                {r.repeat !== "never" && <span style={{ fontSize: 11, color: T.accent, background: T.accentSoft, padding: "2px 8px", borderRadius: 10 }}>↻ {r.repeat}</span>}
              </div>
              {pendingReactionId === r.id && (
                <div ref={reactionRef} style={{ marginTop: 12, padding: "12px 14px", background: "#ffffff08", borderRadius: 12 }}>
                  <div style={{ fontSize: 13, color: T.muted, marginBottom: 10 }}>How did she react?</div>
                  <div style={{ display: "flex", gap: 16 }}>
                    {[{ emoji: "😠", value: 1 }, { emoji: "😐", value: 2 }, { emoji: "😊", value: 3 }].map(({ emoji, value }) => (
                      <button key={value} onClick={() => saveReaction(r.id, value)} style={{ fontSize: 26, background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 8 }}>
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {completedReminders.length > 0 && (<>
        <div style={{ ...css.sectionTitle, marginTop: 20 }}>Completed</div>
        {completedReminders.map((r) => (
          <div key={r.id} style={{ ...css.card, opacity: pendingReactionId === r.id ? 1 : 0.5 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <button
                onClick={() => toggleReminder(r.id)}
                style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0, border: `2px solid ${T.green}`, background: T.green + "33", cursor: "pointer", fontSize: 12, color: T.green, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2 }}
              >✓</button>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: T.muted, textDecoration: "line-through" }}>{r.title}</div>
                {pendingReactionId === r.id && (
                  <div ref={reactionRef} style={{ marginTop: 12, padding: "12px 14px", background: "#ffffff08", borderRadius: 12 }}>
                    <div style={{ fontSize: 13, color: T.muted, marginBottom: 10 }}>How did she react?</div>
                    <div style={{ display: "flex", gap: 16 }}>
                      {[{ emoji: "😠", value: 1 }, { emoji: "😐", value: 2 }, { emoji: "😊", value: 3 }].map(({ emoji, value }) => (
                        <button key={value} onClick={(e) => { e.stopPropagation(); saveReaction(r.id, value); }} style={{ fontSize: 26, background: "none", border: "none", cursor: "pointer", padding: "4px 8px", borderRadius: 8 }}>
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </>)}

      {showAddReminder && (
        <div
          style={{ ...css.modal, alignItems: "flex-end", overflowY: "auto" }}
          onClick={() => setShowAddReminder(false)}
        >
          <div
            style={{ ...css.modalBox, maxHeight: "90vh", overflowY: "auto", width: "100%", maxWidth: 420, boxSizing: "border-box" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: 20, fontWeight: "bold", color: T.accent, marginBottom: 6 }}>New Reminder</div>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 18 }}>Set a personal reminder for yourself.</div>
            <label style={{ fontSize: 12, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6, display: "block" }}>What do you need to do?</label>
            <input
              style={css.input}
              placeholder="e.g. Take out the rubbish"
              value={newReminder.title}
              onChange={(e) => setNewReminder((r) => ({ ...r, title: e.target.value }))}
            />
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6, display: "block" }}>Date</label>
                <input style={{ ...css.input, marginBottom: 12 }} type="date" value={newReminder.date} onChange={(e) => setNewReminder((r) => ({ ...r, date: e.target.value }))} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 12, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 6, display: "block" }}>Time</label>
                <input style={{ ...css.input, marginBottom: 12 }} type="time" value={newReminder.time} onChange={(e) => setNewReminder((r) => ({ ...r, time: e.target.value }))} />
              </div>
            </div>
            <label style={{ fontSize: 12, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 8, display: "block" }}>Repeat</label>
            <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
              {["never", "daily", "weekly", "monthly"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setNewReminder((r) => ({ ...r, repeat: opt }))}
                  style={{ flex: 1, background: newReminder.repeat === opt ? T.accent : T.accentSoft, color: newReminder.repeat === opt ? "#0d0d0d" : T.text, border: `1px solid ${newReminder.repeat === opt ? T.accent : T.border}`, borderRadius: 10, padding: "9px 4px", fontSize: 11, fontWeight: "bold", cursor: "pointer", fontFamily: "Georgia, serif", textTransform: "capitalize" }}
                >
                  {opt}
                </button>
              ))}
            </div>
            <button
              style={{ ...css.btn, opacity: newReminder.title && newReminder.date && newReminder.time ? 1 : 0.4 }}
              onClick={addReminder}
            >
              Save Reminder
            </button>
            <button style={{ ...css.btnGhost, marginTop: 10 }} onClick={() => setShowAddReminder(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
