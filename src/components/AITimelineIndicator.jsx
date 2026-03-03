import { useEffect, useRef, useState } from "react";

// ─── Design tokens ────────────────────────────────────────────────────────────

const ACCENT = "#6c63ff";
const ACCENT2 = "#00b894";
const TEXT = "#1c1c1e";
const MUTED = "#8e8e93";

// ─── Keyframe CSS ─────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

  @keyframes b-exit {
    0%   { transform: translateY(0);    opacity: 1; }
    100% { transform: translateY(120%); opacity: 0; }
  }

  @keyframes b-enter {
    0%   { transform: translateY(-120%); opacity: 0; }
    100% { transform: translateY(0);     opacity: 1; }
  }

  @keyframes pulse-fill {
    0%, 100% { box-shadow: 0 0 0 0   rgba(108,99,255,0.4); }
    50%       { box-shadow: 0 0 0 4px rgba(108,99,255,0);   }
  }

  .b-step-exiting  { animation: b-exit  0.35s cubic-bezier(0.4,0,0.2,1) forwards; }
  .b-step-entering { animation: b-enter 0.35s cubic-bezier(0.4,0,0.2,1) forwards; }
  .b-dot-active    { animation: pulse-fill 1.4s ease infinite; }
`;

// ─── Default steps ────────────────────────────────────────────────────────────

const DEFAULT_STEPS = [
    { label: "Get Chapter Notes", meta: "3 fields returned", status: "done" },
    { label: "Get Chapter Notes", meta: "3 fields returned", status: "done" },
    { label: "Get Chapter Notes", meta: "3 fields returned", status: "done" },
    { label: "Get Chapter Notes", meta: "3 fields returned", status: "done" },
    { label: "Get Commodity Tree", meta: "4 fields returned", status: "done" },
    { label: "Get Commodity Tree", meta: "3 fields returned", status: "done" },
    { label: "Classification Complete", meta: "5 fields returned", status: "active" },
];

// ─── Dot ─────────────────────────────────────────────────────────────────────

function Dot({ status }) {
    const bg = status === "done" ? ACCENT2 : ACCENT;
    return (
        <div
            className={status === "active" ? "b-dot-active" : undefined}
            style={{
                position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                width: 13, height: 13, borderRadius: "50%", background: bg,
                zIndex: 2, flexShrink: 0,
            }}
        />
    );
}

// ─── Step row ────────────────────────────────────────────────────────────────

function StepRow({ step, phase }) {
    const cls = phase === "exiting" ? "b-step-exiting"
        : phase === "entering" ? "b-step-entering" : undefined;

    return (
        <div className={cls} style={{
            position: "absolute", inset: 0, paddingLeft: 24,
            display: "flex", flexDirection: "column", justifyContent: "center", gap: 2,
        }}>
            <Dot status={step.status} />
            <div style={{
                fontSize: "0.78rem", fontWeight: 500, color: TEXT,
                lineHeight: 1.25, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}>
                {step.label}
            </div>
            <div style={{ fontSize: "0.68rem", color: MUTED, whiteSpace: "nowrap" }}>
                {step.meta}
            </div>
        </div>
    );
}

// ─── Finished summary (gray text + chevron + expandable tool list) ───────────

function FinishedSummary({ steps }) {
    const [expanded, setExpanded] = useState(false);
    const muted = "#8e8e93";
    const lineColor = "#dadce0";
    const dotColor = "#9aa0a6";

    return (
        <div style={{ fontFamily: "'Inter', sans-serif" }}>
            <button
                onClick={() => setExpanded(e => !e)}
                style={{
                    display: "flex", alignItems: "center", gap: 6,
                    background: "none", border: "none", cursor: "pointer",
                    padding: 0, margin: 0, fontFamily: "'Inter', sans-serif",
                }}
            >
                <span style={{ fontSize: "0.78rem", color: muted, fontWeight: 500 }}>
                    {steps.length} tool executed
                </span>
                <svg
                    width="12" height="12" viewBox="0 0 12 12" fill="none"
                    style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.25s ease" }}
                >
                    <path d="M3 4.5l3 3 3-3" stroke={muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            <div style={{
                overflow: "hidden",
                maxHeight: expanded ? steps.length * 32 + 20 : 0,
                opacity: expanded ? 1 : 0,
                transition: "max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease",
            }}>
                <div style={{ marginTop: 8, position: "relative", paddingLeft: 14 }}>
                    {/* Vertical connecting line */}
                    <div style={{
                        position: "absolute",
                        left: 3,
                        top: 4,
                        bottom: 4,
                        width: 1.5,
                        background: lineColor,
                        borderRadius: 1,
                    }} />

                    {steps.map((step, i) => (
                        <div key={i} style={{
                            display: "flex", alignItems: "center", gap: 10,
                            fontSize: "0.72rem", color: "#5f6368",
                            lineHeight: 1.4, padding: "5px 0",
                            position: "relative",
                        }}>
                            <span style={{
                                position: "absolute",
                                left: -14,
                                top: "50%",
                                transform: "translate(0, -50%)",
                                width: 7, height: 7, borderRadius: "50%",
                                background: i === steps.length - 1 ? "#1a73e8" : dotColor,
                                border: `2px solid ${i === steps.length - 1 ? "#e8f0fe" : "white"}`,
                                zIndex: 2, flexShrink: 0,
                            }} />
                            <span style={{ fontWeight: 500, color: "#3c4043" }}>{step.label}</span>
                            <span style={{ color: "#9aa0a6" }}>\u2014 {step.meta}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function AITimelineIndicator({
    steps = DEFAULT_STEPS,
    interval = 1200,
    onFinish,
}) {
    const [items, setItems] = useState([{ id: 0, step: steps[0], phase: "idle" }]);
    const [finished, setFinished] = useState(false);

    const idxRef = useRef(0);
    const doneRef = useRef(false);
    const counterRef = useRef(1);
    const busyRef = useRef(false);

    function transition(next) {
        if (busyRef.current) return;
        busyRef.current = true;
        const newId = counterRef.current++;

        setItems(prev =>
            prev.map(it => it.phase === "idle" ? { ...it, phase: "exiting" } : it)
        );
        setItems(prev => [...prev, { id: newId, step: next, phase: "entering" }]);

        setTimeout(() => {
            setItems([{ id: newId, step: next, phase: "idle" }]);
            busyRef.current = false;
        }, 400);
    }

    useEffect(() => {
        idxRef.current = 0;
        doneRef.current = false;
        setFinished(false);
        setItems([{ id: counterRef.current++, step: steps[0], phase: "idle" }]);

        const timer = setInterval(() => {
            if (doneRef.current) return;
            const next = idxRef.current + 1;
            if (next < steps.length) {
                idxRef.current = next;
                transition(steps[next]);
            } else {
                doneRef.current = true;
                clearInterval(timer);
                setTimeout(() => {
                    setFinished(true);
                    onFinish?.();
                }, 600);
            }
        }, interval);

        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [steps, interval, onFinish]);

    if (finished) {
        return (
            <>
                <style>{css}</style>
                <FinishedSummary steps={steps} />
            </>
        );
    }

    return (
        <>
            <style>{css}</style>
            <div style={{
                position: "relative", width: 260, height: 33, overflow: "hidden",
                fontFamily: "'Inter', sans-serif",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)",
                maskImage: "linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)",
            }}>
                <div style={{
                    position: "absolute", left: 4, top: 0, bottom: 0, width: 2,
                    background: `linear-gradient(to bottom, ${ACCENT}, ${ACCENT2})`,
                    borderRadius: 2, zIndex: 1,
                }} />
                {items.map(({ id, step, phase }) => (
                    <StepRow key={id} step={step} phase={phase} />
                ))}
            </div>
        </>
    );
}
