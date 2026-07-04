export default function LoadingScreen() {
  // Capa sencilla de espera mientras se obtiene el primer dato de viento/generacion.
  return (
    <div className="loading-screen">
      <div className="loading-mark" />
      <p>Conectando con Red Electrica...</p>
    </div>
  );
}

