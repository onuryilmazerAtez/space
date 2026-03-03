import { useEffect, useRef, useState } from "react";
import { Drawer } from "antd";

// ─── Keyframe CSS ─────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

  @keyframes dna-left {
    0%   { transform: translateX(-5px) scale(0.7); opacity: 0.4; }
    50%  { transform: translateX(5px)  scale(1);   opacity: 1;   }
    100% { transform: translateX(-5px) scale(0.7); opacity: 0.4; }
  }

  @keyframes dna-right {
    0%   { transform: translateX(5px)  scale(1);   opacity: 1;   }
    50%  { transform: translateX(-5px) scale(0.7); opacity: 0.4; }
    100% { transform: translateX(5px)  scale(1);   opacity: 1;   }
  }

  @keyframes c-exit {
    from { transform: rotateX(0deg)   translateY(0);    opacity: 1; }
    to   { transform: rotateX(50deg)  translateY(50%);  opacity: 0; }
  }

  @keyframes c-enter {
    from { transform: rotateX(-50deg) translateY(-50%); opacity: 0; }
    to   { transform: rotateX(0deg)   translateY(0);    opacity: 1; }
  }

  .c-step-exiting {
    animation: c-exit 0.4s cubic-bezier(0.4,0,0.2,1) forwards;
    transform-origin: center bottom;
  }

  .c-step-entering {
    animation: c-enter 0.4s cubic-bezier(0.4,0,0.2,1) forwards;
    transform-origin: center top;
  }

  @keyframes dot-blink-anim {
    0% { opacity: 0; }
    20% { opacity: 1; }
    100% { opacity: 0; }
  }
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

// ─── DNA Helix Spinner ──────────────────────────────────────────────────────

function DnaSpinner() {
    const c1 = "#6c63ff";
    const c2 = "#00b894";
    const rows = 5;
    const dur = "0.8s";

    return (
        <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", gap: 1.5, width: 20, height: 22, flexShrink: 0,
        }}>
            {Array.from({ length: rows }).map((_, i) => {
                const delay = `${(i * 0.12).toFixed(2)}s`;
                return (
                    <div key={i} style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        width: 16, position: "relative", height: 3,
                    }}>
                        <div style={{
                            width: 3.5, height: 3.5, borderRadius: "50%", background: c1,
                            animation: `dna-left ${dur} ease-in-out ${delay} infinite`,
                            position: "absolute",
                        }} />
                        <div style={{
                            width: 3.5, height: 3.5, borderRadius: "50%", background: c2,
                            animation: `dna-right ${dur} ease-in-out ${delay} infinite`,
                            position: "absolute",
                        }} />
                    </div>
                );
            })}
        </div>
    );
}

// ─── Ticker (flip-in/out text, only during processing) ──────────────────────

