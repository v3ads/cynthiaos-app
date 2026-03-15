export default function HomePage() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "#f8fafc",
        gap: "1rem",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: 700, margin: 0 }}>
        CynthiaOS App Shell
      </h1>
      <p style={{ color: "#94a3b8", margin: 0 }}>
        Scaffold ready — TASK-011 complete.
      </p>
      <a
        href="/api/health"
        style={{
          marginTop: "0.5rem",
          padding: "0.5rem 1.25rem",
          backgroundColor: "#3b82f6",
          color: "#fff",
          borderRadius: "0.375rem",
          textDecoration: "none",
          fontSize: "0.875rem",
        }}
      >
        Health check →
      </a>
    </main>
  );
}
