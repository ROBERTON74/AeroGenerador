export default function LoadingScreen({ scene = false, message = 'Conectando con Red Eléctrica…' }) {
  return (
    <div className={`loading-screen${scene ? ' scene-loading' : ''}`} role="status" aria-live="polite">
      <div className="loading-mark" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
