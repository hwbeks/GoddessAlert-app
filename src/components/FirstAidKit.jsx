import { T } from "../theme";
import { useState } from "react";

export default function FirstAidKit({ showFirstAidKit, setShowFirstAidKit }) {
  const [view, setView] = useState("overview"); // "overview" | "repair" | 0-8 (topic index)

  const topics = [
    {
      title: "Criticism",
      shortTitle: "Criticism",
      shortDesc: "when complaint becomes attack",
      category: "pattern",
      feeling: "You're frustrated about something specific, and you've finally found the words to bring it up. To you it feels like honesty. Like finally saying what's been building.",
      forHer: "What you experience as honesty, she may hear as a verdict on who she is — and it may come as a surprise. You've been building toward this. She hasn't. \"You always\" and \"you never\" don't open a conversation — they close one. She defends, or she goes quiet, and the actual issue stays unaddressed.",
      tryThis: "Stay specific. Stay in this moment, not the pattern. Speak from how you feel, not from what she is or isn't.",
      notSay: "You never listen.",
      insteadSay: "I felt unheard earlier when I was telling you about work.",
    },
    {
      title: "Contempt",
      shortTitle: "Contempt",
      shortDesc: "sarcasm, eye-rolls, the tone",
      category: "pattern",
      feeling: "After a long time of unaddressed frustration, something in you has hardened. You may not even notice you're doing it — the look, the sigh, the dry response. It feels like restraint, or like calling things by their real name. Sometimes it comes out as humor — something you could shrug off as just a joke — but it lands more like a whip. Sometimes it's all you have left.",
      forHer: "What you may experience as not taking the subject too seriously, she experiences as not taking her seriously. Contempt signals that you look down on her — even when you don't mean to. She feels disrespected on something that matters to her, and disrespect on what matters cuts deeper than disagreement ever could. Over time, this pattern corrodes relationships more than anger or distance ever do.",
      tryThis: "Notice the edge before it lands. The underlying frustration is often valid — but sarcasm closes the conversation before it can start. Take ownership of the tone first, then make clear you're choosing to listen.",
      notSay: "Obviously you'd say that.",
      insteadSay: "I notice I'm being sharp. I'm here to really hear you. Help me understand why this matters to you.",
      tagline: "The one that quietly does the most damage.",
    },
    {
      title: "Defensiveness",
      shortTitle: "Defensiveness",
      shortDesc: "the urge to defend before listening",
      category: "pattern",
      feeling: "You feel attacked. Misunderstood. Like she's not seeing the full picture, or has missed an important detail. There's an urgency in you to correct the record — to get the facts straight before she goes further with her version. To you it feels like clarification, not deflection.",
      forHer: "She didn't come for a debate. When she brought something up — even something that sounded like a complaint — she was likely looking for connection: for you to be with her, to understand what she felt, to make her feel safe enough to be honest. What you experience as setting things straight, she experiences as her reality being put on trial. The message she receives isn't \"I want to understand\" — it's \"your feelings need to pass a fact-check before they're allowed to exist.\" What started as a small frustration can quickly escalate into a loud argument — and over time, she may stop bringing things up at all.",
      tryThis: "Receive before you respond. She's looking for safety and acknowledgment — be there for her in this moment, even if your version of what happened is different. There will be another time to come back to factual points, once you've reconnected.",
      notSay: "That's not what happened.",
      insteadSay: "I can see how this matters to you. Tell me more.",
    },
    {
      title: "Stonewalling",
      shortTitle: "Stonewalling",
      shortDesc: "going inside, shutting down",
      category: "pattern",
      feeling: "Overloaded. Like the conversation has become more than you can handle. Your heart rate is up, your thinking gets foggy, words won't come. It may feel like she has easier access to her emotions than you have to yours — and in that imbalance, silence can seem stronger than stumbling over your own feelings. Going silent feels like the only way to not say something worse. Pulling back feels like self-protection.",
      forHer: "She didn't lose you to anger — she lost you to silence, which can be harder to bear. What you experience as protection, she experiences as abandonment. The conversation hasn't ended for her. She's still in it, alone, often replaying her words and wondering what she did wrong. Or the silence becomes unbearable, and she erupts — a tirade meant to break through, even though that's the last thing she wanted. Either way, the longer the silence lasts, the more it confirms what she fears: that she matters less than your discomfort.",
      tryThis: "Name what's happening before you pull back. A short break is fine — disappearing without warning is what wounds. The space itself isn't the problem; the unspoken leaving is. Commit to coming back, then actually come back.",
      notSay: "Silent walk-out, or shutting down without a word.",
      insteadSay: "I'm overloaded. Give me thirty minutes to find the right words for my emotions. I'll come back to this — I promise.",
    },
    {
      title: "When she's quieter than usual",
      shortTitle: "When she's quieter than usual",
      shortDesc: null,
      category: "situation",
      tagline: "A woman who falls silent hasn't gone cold. She's waiting to see if you'll notice.",
      feeling: "Things have been calmer between you. Fewer issues raised. Less bringing things up. You may have told yourself she's just busy, or tired, or finally relaxed. Maybe you've even felt relieved that the friction has gone quiet.",
      forHer: "The quiet you experience as peace, she may experience as resignation. She probably hasn't stopped feeling things — she's stopped believing that bringing them up will lead anywhere. Each unaddressed moment becomes a small confirmation that her reaching doesn't reach you. Over time she moves the conversation elsewhere — to friends, to her sister, to her own private thoughts — and what's left between you is logistics.",
      tryThis: "Notice the silence out loud, without demanding explanation. Show her that her quiet hasn't escaped you. Make space for her to fill it when she's ready, knowing she may need time to trust the opening.",
      notSay: "What's wrong?",
      insteadSay: "I notice we share less of what's on our minds lately. I find it valuable for us if we can do that again, in our own time.",
    },
    {
      title: "When something small blew up big",
      shortTitle: "When something small blew up big",
      shortDesc: null,
      category: "situation",
      preface: "A variant of defensiveness, with a specific twist: this time the facts are clear — you did do the thing. What surprises you isn't what she's reacting to, but how strongly she's reacting.",
      tagline: "It's almost never about the small thing. The small thing reminded her of a hundred others.",
      feeling: "Defending yourself feels pointless — the facts speak for themselves. But the size of her reaction feels disproportionate. A forgotten dinner, a late text, an offhand comment — something small triggered something big, and you're scrambling to understand why this, why now, why so much.",
      forHer: "For her, this isn't one moment. This is the latest in a pattern she's been quietly tracking, often without words for it. The forgotten dinner is the tenth forgotten something. The late text is part of months of feeling like an afterthought. Your defense of the single incident confirms what she fears: that you only see what's in front of you, not what's been building. She's not overreacting to the small thing — she's finally reacting to the pattern.",
      tryThis: "Stop defending the small thing. Step back from the specific moment and ask about what sits underneath it. The pattern may be uncomfortable to hear, but hearing it is where repair begins.",
      notSay: "It was just a forgotten dinner.",
      insteadSay: "I can see this isn't only about tonight. What's been building that I haven't seen?",
    },
    {
      title: "When you feel rejected and can't say it",
      shortTitle: "When you feel rejected and can't say it",
      shortDesc: null,
      category: "situation",
      tagline: "Repeated rejection becomes a story you tell yourself silently. The silence costs more than speaking would.",
      feeling: "After enough times of reaching toward her and being met with \"not tonight\", \"I'm tired\", or \"later\" — something in you stops reaching. At first there's hurt and confusion: the evening felt warm, the connection seemed real, why doesn't intimacy follow naturally? Then come the doubts that go deeper — about yourself, about whether you still draw her, about whether what you have together has quietly changed shape. Each refusal felt small in isolation. Together they've built into something that sits heavy in your chest. Slowly, without anyone choosing it, the feeling settles in: that you've become housemates more than partners.",
      forHer: "She's likely living the same loss from the other side. What you experience as her rejection may, for her, be the absence of something she needs before desire can rise — the felt safety of being seen, the warmth of real connection, the sense of not being approached only when intimacy is on the table. She isn't refusing you out of indifference. She's withholding from a place of disconnection she may not have words for either. And she feels the same drift you do: the slow becoming of housemates, the loss of something that used to feel alive.",
      tryThis: "This is delicate ground where quick fixes don't work. There's no Instead-line that rebuilds what's been quietly eroding. What helps is honest, sustained attention to something deeper than the rejection: the connection, trust, and safety that intimacy rests on. That can't be forced into being, and it can't be performed for the sake of ending the absence. It grows back through listening, through curiosity about what she actually needs, and through being willing to hear that what she needs may be different from what you assumed.\n\nThis work is personal. No script fits every relationship. And given how deep this can run, it's often more than a generic app like this can address on its own. But naming the loss out loud, together, is usually where it starts.",
      notSay: "You don't want me anymore.",
      insteadSay: "I've been holding back because I haven't known how to say I miss us — not just in the bedroom, but as the lovers we used to be.",
    },
    {
      title: "When you've stopped talking about anything real",
      shortTitle: "When you've stopped talking about anything real",
      shortDesc: null,
      category: "situation",
      tagline: "Logistics replaced conversation. You manage a household together. You haven't shared anything that mattered in weeks.",
      feeling: "On the surface, things feel fine. There aren't fights. There aren't problems being raised. You may have settled into something that looks like peace and feels like distance, but you haven't named which one it is. The days fill themselves with what needs doing — schedules, errands, kids, work — and the rest stays unsaid. You may even have stopped noticing that something is missing.",
      forHer: "She's likely living next to you, not with you. Still showing up, still functioning, still doing what's needed — but her real conversations may be happening with everyone except you. The friend who knows what's on her mind. The sister who hears about her worries. The colleague she vents to over coffee. The silence at dinner that feels normal to you may feel lonely to her. Over time, she stops carrying her inner life into your shared space — not because she doesn't want to share it, but because she's stopped expecting that there's room for it.",
      tryThis: "Ask one question that has nothing to do with logistics. Listen to the answer without moving to the next thing. Real conversation doesn't rebuild itself in one evening — but it doesn't rebuild itself at all without one of you starting. The smallest question, honestly asked, is often where the door opens.",
      notSay: "Did you pick up the kids?",
      insteadSay: "What's been on your mind lately that we haven't talked about?",
    },
    {
      title: "When helpfulness becomes waiting for instructions",
      shortTitle: "When helpfulness becomes waiting for instructions",
      shortDesc: null,
      category: "situation",
      tagline: "Asking \"what can I do for you?\" sounds attentive. Done often enough, it puts her in charge of running the relationship.",
      feeling: "You want to help. You want to show up for her. You ask what she needs, you wait to be told, and then you do it well. From where you stand, this is care — you're being responsive, you're not assuming, you're making yourself useful. Asking is respectful. Doing is love. That's the logic you may be working from.",
      forHer: "She probably notices the willingness. But over time, something starts to wear thin. She wasn't looking for a helper — she was looking for a team. The asking puts her in charge of thinking for both of you: what's needed, when, how. She becomes the one who notices, who decides, who delegates. That isn't partnership — that's management. And under the surface, she may start to long for something simpler: to be surprised. To discover that you saw something before she named it. To feel like part of a team, not someone's assistant.",
      tryThis: "Keep your eyes open — not just to what she wants, but to what your shared life needs to keep working. The dentist appointment that needs booking. The school form that's due next week. The friend's birthday coming up. The dishes that aren't going to wash themselves. A team functions when both people see the load and pick up their share, not when one carries the mental list and the other waits to be told what to do. Use whatever helps you remember (calendar, reminders, even this app) — but let the seeing come from you. Initiative is more attractive than service. Carrying your share lands deeper than executing requests.",
      notSay: "What can I do for you?",
      insteadSay: "Doing the thing that needed doing — booking the appointment, picking up the gift, noticing what was about to fall — without waiting for her instructions or approval.",
    },
  ];

  // ─── SVG-icoon Verbandtrommel ─────────────────────
  const FirstAidIcon = ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ display: "block" }}>
      <rect x="8" y="20" width="48" height="36" rx="3" fill="none" stroke={T.accent} strokeWidth="2.5" />
      <path d="M24 20 V14 a4 4 0 014-4 h8 a4 4 0 014 4 v6" fill="none" stroke={T.accent} strokeWidth="2.5" />
      <line x1="32" y1="32" x2="32" y2="44" stroke={T.accent} strokeWidth="3" strokeLinecap="round" />
      <line x1="26" y1="38" x2="38" y2="38" stroke={T.accent} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );

  if (!showFirstAidKit) {
    return (
      <div
        onClick={() => setShowFirstAidKit(true)}
        style={{
          background: "linear-gradient(135deg, #1a1600, #161616)",
          border: `1px solid ${T.accent}44`,
          borderRadius: 16,
          padding: "24px 18px",
          marginTop: 16,
          marginBottom: 10,
          textAlign: "center",
          cursor: "pointer",
        }}
      >
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
          <FirstAidIcon size={48} />
        </div>
        <div style={{ fontSize: 14, color: T.accent, fontStyle: "italic", marginBottom: 8, lineHeight: 1.5 }}>
          "When the going gets tough,<br />the tough get going."
        </div>
        <div style={{ fontSize: 12, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginTop: 6 }}>
          First Aid Kit →
        </div>
      </div>
    );
  }

  // ─── Topic view (Laag 2) ───────────────────────────
  if (typeof view === "number") {
    const t = topics[view];
    return (
      <div style={{ padding: "20px 24px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <span onClick={() => setView("overview")} style={{ fontSize: 12, color: T.muted, cursor: "pointer", letterSpacing: 1 }}>← Back</span>
          <span onClick={() => setShowFirstAidKit(false)} style={{ fontSize: 12, color: T.muted, cursor: "pointer", letterSpacing: 1 }}>✕ Close</span>
        </div>

        <div style={{ fontSize: 11, color: T.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
          {t.category === "pattern" ? "Pattern" : "Situation"}
        </div>
        <div style={{ fontSize: 22, color: T.text, fontStyle: "italic", marginBottom: 6, lineHeight: 1.3 }}>
          {t.title}
        </div>
        {t.tagline && (
          <div style={{ fontSize: 14, color: T.muted, fontStyle: "italic", marginBottom: 20, lineHeight: 1.6 }}>
            {t.tagline}
          </div>
        )}
        {t.preface && (
          <div style={{ fontSize: 12, color: T.muted, background: T.accentSoft, border: `1px solid ${T.accent}33`, borderRadius: 10, padding: "12px 14px", marginBottom: 20, lineHeight: 1.6 }}>
            {t.preface}
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: T.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>What you're feeling</div>
          <div style={{ fontSize: 13, color: T.text, lineHeight: 1.7, whiteSpace: "pre-line" }}>{t.feeling}</div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: T.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>How it may land for her</div>
          <div style={{ fontSize: 13, color: T.text, lineHeight: 1.7, whiteSpace: "pre-line" }}>{t.forHer}</div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: T.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>What you might try</div>
          <div style={{ fontSize: 13, color: T.text, lineHeight: 1.7, whiteSpace: "pre-line" }}>{t.tryThis}</div>
        </div>

        <div style={{ background: T.accentSoft, border: `1px solid ${T.accent}33`, borderRadius: 12, padding: "16px 16px", marginTop: 20 }}>
          <div style={{ fontSize: 11, color: T.muted, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Not</div>
          <div style={{ fontSize: 13, color: T.muted, fontStyle: "italic", marginBottom: 12, lineHeight: 1.6 }}>"{t.notSay}"</div>
          <div style={{ fontSize: 11, color: T.accent, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>Instead</div>
          <div style={{ fontSize: 13, color: T.text, fontStyle: "italic", lineHeight: 1.6 }}>"{t.insteadSay}"</div>
        </div>

        <div style={{ fontSize: 11, color: T.muted, textAlign: "center", marginTop: 24, fontStyle: "italic" }}>
          Want to understand more about this? →
          <div style={{ fontSize: 10, marginTop: 4 }}>(coming in next version)</div>
        </div>
      </div>
    );
  }

  // ─── Repair view (Laag 1B) ─────────────────────────
  if (view === "repair") {
    return (
      <div style={{ padding: "20px 24px 80px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <span onClick={() => setView("overview")} style={{ fontSize: 12, color: T.muted, cursor: "pointer", letterSpacing: 1 }}>← Back</span>
          <span onClick={() => setShowFirstAidKit(false)} style={{ fontSize: 12, color: T.muted, cursor: "pointer", letterSpacing: 1 }}>✕ Close</span>
        </div>

        <div style={{ fontSize: 11, color: T.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>A note on</div>
        <div style={{ fontSize: 26, color: T.text, fontStyle: "italic", marginBottom: 24 }}>Repair</div>

        <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 16 }}>
          Conflict happens in any close relationship. What matters more than avoiding it is what you do with what's left between you afterwards.
        </div>

        <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 16 }}>
          Repair begins earlier than you think. The moment you sense the tension rising, the way you stay connected — through a softer tone, a hand on hers, an acknowledgment that this matters — already shapes how easy or hard repair will be afterwards.
        </div>

        <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 16 }}>
          When the conflict is over, don't rush past it. Don't pretend it didn't happen. Come back to it, even briefly, even a day later. Acknowledge what was hard. Take ownership of your part without making it your full identity. Listen to her version without needing to defend yours yet.
        </div>

        <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, fontStyle: "italic", marginTop: 24, paddingTop: 24, borderTop: `1px solid ${T.border}` }}>
          Repair isn't about erasing the conflict. It's about choosing how you move forward together — sometimes, in ways that make you stronger.
        </div>
      </div>
    );
  }

  // ─── Overview (Laag 1) ─────────────────────────────
  return (
    <div style={{ padding: "20px 24px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 11, color: T.accent, letterSpacing: 2, textTransform: "uppercase" }}>First Aid Kit</div>
        <span onClick={() => setShowFirstAidKit(false)} style={{ fontSize: 12, color: T.muted, cursor: "pointer", letterSpacing: 1 }}>✕ Close</span>
      </div>

      <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 16 }}>
        Before anything else, this:
      </div>

      <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 14 }}>
        You might be here because the cost of past conflicts has stayed with you. Maybe the fault was yours. Maybe hers. Maybe both. Either way, the memory is real.
      </div>

      <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 14 }}>
        So when you sense signals of rising tension, something in you may already be preparing — your chest tightens, your jaw sets, an old alertness arrives before you've named it. That's not weakness. That's your body remembering.
      </div>

      <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 14 }}>
        And here's what's easy to forget in that moment: she probably doesn't want the conflict either. She's reaching for connection and support, even when the words sound like complaint, criticism, or attack.
      </div>

      <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 14 }}>
        Whether or not you were right doesn't change what happened between you. Two people reaching for connection can still wound each other when the patterns take over.
      </div>

      <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 14 }}>
        What follows are patterns you may recognize (what you're feeling), a short explanation of how it may resonate with your partner (how it may land for her), and suggestions for alternatives (what you might try instead).
      </div>

      <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, marginBottom: 24 }}>
        These are suggestions, not scripts. You know your relationship. Use what fits, leave what doesn't.
      </div>

      <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 20, marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: T.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>The four patterns</div>
        <div style={{ fontSize: 13, color: T.text, lineHeight: 1.7, marginBottom: 16 }}>
        These patterns can appear in almost every long-term relationship — yours, hers, everyone's. Reading them isn't about diagnosing her. It's about recognizing what's happening between you, so you can step out of it.
        </div>
        {topics.filter(t => t.category === "pattern").map((t, i) => (
          <div
            key={i}
            onClick={() => setView(i)}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}
          >
            <div style={{ fontSize: 13, color: T.text }}>
              <span style={{ fontStyle: "italic", color: T.accent }}>{t.shortTitle}</span>
              <span style={{ color: T.muted }}> — {t.shortDesc}</span>
            </div>
            <span style={{ fontSize: 14, color: T.muted }}>›</span>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 11, color: T.accent, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Other situations</div>
        {topics.map((t, i) => t.category === "situation" && (
          <div
            key={i}
            onClick={() => setView(i)}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${T.border}`, cursor: "pointer" }}
          >
            <div style={{ fontSize: 13, color: T.text, fontStyle: "italic" }}>
              {t.shortTitle}
            </div>
            <span style={{ fontSize: 14, color: T.muted }}>›</span>
          </div>
        ))}
      </div>

      <div
        onClick={() => setView("repair")}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, cursor: "pointer", marginBottom: 24 }}
      >
        <div style={{ fontSize: 13, color: T.accent, fontStyle: "italic" }}>
          A note on repair
        </div>
        <span style={{ fontSize: 14, color: T.accent }}>›</span>
      </div>

      <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.7, marginBottom: 12 }}>
        This kit draws on research and writing from John Gottman and others on what makes long relationships last — and what slowly erodes them.
      </div>

      <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.7, marginBottom: 12 }}>
        It's intended for the phase before therapy may be needed. Not a replacement for it.
      </div>

      <div style={{ fontSize: 12, color: T.muted, lineHeight: 1.7, marginBottom: 12 }}>
        It's not the right resource for situations involving personality disorders, trauma, or relationships with abuse or violence. If any of these apply, please reach out to a qualified professional.
      </div>
    </div>
  );
}
