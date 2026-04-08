export default function AlertMessage({ type = "error", message }) {
  if (!message) return null;
  return <div className={`form-${type}`}>{message}</div>;
}