"use client";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="state-box">
      <span className="state-icon">✕</span>
      <span className="state-msg" style={{ color: "var(--danger)" }}>
        {error.message ?? "Something went wrong."}
      </span>
      <button className="btn" onClick={reset} style={{ marginTop: "0.5rem" }}>
        Try again
      </button>
    </div>
  );
}
