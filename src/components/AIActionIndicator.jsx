import { useEffect, useRef, useState } from "react";

// ─── Default demo steps ───────────────────────────────────────────────────────

const FINISHED_STEP = {
    label: "Düşünme süreci",
    meta: "İşlem süreci",
    status: "finished",
};

// ─── Inline styles ────────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

  @keyframes ai-spin {
    to { transform: rotate(360deg); }
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

  .orb-spin {
    animation: ai-spin 1.6s linear infinite;
  }
`;

// ─── Icons ────────────────────────────────────────────────────────────────────

function ToolIcon({ color }) {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
    );
}

function CheckIcon({ color }) {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

// ─── Orb (spinning ring + icon) ──────────────────────────────────────────────

function Orb({ finished }) {
    const accent = "#6c63ff";
    const accent2 = "#00b894";
    const success = "#00b894";

    const ringBg = finished
        ? `conic-gradient(from 0deg, ${success} 100%, ${success} 100%)`
        : `conic-gradient(from 0deg, ${accent} 0%, ${accent2} 50%, transparent 50%)`;

    return (
        <div style={{
            position: "relative", width: 27, height: 27, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center"
        }}>
            {/* Spinning gradient ring */}
            <div
                className={finished ? undefined : "orb-spin"}
                style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: "50%",
                    background: ringBg,
                    WebkitMaskImage: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))",
                    maskImage: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))",
                }}
            />
            {/* Icon */}
            <div style={{
                position: "relative", zIndex: 1, width: 15, height: 15,
                display: "flex", alignItems: "center", justifyContent: "center"
            }}>
                {finished
                    ? <CheckIcon color={success} />
                    : <ToolIcon color={accent} />
                }
            </div>
        </div>
    );
}

// ─── Ticker (flip-in/out text) ────────────────────────────────────────────────

function Ticker({ current }) {
    const [items, setItems] = useState([{ id: 0, step: current, phase: "idle" }]);
    const counterRef = useRef(1);
    const prevStepRef = useRef(current);

    const text = "#1c1c1e";
    const muted = "#8e8e93";
    const success = "#00b894";

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
            flex: 1,
            position: "relative",
            height: 36,
            overflow: "hidden",
            perspective: 400,
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 28%, black 72%, transparent 100%)",
        }}>
            {items.map(({ id, step, phase }) => {
                const fin = step.status === "finished";
                const cls = phase === "exiting" ? "c-step-exiting"
                    : phase === "entering" ? "c-step-entering"
                        : undefined;
                return (
                    <div key={id} className={cls} style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        gap: 2,
                        backfaceVisibility: "hidden",
                    }}>
                        <div style={{
                            fontSize: "0.78rem",
                            fontWeight: fin ? 600 : 500,
                            color: fin ? success : text,
                            lineHeight: 1.25,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}>
                            {step.label}
                        </div>
                        <div style={{
                            fontSize: "0.68rem",
                            color: fin ? success : muted,
                            opacity: fin ? 0.75 : 1,
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

// ─── Main component ───────────────────────────────────────────────────────────

export default function AIActionIndicator({
    steps = [],
    interval = 1200,
    onFinish,
}) {
    const [currentStep, setCurrentStep] = useState(steps[0] || FINISHED_STEP);
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
                    setCurrentStep(FINISHED_STEP);
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
            <div style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: 260,
                fontFamily: "'Inter', sans-serif",
            }}>
                <Orb finished={finished} />
                <Ticker current={currentStep} />
            </div>
        </>
    );
}
