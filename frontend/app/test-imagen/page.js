"use client";
import { useState, useRef } from "react";

const API = "https://educacionenlinea-production.up.railway.app";

export default function TestImagenCloudinary() {
  const [usuarioId, setUsuarioId] = useState("");
  const [preview, setPreview] = useState(null);
  const [archivo, setArchivo] = useState(null);
  const [respuesta, setRespuesta] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  const seleccionarImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setArchivo(file);
    setPreview(URL.createObjectURL(file));
    setRespuesta(null);
    setError(null);
  };

  const subirImagen = async () => {
    if (!usuarioId.trim()) return setError("Ingresa el ID del usuario");
    if (!archivo) return setError("Selecciona una imagen primero");

    setCargando(true);
    setError(null);
    setRespuesta(null);

    try {
      const formData = new FormData();
      formData.append("usuario_id", usuarioId.trim());
      formData.append("imagen", archivo);

      const res = await fetch(`${API}/usuarios/imagen`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al subir imagen");
      setRespuesta(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div style={s.badge}>☁️ Cloudinary</div>
        <h1 style={s.titulo}>Subir Imagen de Perfil</h1>
        <p style={s.subtitulo}>PUT /usuarios/imagen</p>
      </div>

      <div style={s.card}>

        {/* ID Usuario */}
        <div style={s.campo}>
          <label style={s.label}>👤 ID del Usuario</label>
          <input
            style={s.input}
            type="number"
            placeholder="Ej: 1, 2, 3..."
            value={usuarioId}
            onChange={(e) => setUsuarioId(e.target.value)}
          />
          <span style={s.hint}>Puedes consultarlo en GET /usuarios</span>
        </div>

        {/* Dropzone */}
        <div style={s.campo}>
          <label style={s.label}>🖼️ Imagen de perfil</label>
          <div style={s.dropzone} onClick={() => inputRef.current.click()}>
            {preview ? (
              <img src={preview} alt="preview" style={s.preview} />
            ) : (
              <div style={s.dropInner}>
                <span style={{ fontSize: 40 }}>📁</span>
                <span style={s.dropTexto}>Click para seleccionar</span>
                <span style={s.dropSub}>JPG · PNG · WEBP</span>
              </div>
            )}
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={seleccionarImagen}
          />
          {archivo && (
            <p style={s.nombreArchivo}>
              📎 {archivo.name} — {(archivo.size / 1024).toFixed(1)} KB
            </p>
          )}
        </div>

        {/* Botón */}
        <button
          style={{ ...s.btn, opacity: cargando ? 0.6 : 1, cursor: cargando ? "not-allowed" : "pointer" }}
          onClick={subirImagen}
          disabled={cargando}
        >
          {cargando ? "⏳ Subiendo..." : "🚀 Subir imagen de perfil"}
        </button>

        {/* Error */}
        {error && (
          <div style={s.errorBox}>
            <span>❌</span><span>{error}</span>
          </div>
        )}

        {/* Éxito */}
        {respuesta && (
          <div style={s.exitoBox}>
            <p style={s.exitoTitulo}>✅ ¡Imagen subida correctamente!</p>
            {respuesta.imagen_url && (
              <>
                <img src={respuesta.imagen_url} alt="subida" style={s.imagenSubida} />
                <p style={s.urlLabel}>URL guardada en BD:</p>
                <a href={respuesta.imagen_url} target="_blank" rel="noopener noreferrer" style={s.urlLink}>
                  {respuesta.imagen_url}
                </a>
              </>
            )}
            <p style={s.jsonLabel}>Respuesta del servidor:</p>
            <pre style={s.json}>{JSON.stringify(respuesta, null, 2)}</pre>
          </div>
        )}

        {/* Info */}
        <div style={s.infoBox}>
          <p style={s.infoTitulo}>📋 Detalles de la petición</p>
          <div style={s.infoFila}><span style={s.infoKey}>Método</span><code style={{ ...s.infoCode, color: "#60a5fa" }}>PUT</code></div>
          <div style={s.infoFila}><span style={s.infoKey}>URL</span><code style={s.infoCode}>{API}/usuarios/imagen</code></div>
          <div style={s.infoFila}><span style={s.infoKey}>Body</span><code style={s.infoCode}>form-data: usuario_id + imagen</code></div>
        </div>

      </div>
    </div>
  );
}

const s = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
    fontFamily: "'Segoe UI', sans-serif",
    padding: "40px 16px",
    color: "#fff",
  },
  header: { textAlign: "center", marginBottom: "28px" },
  badge: {
    display: "inline-block",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "20px",
    padding: "4px 16px",
    fontSize: "13px",
    marginBottom: "10px",
  },
  titulo: {
    fontSize: "30px", fontWeight: "700", margin: "0 0 6px",
    background: "linear-gradient(90deg, #a78bfa, #60a5fa)",
    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  subtitulo: { color: "rgba(255,255,255,0.4)", fontSize: "13px", fontFamily: "monospace", margin: 0 },
  card: {
    maxWidth: "540px", margin: "0 auto",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px", padding: "28px",
    display: "flex", flexDirection: "column", gap: "20px",
    backdropFilter: "blur(10px)",
  },
  campo: { display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "14px", fontWeight: "600", color: "rgba(255,255,255,0.75)" },
  input: {
    background: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "10px", padding: "12px",
    color: "#fff", fontSize: "15px", outline: "none",
    width: "100%", boxSizing: "border-box",
  },
  hint: { fontSize: "12px", color: "rgba(255,255,255,0.3)" },
  dropzone: {
    border: "2px dashed rgba(167,139,250,0.35)",
    borderRadius: "12px", minHeight: "150px",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer", background: "rgba(167,139,250,0.04)", overflow: "hidden",
  },
  dropInner: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" },
  dropTexto: { fontSize: "15px", color: "rgba(255,255,255,0.6)" },
  dropSub: { fontSize: "12px", color: "rgba(255,255,255,0.3)" },
  preview: { width: "100%", maxHeight: "200px", objectFit: "cover" },
  nombreArchivo: { fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0 },
  btn: {
    background: "linear-gradient(90deg, #7c3aed, #2563eb)",
    border: "none", borderRadius: "10px", color: "#fff",
    fontSize: "15px", fontWeight: "600", padding: "14px", width: "100%",
  },
  errorBox: {
    background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)",
    borderRadius: "10px", padding: "12px 16px",
    display: "flex", gap: "10px", alignItems: "center",
    fontSize: "14px", color: "#fca5a5",
  },
  exitoBox: {
    background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.25)",
    borderRadius: "12px", padding: "20px",
    display: "flex", flexDirection: "column", gap: "12px",
  },
  exitoTitulo: { fontSize: "15px", fontWeight: "600", color: "#86efac", margin: 0 },
  imagenSubida: {
    width: "100%", maxHeight: "180px", objectFit: "cover",
    borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)",
  },
  urlLabel: { fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0 },
  urlLink: { fontSize: "12px", color: "#60a5fa", wordBreak: "break-all" },
  jsonLabel: { fontSize: "12px", color: "rgba(255,255,255,0.4)", margin: 0 },
  json: {
    background: "rgba(0,0,0,0.35)", borderRadius: "8px",
    padding: "12px", fontSize: "12px", color: "#a78bfa", overflow: "auto", margin: 0,
  },
  infoBox: {
    background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: "10px", padding: "16px",
    display: "flex", flexDirection: "column", gap: "10px",
  },
  infoTitulo: { fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.5)", margin: 0 },
  infoFila: { display: "flex", alignItems: "center", gap: "12px", fontSize: "13px" },
  infoKey: { color: "rgba(255,255,255,0.35)", minWidth: "65px" },
  infoCode: {
    background: "rgba(0,0,0,0.3)", borderRadius: "4px",
    padding: "2px 8px", fontSize: "12px", color: "#a78bfa", wordBreak: "break-all",
  },
};