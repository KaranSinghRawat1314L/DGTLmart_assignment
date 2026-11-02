export default function Notice({ message, onDismiss }) {
  if (!message) return null

  return (
    <div className="notice" role="alert">
      <span>{message}</span>
      <button type="button" onClick={onDismiss}>Dismiss</button>
    </div>
  )
}