function Ticker({ current }) {
    const [items, setItems] = useState([{ id: 0, step: current, phase: "idle" }]);
    const counterRef = useRef(1);
    const prevStepRef = useRef(current);

    const text = "#1c1c1e";
    const muted = "#8e8e93";

    useEffect(() => {
        if (current === prevStepRef.current) return;
        prevStepRef.current = current;
        const newId = counterRef.current++;
        setItems(prev => prev.map(it =>
            it.phase === "idle" ? { ...it, phase: "exiting" } : it
        ));
        setItems(prev => [...prev, { id: newId, step: current, phase: "entering" }]);
        const t = setTimeout(() => {
            setItems([{ id: newId, step: current, phase: "idle" }]);
        }, 450);
        return () => clearTimeout(t);
    }, [current]);

    return (
        <div style={{
            flex: 1, position: "relative", height: 36, overflow: "hidden",
            perspective: 400,
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)",
        }}>
            {items.map(({ id, step, phase }) => {
                const cls = phase === "exiting" ? "c-step-exiting"
                    : phase === "entering" ? "c-step-entering"
                        : undefined;
                return (
                    <div key={id} className={cls} style={{
                        position: "absolute", inset: 0,
                        display: "flex", flexDirection: "column",
                        justifyContent: "center", gap: 2,
                        backfaceVisibility: "hidden",
                    }}>
                        <div style={{
                            fontSize: "0.78rem", fontWeight: 500,
                            color: text, lineHeight: 1.25,
                            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                        }}>
                            {step.label}
                            {step.status === "active" || step.status === "done" ? (
                                <span style={{ display: "inline-block", marginLeft: 2, marginRight: 8 }}>
                                    <span style={{ animation: "dot-blink-anim 1.4s infinite both", animationDelay: "0s" }}>.</span>
                                    <span style={{ animation: "dot-blink-anim 1.4s infinite both", animationDelay: "0.2s" }}>.</span>
                                    <span style={{ animation: "dot-blink-anim 1.4s infinite both", animationDelay: "0.4s" }}>.</span>
                                </span>
                            ) : null}
                        </div>
                        <div style={{
                            fontSize: "0.68rem", color: muted,
                            whiteSpace: "nowrap",
                        }}>
                            {step.meta}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ─── Finished summary (gray text + chevron + expandable tool list) ───────────

function FinishedSummary({ steps }) {
    const [expanded, setExpanded] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedStep, setSelectedStep] = useState(null);
    const muted = "#8e8e93";
    const lineColor = "#dadce0";

    const openDrawer = (step, e) => {
        e.stopPropagation();
        setSelectedStep(step);
        setDrawerOpen(true);
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif" }}>
            {/* Summary row — clickable */}
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
                    style={{
                        transform: expanded ? "rotate(180deg)" : "none",
                        transition: "transform 0.25s ease",
                    }}
                >
                    <path d="M3 4.5l3 3 3-3" stroke={muted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </button>

            {/* Expandable tool list with timeline */}
            <div style={{
                overflow: "hidden",
                maxHeight: expanded ? steps.length * 52 + 20 : 0,
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
                            display: "flex", flexDirection: "column", gap: 2,
                            fontSize: "0.72rem", color: "#5f6368",
                            lineHeight: 1.4, padding: "8px 0 8px 10px",
                            position: "relative",
                        }}>
                            {/* Checkmark icon on the timeline line */}
                            <div style={{
                                position: "absolute",
                                left: -15,
                                top: 12,
                                width: 9, height: 9,
                                background: "white",
                                zIndex: 2, flexShrink: 0,
                                display: "flex", alignItems: "center", justifyContent: "center"
                            }}>
                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke={i === steps.length - 1 ? "#1a73e8" : "#34a853"} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>

                            {/* Step label row with Detail button */}
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <span style={{ fontWeight: 500, color: "#3c4043" }}>{step.label}</span>
                                <button
                                    onClick={(e) => openDrawer(step, e)}
                                    style={{
                                        background: "none", border: "none", cursor: "pointer",
                                        padding: 0, margin: 0,
                                        fontSize: "0.70rem", color: "#1a73e8",
                                        fontWeight: 500, textDecoration: "underline",
                                        fontFamily: "'Inter', sans-serif",
                                        lineHeight: 1,
                                    }}
                                >
                                    Detail
                                </button>
                            </div>
                            <span style={{ color: "#9aa0a6" }}>{step.meta}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Detail Drawer */}
            <Drawer
                title={selectedStep?.label || ""}
                placement="right"
                width={480}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                {selectedStep && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                        <div>
                            <div style={{
                                fontSize: "0.75rem", fontWeight: 600, color: "#5f6368",
                                textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8,
                            }}>
                                Arguments
                            </div>
                            <pre style={{
                                background: "#f8f9fa", border: "1px solid #e8eaed",
                                borderRadius: 8, padding: "12px 14px",
                                fontSize: "0.75rem", color: "#1c1c1e",
                                margin: 0, overflowX: "auto", whiteSpace: "pre-wrap",
                                wordBreak: "break-word", fontFamily: "monospace",
                            }}>
                                {selectedStep.arguments
                                    ? (typeof selectedStep.arguments === "string"
                                        ? selectedStep.arguments
                                        : JSON.stringify(selectedStep.arguments, null, 2))
                                    : "No arguments"}
                            </pre>
                        </div>

                        <div>
                            <div style={{
                                fontSize: "0.75rem", fontWeight: 600, color: "#5f6368",
                                textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8,
                            }}>
                                Result
                            </div>
                            <pre style={{
                                background: "#f8f9fa", border: "1px solid #e8eaed",
                                borderRadius: 8, padding: "12px 14px",
                                fontSize: "0.75rem", color: "#1c1c1e",
                                margin: 0, overflowX: "auto", whiteSpace: "pre-wrap",
                                wordBreak: "break-word", fontFamily: "monospace",
                            }}>
                                {selectedStep.result
                                    ? (typeof selectedStep.result === "string"
                                        ? selectedStep.result
                                        : JSON.stringify(selectedStep.result, null, 2))
                                    : "No result"}
                            </pre>
                        </div>
                    </div>
                )}
            </Drawer>
        </div>
    );
}


// ─── Main component ───────────────────────────────────────────────────────────

export default function AIActionIndicator2({
    steps = DEFAULT_STEPS,
    interval = 1200,
    onFinish,
}) {
    const [currentStep, setCurrentStep] = useState(steps[0] || { label: "", meta: "", status: "done" });
    const [finished, setFinished] = useState(false);

    useEffect(() => {
        if (!steps.length) return;
        setCurrentStep(steps[0]);
        setFinished(false);

        let idx = 0;
        let done = false;

        const timer = setInterval(() => {
            if (done) return;
            const next = idx + 1;
            if (next < steps.length) {
                idx = next;
                setCurrentStep(steps[idx]);
            } else {
                done = true;
                clearInterval(timer);
                setTimeout(() => {
                    setFinished(true);
                    onFinish?.();
                }, 600);
            }
        }, interval);

        return () => clearInterval(timer);
    }, [steps, interval, onFinish]);

    return (
        <>
            <style>{css}</style>

            {finished ? (
                /* Finished: gray text + chevron + expandable tool list */
                <FinishedSummary steps={steps} />
            ) : (
                /* Processing: spinning orb + flip ticker */
                <div style={{
                    display: "flex", alignItems: "center", gap: 12,
                    width: 260, fontFamily: "'Inter', sans-serif",
                }}>
                    <DnaSpinner />
                    <Ticker current={currentStep} />
                </div>
            )}
        </>
    );
}
