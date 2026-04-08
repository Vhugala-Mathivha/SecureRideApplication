export default function DriverTopbar({ title, subtitle }) {
  return (
    <header className="topbar">
      <h2 style={{ margin: 0 }}>{title}</h2>
      {subtitle ? (
        <p style={{ margin: "4px 0 0", color: "var(--text2)" }}>{subtitle}</p>
      ) : null}
    </header>
  );
}