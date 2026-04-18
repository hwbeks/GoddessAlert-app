import { useState } from "react";
import { supabase } from "../supabase";
import { T, css } from "../theme";
import UpsellPrompt from "./UpsellPrompt";

function daysUntil(dateStr) {
  const today = new Date();
  const target = new Date(dateStr + "T00:00:00");
  target.setFullYear(today.getFullYear());
  if (target.getMonth() === today.getMonth() && target.getDate() === today.getDate()) return 0;
  if (target < today) target.setFullYear(today.getFullYear() + 1);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export default function EventsTab({ events, setEvents, isPremium, onUpgrade }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpsell, setShowUpsell] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: "", date: "", daysBefore: 7 });

  async function addEvent() {
    if (!newEvent.name || !newEvent.date) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("events").insert({
        user_id: user.id,
        name: newEvent.name,
        date: newEvent.date,
        days_before: newEvent.daysBefore || 7,
        emoji: "📅",
        repeat_yearly: true
      });

      if (error) {
        console.error("Event insert error:", error);
        return;
      }

      const { data: fresh } = await supabase
        .from("events")
        .select("*")
        .eq("user_id", user.id);

      if (fresh) {
        setEvents([...fresh].sort((a, b) => daysUntil(a.date) - daysUntil(b.date)));
      }
    } catch (err) {
      console.error("addEvent error:", err);
    }

    setNewEvent({ name: "", date: "", daysBefore: 7 });
    setShowAddModal(false);
  }

  function handleAddClick() {
    if (!isPremium) {
      setShowUpsell(true);
    } else {
      setShowUpsell(false);
      setShowAddModal(true);
    }
  }

  return (
    <div style={{ padding: "8px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div style={css.sectionTitle}>Upcoming Events</div>
        <button
          onClick={handleAddClick}
          style={{ background: T.accent, color: "#0d0d0d", border: "none", borderRadius: 20, padding: "5px 14px", fontWeight: "bold", fontSize: 12, cursor: "pointer", fontFamily: "Georgia, serif" }}
        >
          + Add
        </button>
      </div>

      {showUpsell && (
        <UpsellPrompt
          message="Want to add more special moments? Upgrade to Premium for unlimited events."
          onUpgrade={onUpgrade}
        />
      )}

      {events.map((ev) => {
        const days = daysUntil(ev.date);
        return (
          <div key={ev.id} style={days <= 7 ? css.cardAccent : css.card}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 28 }}>{ev.emoji}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: "bold" }}>{ev.name}</div>
                  <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>Alert: {ev.days_before} days before</div>
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: "bold", color: days <= 3 ? T.red : days <= 7 ? T.accent : T.green }}>
                  {days === 0 ? "🎉" : days}
                </div>
                <div style={{ fontSize: 10, color: T.muted, textTransform: "uppercase", letterSpacing: 1 }}>
                  {days === 0 ? "today" : "days"}
                </div>
              </div>
            </div>
            {days <= 7 && (
              <div style={{ marginTop: 10, padding: "8px 12px", background: T.red + "15", borderRadius: 8, fontSize: 12, color: T.red }}>
                {days === 0 ? "🎉 Today is the day! Don't forget to make it special." : "⚡ Action needed — don't wait any longer"}
              </div>
            )}
          </div>
        );
      })}

      {showAddModal && (
        <div style={css.modal} onClick={() => setShowAddModal(false)}>
          <div style={css.modalBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: 20, fontWeight: "bold", color: T.accent, marginBottom: 6 }}>Add Event</div>
            <div style={{ fontSize: 13, color: T.muted, marginBottom: 18 }}>What do you want to remember?</div>
            <input style={css.input} placeholder="Event name (e.g. Her work promotion)" value={newEvent.name} onChange={(e) => setNewEvent((n) => ({ ...n, name: e.target.value }))} />
            <input style={css.input} type="date" value={newEvent.date} onChange={(e) => setNewEvent((n) => ({ ...n, date: e.target.value }))} />
            <div style={{ fontSize: 12, color: T.muted, marginBottom: 8 }}>Alert me X days before:</div>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {[3, 7, 14, 30].map((d) => (
                <button key={d} onClick={() => setNewEvent((n) => ({ ...n, daysBefore: d }))} style={{ flex: 1, background: newEvent.daysBefore === d ? T.accent : T.accentSoft, color: newEvent.daysBefore === d ? "#0d0d0d" : T.text, border: `1px solid ${newEvent.daysBefore === d ? T.accent : T.border}`, borderRadius: 10, padding: "10px 4px", fontSize: 13, fontWeight: "bold", cursor: "pointer", fontFamily: "Georgia, serif" }}>{d}d</button>
              ))}
            </div>
            <button style={css.btn} onClick={addEvent}>Save Event</button>
            <button style={{ ...css.btnGhost, marginTop: 10 }} onClick={() => setShowAddModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
