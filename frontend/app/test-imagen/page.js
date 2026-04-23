export default function Home() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0c29",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontFamily: "sans-serif",
      flexDirection: "column",
      gap: "16px"
    }}>
      <h1>🎓 Educación en Línea</h1>
      <a href="/test-imagen" style={{ color: "#a78bfa" }}>
        → Probar subida de imagen a Cloudinary
      </a>
    </div>
  );
}